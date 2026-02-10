import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SecurityModule } from "../types";

export const analyzeSecurityContent = async (
  module: SecurityModule,
  text?: string,
  imageUrl?: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let systemInstruction = `
    You are "Raksha Sutra," a respectful, caring, and wise digital guardian for Indian elders. 
    Your tone is warm, protective, and professional.
    Your goal is to protect the user from digital harm and cyber fraud.
  `;

  let specificTask = "";
  
  switch (module) {
    case SecurityModule.NEWS:
      specificTask = "Analyze this news claim or video description for truth. Check for AI manipulation or fake rumors prevalent in India.";
      break;
    case SecurityModule.EMAIL:
      specificTask = "Analyze this email for phishing. Look for fake bank warnings, tax department impersonation, or suspicious attachments.";
      break;
    case SecurityModule.SMS:
      specificTask = "Analyze this SMS or WhatsApp message. Check for fake job offers, electricity bill threats, or prize winnings (KBC scams).";
      break;
    case SecurityModule.URL:
      specificTask = "Analyze this link. Check if it's a fake bank site (phishing), a dangerous download, or a scam portal.";
      break;
    case SecurityModule.PAYMENT:
      specificTask = "Analyze this payment request or scenario. Is it a QR code scam, an 'overpayment' scam, or a fake emergency request from a relative?";
      break;
    case SecurityModule.MEETING_LINK:
      specificTask = "Analyze this Google Meet, Zoom, or Microsoft Teams link. Check if it's a credential harvester, a suspicious redirect, or a platform for tech support scams.";
      break;
    case SecurityModule.JOB_FRAUD:
      specificTask = "Analyze this job offer or recruitment message. Check for 'work from home' scams, requests for registration fees, or fake company hiring.";
      break;
  }

  systemInstruction += `\n\nTask: ${specificTask}
    If the risk is HIGH, provide a very warm 'careMessage' in a respectful and protective manner for a senior citizen. 
    Avoid using kinship terms like 'Dada' or 'Dadi' in your response. Use simple, clear English. 
    Provide a riskScore from 0 to 100. Always use Google Search to verify recent fraud trends in India.
  `;

  const prompt = text 
    ? `Dear Raksha Sutra, please analyze this for me: "${text}"`
    : `Dear Raksha Sutra, please look at this image and tell me if it's safe.`;

  const contents: any = { parts: [] };
  if (text) contents.parts.push({ text: prompt });
  if (imageUrl) {
    const base64Data = imageUrl.split(',')[1];
    contents.parts.push({
      inlineData: { mimeType: 'image/jpeg', data: base64Data }
    });
    if (!text) contents.parts.push({ text: prompt });
  }

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
          reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
          verdict: { type: Type.STRING },
          careMessage: { type: Type.STRING }
        },
        required: ["headline", "summary", "riskFactor", "riskScore", "reasons", "verdict", "careMessage"]
      }
    }
  });

  const jsonResult = JSON.parse(response.text || "{}");
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter((chunk: any) => chunk.web)
    .map((chunk: any) => ({
      title: chunk.web.title,
      uri: chunk.web.uri
    }));

  return { ...jsonResult, sources: sources.slice(0, 3) };
};