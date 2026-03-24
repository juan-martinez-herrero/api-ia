import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
const openai = new OpenAI();

export async function GET(request: NextRequest) {

    const response = await openai.responses.create({
        model: "gpt-4.1-mini",
        input: [{
            role: "user",
            content: [
                { type: "input_text", text: "Devuelveme una lista de tags para clasificar esta imagen. Tu respuesta debe ser solo los tags separados por comas." },
                {
                    type: "input_image",
                    image_url: "https://st5.depositphotos.com/30884172/65306/i/950/depositphotos_653064230-stock-photo-beautiful-picturesque-winding-country-road.jpg",
                    detail: "auto",
                },
            ],
        }],
    });

    console.log(response.output_text);

    return NextResponse.json({ response: response.output_text});
}