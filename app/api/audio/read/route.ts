import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
const openai = new OpenAI();

export async function GET(request: NextRequest) {

    // Fetch an audio file and convert it to a base64 string
    const url = "https://cdn.openai.com/API/docs/audio/alloy.wav";
    const audioResponse = await fetch(url);
    const buffer = await audioResponse.arrayBuffer();
    const base64str = Buffer.from(buffer).toString("base64");

    const response = await openai.chat.completions.create({
        model: "gpt-4o-audio-preview",
        modalities: ["text", "audio"],
        audio: { voice: "alloy", format: "wav" },
        messages: [
            {
                role: "user",
                content: [
                    { type: "text", text: "¿Qué hay en esta grabación? Traducemela al español." },
                    { type: "input_audio", input_audio: { data: base64str, format: "wav" } }
                ]
            }
        ],
        store: true,
    });

    console.log(response.choices[0]);

    return NextResponse.json({ response: response.choices[0]});
}