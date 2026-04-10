'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ActionResponse, RefactorResult } from "@/src/types";
import { GenerativeModel } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const wait = (ms: number) => new Promise(res => setTimeout(res,ms));

// exponential backoff
async function callGeminiWithRetry(model: GenerativeModel, prompt: string, retries = 3){
    for (let i = 0; i<retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return await result.response.text();
        } catch (e) {
            const error = e as Error;
            const delay = Math.pow(2,i)*1000;
            console.log(`Rate limited. Retrying in ${delay}ms...`);
            await wait(delay);
            continue; 
            throw error; // If it's a 404 or other error, stop and throw
        }
    }
}


export async function refactorCSS(oldCss: string): Promise<ActionResponse>{
    try {
        const model = genAI.getGenerativeModel({
        model: "gemini-3.1-flash-lite-preview",
        generationConfig: { responseMimeType: "application/json",maxOutputTokens: 2000, // Give it plenty of room to finish the thought 
        },
        systemInstruction: `You are a CSS refactoring engine. Transform legacy CSS into Tailwind v4 utility classes. 
            Return the result as a JSON object: 
            { f
            'tailwindClasses': 'string of classes', 
            'explanation': 'why you chose these' 
            }`
        });
        const prompt = `Convert this legacy CSS to Tailwind v4 utility classes: \n\n ${oldCss}`;
        const rawText = await callGeminiWithRetry(model, prompt);
        if(!rawText) {
            return {
                success: false,
                error: "The AI failed to return a response after multiple attempts."
            }
        }
        const data = JSON.parse(rawText) as RefactorResult;
        return {success: true, data};
    } catch (e) {
        interface ApiError {
            status?: number;
            response?: { status?:number };
        }

        const apiError = e as ApiError;
        const status = apiError.status || apiError.response?.status;

        if(status === 404) {
            return {success: false, error: "Model not found. Check your model string."}
        }
        const message = e instanceof Error ? e.message : "An unknown error occurred";
        return { success: false, error: message };
    }
}