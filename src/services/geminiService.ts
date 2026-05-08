/// <reference types="vite/client" />
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SecurityModule, FeedItem, GroundingSource } from "@/types";

const getApiKey = () => {
  // Use what's provided by the environment, preferring GEMINI_API_KEY
  return process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "";
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
      specificTask = "Analyze this news claim for truth. Check for AI manipulation or fake rumors prevalent in India.";
      break;
    case SecurityModule.EMAIL:
      specificTask = "Analyze this email for phishing. Look for fake bank warnings or suspicious attachments.";
      break;
    case SecurityModule.SMS:
      specificTask = "Analyze this SMS/WhatsApp message. Check for fake job offers or prize scams.";
      break;
    case SecurityModule.URL:
      specificTask = "Analyze this link for phishing or malware.";
      break;
    case SecurityModule.PAYMENT:
      specificTask = "Analyze this payment request. Is it a QR scam or fake emergency?";
      break;
    default:
      specificTask = "Analyze this for digital security risks in the Indian context.";
  }

  systemInstruction += `\n\nTask: ${specificTask}
    If the risk is HIGH, provide a caring message for a senior. Avoid terms like 'Dada'/'Dadi'. 
    Risk score 0-100. Use Google Search to verify trends.
  `;

  const prompt = text 
    ? `Analyze this: "${text}"`
    : `Please analyze this image for safety.`;

  const contents: any = { parts: [] };
  if (text) contents.parts.push({ text: prompt });
  if (imageUrl) {
    const base64Data = imageUrl.split(',')[1];
    contents.parts.push({
      inlineData: { mimeType: 'image/jpeg', data: base64Data }
    });
    if (!text) contents.parts.push({ text: prompt });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: contents,
      config: {
        systemInstruction,
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
      throw new Error("No response text from AI.");
    }

    const jsonResult = JSON.parse(outputText);
    
    // Improved grounding extraction
    let sources: GroundingSource[] = [];
    const candidate = (response as any).candidates?.[0];
    if (candidate?.groundingMetadata?.groundingChunks) {
      sources = candidate.groundingMetadata.groundingChunks
        .filter((chunk: any) => chunk?.web)
        .map((chunk: any) => ({
          title: chunk.web.title || "External Source",
          uri: chunk.web.uri || "#"
        }))
        .slice(0, 3);
    }

    return { ...jsonResult, sources };
  } catch (error: any) {
    console.error("Gemini Analysis Failure:", error);
    // Re-throw with more context if it's an API error
    if (error?.message?.includes("API key not valid")) {
      throw new Error("Invalid API Key. Please check your configuration.");
    }
    throw error;
  }
};