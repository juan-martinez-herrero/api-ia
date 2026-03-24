
import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {

    const elevenlabs = new ElevenLabsClient();

   const audio = await elevenlabs.music.compose({
        prompt: "Create an upbeat, cheerful track perfect for a commercial, a romantic comedy scene, or a sunny day. Use bright acoustic guitars, a simple and catchy melody on piano or synth, light and lively percussion, and a rhythmic bassline. The tempo should be 110–130 bpm, with a focus on positive energy, warm chord progressions, and an overall atmosphere that inspires happiness and carefree joy.",
        musicLengthMs: 10000,
    });

    // Convertir el audio a un buffer si es necesario
    let audioBuffer;
    if (audio instanceof Uint8Array) {
        audioBuffer = Buffer.from(audio);
    } else if (audio instanceof ArrayBuffer) {
        audioBuffer = Buffer.from(new Uint8Array(audio));
    } else if (typeof audio === 'string') {
        audioBuffer = Buffer.from(audio, 'binary');
    } else if (audio && typeof audio.getReader === 'function') {
        // Si es un ReadableStream, leerlo completamente
        const reader = audio.getReader();
        let chunks = [];
        let done = false;
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            if (value) chunks.push(...value);
            done = doneReading;
        }
        audioBuffer = Buffer.from(chunks);
    } else {
        throw new Error('Formato de audio no soportado');
    }

    const musicDir = path.join(process.cwd(), 'public', 'elevenlabs', 'music');
    const audioFileName = `audio_${new Date().toISOString().replace(/[:.]/g, '_')}.mp3`;
    const audioPath = path.join(musicDir, audioFileName);
    await writeFile(audioPath, audioBuffer);

    return NextResponse.json({ path: `/elevenlabs/music/${audioFileName}` });
}