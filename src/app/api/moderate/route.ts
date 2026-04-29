import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not defined");
      return NextResponse.json({ status: "review", reason: "AI Service not configured" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      Analise o seguinte anúncio para uma plataforma exclusiva de doação e troca de ÓCULOS DE GRAU.
      Título: ${title}
      Descrição: ${description}

      A plataforma proíbe qualquer item que não seja óculos de grau (roupas, eletrônicos, móveis, acessórios genéricos que não são armações de grau, etc).
      Responda EXCLUSIVAMENTE em formato JSON puro:
      {
        "status": "approved" | "blocked" | "review",
        "reason": "string explicando o motivo se for bloqueado ou para revisão"
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    const text = response.text || "{}";
    const moderation = JSON.parse(text);
    
    return NextResponse.json(moderation);
  } catch (error) {
    console.error("Error in moderation API:", error);
    return NextResponse.json({ status: "review", reason: "Error in AI moderation" }, { status: 500 });
  }
}
