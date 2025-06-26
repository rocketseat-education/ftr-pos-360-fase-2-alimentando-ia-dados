import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

const response = await genai.models.generateContent({
    model: 'gemini-2.0-flash',
    config: {},
    contents: "olá, tudo bom?"
});

console.log(response.candidates[0].content.parts[0].text);