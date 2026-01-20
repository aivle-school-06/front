
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDecisionSupport = async (prompt: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are SENTINEL, a wise and calm owl-themed AI advisor for enterprise partner management. Provide strategic, calm, and insightful advice. Keep responses concise and high-level.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I apologize, but my wisdom is currently obscured by clouds. Please try again shortly.";
  }
};

export const analyzePartnerRisk = async (partnerData: any) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following partner for risk metrics: ${JSON.stringify(partnerData)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskLevel: { type: Type.STRING },
          analysis: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ["riskLevel", "analysis", "recommendation"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
