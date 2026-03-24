
import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {

    const VOICE_ID = 'erKgR0s8Y67t4iiHuA9R';

    const elevenlabs = new ElevenLabsClient();
    const audio = await elevenlabs.textToSpeech.convert(VOICE_ID, {
        text: 'Hola programadores, este es un ejemplo de texto a voz usando Eleven Labs y Next.js',
        modelId: 'eleven_multilingual_v2',
        outputFormat: 'mp3_44100_128',
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

    const audioPath = path.join(process.cwd(), 'public', 'elevenlabs', `audio_${new Date().toISOString().replace(/[:.]/g, '_')}.mp3`);
    await writeFile(audioPath, audioBuffer);

    return NextResponse.json({ path: `/elevenlabs/${path.basename(audioPath)}` });
}