import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
const openai = new OpenAI();

export async function GET(request: NextRequest) {

    // Generate an audio response to the given prompt
    const response = await openai.chat.completions.create({
        model: "gpt-4o-audio-preview",
        modalities: ["text", "audio"],
        audio: { voice: "alloy", format: "wav" },
        messages: [
            {
                role: "user",
                content: "Hola Mundo programadores"
            }
        ],
        store: true,
    });

    // Inspect returned data
    console.log(response.choices[0]);

    // Write audio data to a file
    // Generate dynamic filename with date and time
    const now = new Date();
    const filename = `audio_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}.wav`;
    const filePath = `public/audios/${filename}`;
    if (
        response.choices[0]?.message?.audio?.data
    ) {
        fs.writeFileSync(
            filePath,
            Buffer.from(response.choices[0].message.audio.data, 'base64'),
            { encoding: "utf-8" }
        );
    } else {
        console.error("Audio data is missing in the response.");
        return NextResponse.json({ error: "Audio data is missing in the response." }, { status: 500 });
    }

    return NextResponse.json({});
}