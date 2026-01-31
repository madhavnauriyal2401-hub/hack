
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult, RiskLevel } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeContent = async (
  text?: string,
  imageUrl?: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are "Raksha Sutra," a respectful, caring, and wise digital companion designed to protect elders from fake news and internet scams. 
    Your tone should be like a devoted grandchild or a trusted family friend—kind, patient, and protective.
    
    When you find something is likely fake or harmful:
    1. Don't just say "FAKE." Say something like "I'm a bit worried about this for you," or "This doesn't seem to be in your best interest."
    2. Use the 'careMessage' field to provide a warm, empathetic warning if the risk is high.
    3. Use simple, large-print-friendly language.
    
    Analysis criteria:
    - Determine if news text or images are authentic.
    - Risk Factor 0 (Completely Safe) to 100 (Very Harmful/Fake).
    - Always use Google Search for the latest facts.
  `;

  const prompt = text 
    ? `Dear Raksha Sutra, could you please check this for me: "${text}"`
    : `Dear Raksha Sutra, I found this image/video clip. Is it safe to believe?`;

  const contents: any = {
    parts: []
  };

  if (text) {
    contents.parts.push({ text: prompt });
  }

  if (imageUrl) {
    const base64Data = imageUrl.split(',')[1];
    contents.parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data
      }
    });
    if (!text) {
      contents.parts.push({ text: prompt });
    }
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
          headline: { type: Type.STRING, description: "A gentle title for the analysis" },
          summary: { type: Type.STRING, description: "A simple explanation of the news" },
          riskFactor: { type: Type.STRING, enum: ["LOW", "MEDIUM", "HIGH"] },
          riskScore: { type: Type.NUMBER },
          reasons: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Simple reasons for the caution level"
          },
          verdict: { type: Type.STRING, description: "Final clear verdict like 'This is safe' or 'Please be careful'" },
          careMessage: { type: Type.STRING, description: "A warm, personal message explaining why this might not be good for them if it's risky." }
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

  return {
    ...jsonResult,
    sources: sources.slice(0, 3)
  };
};
