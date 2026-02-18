
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPTS } from "../constants";
import { RiskLevel, AnalysisResult, QuizQuestion } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is not configured.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeLegalDocument = async (text: string): Promise<AnalysisResult> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this legal text: ${text}`,
    config: {
      systemInstruction: SYSTEM_PROMPTS.LEGAL_ANALYST,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 4000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          riskLevel: { type: Type.STRING, description: "One of SAFE, MODERATE, HIGH" },
          suggestedAction: { type: Type.STRING },
          clauses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalText: { type: Type.STRING },
                simplifiedText: { type: Type.STRING },
                relevantLaws: { type: Type.ARRAY, items: { type: Type.STRING } },
                riskRating: { type: Type.STRING }
              },
              required: ["originalText", "simplifiedText", "riskRating"]
            }
          }
        },
        required: ["summary", "riskLevel", "clauses"]
      }
    }
  });

  const rawJson = JSON.parse(response.text || '{}');
  return {
    ...rawJson,
    id: Math.random().toString(36).substr(2, 9),
    documentTitle: "Analyzed Document",
    createdAt: new Date().toISOString()
  };
};

export const generateQuiz = async (context: string): Promise<QuizQuestion[]> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a 3-question quiz for this legal context: ${context}`,
    config: {
      systemInstruction: SYSTEM_PROMPTS.QUIZ_GENERATOR,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.NUMBER, description: "0-indexed" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const performDeepResearch = async (query: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: query,
    config: {
      systemInstruction: SYSTEM_PROMPTS.DEEP_RESEARCHER,
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 8000 }
    }
  });

  return {
    text: response.text || "No research findings available.",
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const fetchLegalNews = async () => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Fetch and summarize the top 5 most important legal news updates from India for today.",
    config: {
      systemInstruction: SYSTEM_PROMPTS.NEWS_AGGREGATOR,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            impact: { type: Type.STRING },
            date: { type: Type.STRING },
            source: { type: Type.STRING }
          },
          required: ["title", "summary", "impact", "date", "source"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};
