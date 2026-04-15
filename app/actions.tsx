'use server';

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { ActionResponse, RefactorResult, GeminiError } from '@/src/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function callGeminiWithRetry(
  model: GenerativeModel,
  prompt: string,
  retries = 3
) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (e: unknown) {
      // 2. Narrow 'e' to your APIError interface
      if (e instanceof Error) {
        const err = e as GeminiError;
        const status = err.status || err.response?.status;

        // Only retry on 429 (Rate Limit) or 500/503 (Server Error)
        if (status === 429 || (status !== undefined && status >= 500)) {
          const delay = Math.pow(2, i) * 1000;
          console.log(`Rate limited (${status}). Retrying in ${delay}ms...`);
          await wait(delay);
          continue;
        }

        // Throw immediately for 404, 400, etc.
        throw err;
      }

      // If 'e' isn't even an Error object, wrap it and throw
      throw new Error(String(e));
    }
  }
  return null;
}

export async function refactorCSS(oldCss: string): Promise<ActionResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest', // Use a stable model string
      generationConfig: {
        responseMimeType: 'application/json',
        maxOutputTokens: 2000,
      },
      systemInstruction: `You are a CSS refactoring engine. Transform legacy CSS into Tailwind v4 utility classes. 
            Return the result as a JSON array of objects: 
            [{ 
              "tailwindClasses": "string of classes", 
              "explanation": "why you chose these" 
            }]`,
    });

    const prompt = `Convert this legacy CSS to Tailwind v4 utility classes: \n\n ${oldCss}`;
    const rawText = await callGeminiWithRetry(model, prompt);

    if (!rawText) {
      return {
        success: false,
        error: 'The AI failed to return a response after multiple attempts.',
      };
    }

    // 1. Parse JSON
    const parsed = JSON.parse(rawText);

    // 2. NORMALIZE: Ensure it is an array to match your frontend state
    const data = Array.isArray(parsed)
      ? (parsed as RefactorResult[])
      : ([parsed] as RefactorResult[]);

    return { success: true, data };
  } catch (e: unknown) {
    if (e instanceof Error) {
      const err = e as GeminiError;
      const status = err.status || err.response?.status;

      if (status === 404) {
        return { success: false, error: 'Model not found.' };
      }

      return { success: false, error: err.message };
    }

    return { success: false, error: 'An unexpected error occurred' };
  }
}
