import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, model } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        text: `Florence AI: Jawaban untuk "${prompt}". Server bot WhatsApp berjalan 24 jam dengan integrasi multi-device, fitur JadiBot pairing code, dan auto-restart daemon.`
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: model || "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
