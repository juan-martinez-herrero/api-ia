import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
const openai = new OpenAI();

export async function GET(request: NextRequest) {

    const prompt = `
        Un programador delante de su computadora, con una taza de café al lado, en una oficina moderna y luminosa.
        `;

    const result = await openai.images.generate({
        model: "gpt-image-1",
        prompt,
    });

    // Nombre dinámico con la fecha actual
    const now = new Date();
    const filename = `image_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}.png`;
    const image_base64 = result.data?.[0]?.b64_json;
    if (!image_base64) {
        return NextResponse.json({ error: "No image data returned from OpenAI." }, { status: 500 });
    }
    const image_bytes = Buffer.from(image_base64, "base64");
    const imagePath = `${process.cwd()}/public/images/${filename}`;
    fs.writeFileSync(imagePath, image_bytes);

    return NextResponse.json({ filename });
}