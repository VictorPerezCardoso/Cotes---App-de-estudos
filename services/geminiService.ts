import { GoogleGenAI, Type } from "@google/genai";
import { Resource, QuizQuestion, AIQuizResponse } from "../types";

// NOTE: Ideally this comes from process.env, assuming it's injected in the runtime
const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const MODEL_FLASH = 'gemini-2.5-flash';

export const getLearningResources = async (topic: string): Promise<Resource[]> => {
  if (!API_KEY) {
    console.warn("API Key missing");
    return [];
  }

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: `Find 3 high-quality, distinct web resources about "${topic}". For each resource, provide the title, the URL, and a brief 1-sentence summary suitable for a student.`,
      config: {
        tools: [{ googleSearch: {} }],
        // We cannot use JSON schema with Google Search tool easily in one go efficiently without losing grounding data structure
        // So we will parse the grounding chunks or the text response manually/safely.
        temperature: 0.7,
      },
    });

    const resources: Resource[] = [];
    
    // Extract from Grounding Metadata if available (Best for real links)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks && chunks.length > 0) {
        chunks.forEach((chunk) => {
            if (chunk.web?.uri && chunk.web?.title) {
                // Deduplicate based on URI
                if (!resources.find(r => r.url === chunk.web?.uri)) {
                    resources.push({
                        title: chunk.web.title,
                        url: chunk.web.uri,
                        summary: "Resource found via Google Search." // Fallback summary
                    });
                }
            }
        });
    }

    // If grounding didn't give enough structured data, try to parse the text response
    // Or if we want better summaries, we could run a second pass, but let's stick to the search results for reliability.
    
    // Limit to 3
    return resources.slice(0, 3);

  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  if (!API_KEY) return [];

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: `Generate a quiz with 5 multiple-choice questions about "${topic}". 
      Return a JSON object with a property "questions" which is an array of objects.
      Each object must have: "question" (string), "options" (array of 4 strings), and "correctAnswerIndex" (integer 0-3).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswerIndex: { type: Type.INTEGER }
                },
                required: ["question", "options", "correctAnswerIndex"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No text returned from API");

    const parsed: AIQuizResponse = JSON.parse(text);
    return parsed.questions || [];

  } catch (error) {
    console.error("Error generating quiz:", error);
    // Fallback Mock Data in case of failure to prevent app crash
    return [
      {
        question: `Falha ao gerar perguntas sobre ${topic}. O que fazer?`,
        options: ["Tentar novamente", "Verificar internet", "Contactar suporte", "Todas as anteriores"],
        correctAnswerIndex: 3
      }
    ];
  }
};
