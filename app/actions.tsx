'use server'

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const wait = (ms: number) => new Promise(res => setTimeout(res,ms));

// exponential backoff
async function callGeminiWithRetry(model: any, prompt: string, retries = 3){
    for (let i = 0; i<retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            return await result.response.text();
        } catch (error: any) {
            const delay = Math.pow(2,i)*1000;
            console.log(`Rate limited. Retrying in ${delay}ms...`);
            await wait(delay);
            continue; 
            throw error; // If it's a 404 or other error, stop and throw
        }
    }
}

function cleanJSON(text: string) {
    const match = text.match(/```json?\n?([\s\S]*?)\n?```/);
    const cleaned = match ? match[1]: text;
    return cleaned.trim();
}

export async function refactorCSS(oldCss: string){
    try {
        console.log("DEBUG: Is API Key present?", !!process.env.GEMINI_API_KEY);
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
        const data = JSON.parse(rawText);
        return {success: true, data};
    } catch (error: any) {
        console.error("FINAL_ERROR:", error.message);
        return {
            sucess: false,
            error: error.status === 404
            ? "Model name outdate. Try gemini-2.5-flash."
            : error.message
        }
    }
}