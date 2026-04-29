import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Verify it's an INSERT trigger from ads table
    if (payload.type !== 'INSERT' || payload.table !== 'ads') {
      return NextResponse.json({ message: 'Ignored' }, { status: 200 });
    }

    const ad = payload.record;

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not defined');
      return NextResponse.json({ error: 'AI Service not configured' }, { status: 500 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing Supabase credentials for Admin Client');
      return NextResponse.json({ error: 'Database service not configured' }, { status: 500 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
      Analise o seguinte anúncio para uma plataforma exclusiva de doação e troca de ÓCULOS DE GRAU.
      Título: ${ad.title}
      Descrição: ${ad.description}

      A plataforma proíbe qualquer item que não seja óculos de grau (roupas, eletrônicos, móveis, acessórios genéricos que não são armações de grau, etc).
      Responda EXCLUSIVAMENTE em formato JSON puro:
      {
        "status": "active" | "blocked" | "review",
        "reason": "string explicando o motivo se for bloqueado ou para revisão"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "{}";
    const moderation = JSON.parse(text);

    // Default to review if AI fails to return active or blocked explicitly
    let newStatus = 'review';
    if (moderation.status === 'active' || moderation.status === 'blocked') {
      newStatus = moderation.status;
    }

    // Update the ad in the database
    const { error } = await supabaseAdmin
      .from('ads')
      .update({ status: newStatus })
      .eq('id', ad.id);

    if (error) {
      console.error('Failed to update ad status:', error);
      return NextResponse.json({ error: 'Failed to update ad status' }, { status: 500 });
    }

    return NextResponse.json({ success: true, newStatus });
  } catch (error) {
    console.error('Error in webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
