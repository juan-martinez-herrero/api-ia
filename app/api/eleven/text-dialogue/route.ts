
import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {

    const VOICE_ID = 'erKgR0s8Y67t4iiHuA9R';
    const VOICE_ID_2 = 'kdmDKE6EkgrWrrykO9Qt';

    const elevenlabs = new ElevenLabsClient();
    const audio = await elevenlabs.textToDialogue.convert({
        inputs: [
            {
                "text": "[entusiasmado] ¿Viste el último artículo sobre cómo la IA está cambiando el desarrollo de software? ¡Es una locura!",
                "voiceId": VOICE_ID
            },
            {
                "text": "[cauteloso] Sí, lo vi. Me preocupa un poco que seamos reemplazados. ¿Realmente crees que es solo una herramienta y no una amenaza?",
                "voiceId": VOICE_ID_2
            },
            {
                "text": "[convencido] Yo lo veo como un copiloto, no un reemplazo. La IA nos quita las tareas repetitivas para que podamos enfocarnos en la creatividad y la arquitectura. Nos hace más eficientes.",
                "voiceId": VOICE_ID
            },
            {
                "text": "[pensativo] Supongo que tienes razón. El tiempo que ahorraríamos depurando código... Es un punto a favor. ¿Crees que todos los desarrolladores deberían empezar a usarla?",
                "voiceId": VOICE_ID_2
            },
            {
                "text": "[seguro] Sin duda. Es como aprender un nuevo lenguaje de programación. El que no se adapte, se quedará atrás.",
                "voiceId": VOICE_ID
            }
        ],
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
        const chunks = [];
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

    const audioPath = path.join(process.cwd(), 'public', 'elevenlabs', 'dialogues', `audio_${new Date().toISOString().replace(/[:.]/g, '_')}.mp3`);
    await writeFile(audioPath, audioBuffer);

    return NextResponse.json({ path: `/elevenlabs/${path.basename(audioPath)}` });
}