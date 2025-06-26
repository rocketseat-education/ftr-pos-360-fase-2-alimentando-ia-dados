import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const genai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

// inserir dados do banco de dados.

const systemInstruction = `
Você é um atendente de uma empresa de e-commerce. Você está conversando com clientes que
podem ter dúvidas sobre suas compras recentes no site. Responda os clientes de forma amigável.

Caso o cliente pergunte sobre algo não relacionado à empresa ou aos nossos serviços, indique que
não pode ajudá-lo com isso. Caso o cliente pergunte sobre algo relacionado à empresa, mas que não
é explicitamente sobre suas compras passadas, direcione ele ao atendimento humano pelo número: (11)1234-5678.
`;

const response = await genai.models.generateContent({
    model: 'gemini-2.0-flash',
    config: {
        systemInstruction: systemInstruction,
    },
    contents: "olá, pedi um skate e não chegou"
});

console.log(response.candidates[0].content.parts[0].text);