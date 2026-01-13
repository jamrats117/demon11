
import { GoogleGenAI, Type } from "@google/genai";
import { HealthAdvice } from "../types";

export const getHealthAdvice = async (bmi: number, category: string, age: number, gender: string): Promise<HealthAdvice> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `As a friendly health coach, provide advice for a ${age}-year-old ${gender} with a BMI of ${bmi.toFixed(1)} (${category}). 
  Provide the response in Thai language.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A brief summary of the health status." },
          recommendations: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of general lifestyle recommendations."
          },
          dietTips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of dietary tips."
          }
        },
        required: ["summary", "recommendations", "dietTips"]
      }
    }
  });

  return JSON.parse(response.text);
};
