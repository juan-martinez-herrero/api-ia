export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const N8N_web = "https://xrhealth.app.n8n.cloud/webhook-test/890cdbb0-bc1d-40f2-b418-5ba09a1f21a1";

export async function POST(request: NextRequest) {
    try {
        const { prompt }: { prompt: string } = await request.json();
        const response = await axios.post(N8N_web, { prompt });
        return NextResponse.json({ data: response.data });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}