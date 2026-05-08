/// <reference types="vite/client" />
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SecurityModule, FeedItem, GroundingSource } from "@/types";

const getApiKey = () => {
  // Prefer user specified MADDY, then default GEMINI_API_KEY
  return import.meta.env.VITE_MADDY || 
         import.meta.env.VITE_GEMINI_API_KEY || 
         (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : "") || 
         "";
};

export const generateSimulatedFeed = async (): Promise<FeedItem[]> => {
  try {
    const key = getApiKey();
    if (!key) {
      console.warn("Gemini API Key missing.");
      return [];
    }

    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 5 simulated social media posts (Twitter/WhatsApp style) about trending news in India. Mix real news with 2-3 pieces of subtle misinformation or fake news. Return as JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              author: { type: Type.STRING },
              content: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              platform: { type: Type.STRING, enum: ["Twitter", "Facebook", "WhatsApp"] }
            },
            required: ["id", "author", "content", "timestamp", "platform"]
          }
        }
      }
    });

    const text = response.text || "[]";
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating feed:", error);
    return [];
  }
};

export const analyzeSecurityContent = async (
  module: SecurityModule,
  text?: string,
  imageUrl?: string
): Promise<AnalysisResult> => {
  const key = getApiKey();
  if (!key) {
    throw new Error("Gemini API Key is missing. Please configure it in your Netlify or AI Studio environment.");
  }

  const ai = new GoogleGenAI({ apiKey: key });
  
  let systemInstruction = `
    You are "Raksha Sutra," a respectful, caring, and wise digital guardian for Indian elders. 
    Your tone is warm, protective, and professional.
    Your goal is to protect the user from digital harm and cyber fraud.
  `;

  let specificTask = "";
  
  switch (module) {
    case SecurityModule.NEWS:
      specificTask = "Analyze this news claim, article, or video content. Determine if it is a viral rumor, misinformation (fake news), or legitimate news. Pay close attention to topics common in India like celebrity death rumors, child lifter scares, or communal misinformation.";
      break;
    case SecurityModule.EMAIL:
      specificTask = "Analyze this email for phishing indices. Check for urgency, suspicious links, poor grammar, and impersonation of banks, income tax departments, or popular services like Netflix or Amazon.";
      break;
    case SecurityModule.SMS:
      specificTask = "Analyze this SMS or WhatsApp message. Look for 'electricity bill' scams, 'Part-time Job' scams, 'KBC' lottery wins, or 'Family Emergency' impersonation tactics used in India.";
      break;
    case SecurityModule.URL:
      specificTask = "Analyze this website address or link. Use Google Search to check if it has been reported as a phishing site, a retail scam, or if it impersonates a government or banking portal (e.g., sbi-online.com vs official sbi portal).";
      break;
    case SecurityModule.PAYMENT:
      specificTask = "Analyze this payment request or scenario. Determine if it is a 'Payment Request' scam (where you are asked to enter a PIN to receive money), an 'Overpayment' scam, or a fraudulent QR code.";
      break;
    case SecurityModule.MEETING_LINK:
      specificTask = "Analyze this invitation link (Zoom, Google Meet, Teams). Check if it's a known vector for tech support scams or credential harvesting.";
      break;
    case SecurityModule.JOB_FRAUD:
      specificTask = "Analyze this job offer. Check if it's a 'Data Entry' scam, requires a registration fee, or uses unprofessional communication common in recruitment scams.";
      break;
    default:
      specificTask = "Analyze this content for any digital security risks, particularly those targeting senior citizens in India.";
  }

  systemInstruction += `\n\nTask: ${specificTask}
    As Raksha Sutra, evaluate the content carefully.
    If the risk is HIGH, provide a caring, respectful warning. Avoid using 'Dada' or 'Dadi'.
    Risk score: 0 (Safe) to 100 (Dangerous).
    Always verify current trends using Google Search.
  `;

  const prompt = text 
    ? `Dear Raksha Sutra, please analyze this for me: "${text}"`
    : `Dear Raksha Sutra, please look at this image and tell me if it's safe.`;

  const contents: any = { parts: [{ text: prompt }] };
  if (imageUrl) {
    const base64Data = imageUrl.split(',')[1];
    contents.parts.push({
      inlineData: { mimeType: 'image/jpeg', data: base64Data }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction: systemInstruction.trim(),
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            summary: { type: Type.STRING },
            riskFactor: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
            riskScore: { type: Type.NUMBER },
            sourceCredibility: { type: Type.NUMBER },
            reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
            verdict: { type: Type.STRING },
            careMessage: { type: Type.STRING }
          },
          required: ["headline", "summary", "riskFactor", "riskScore", "reasons", "verdict", "careMessage"]
        }
      }
    });

    const outputText = response.text;
    if (!outputText) {
      throw new Error("The digital guardian was unable to provide an analysis. Please try again.");
    }

    const jsonResult = JSON.parse(outputText);
    
    // Grounding extraction
    let sources: GroundingSource[] = [];
    const candidate = response.candidates?.[0];
    if (candidate?.groundingMetadata?.groundingChunks) {
      sources = candidate.groundingMetadata.groundingChunks
        .filter((chunk: any) => chunk?.web)
        .map((chunk: any) => ({
          title: chunk.web.title || "External Verification",
          uri: chunk.web.uri || "#"
        }))
        .slice(0, 3);
    }

    return { ...jsonResult, sources };
  } catch (error: any) {
    console.error("Gemini Analysis Failure:", error);
    if (error?.message?.includes("API key not valid") || error?.message?.includes("invalid API key")) {
      throw new Error("Invalid API Key: Please check VITE_GEMINI_API_KEY or VITE_MADDY.");
    }
    throw error;
  }
};