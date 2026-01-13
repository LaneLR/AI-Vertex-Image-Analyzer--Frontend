import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Adjust path as needed

// IMPORTANT: Replace this with the actual URL of your deployed Python service
const REMBG_SERVICE_URL = process.env.REMBG_SERVICE_URL || 'https://lkaynlee123-background-remover.hf.space/remove_background'; 

export async function POST(req: NextRequest) {
  try {
    // 1. Get the data from your frontend
    const incomingData = await req.formData();
    const image = incomingData.get('image');

    if (!image) {
      return NextResponse.json({ error: "No image found in request" }, { status: 400 });
    }

    // 2. Create a NEW FormData object for the outgoing request
    const outgoingData = new FormData();
    outgoingData.append('image', image);

    // 3. Send to Hugging Face
    const response = await fetch("https://lkaynlee123-background-remover.hf.space/remove_background", {
      method: "POST",
      body: outgoingData,
      // DO NOT set the Content-Type header. Fetch will set it automatically 
      // with the correct boundary string if you pass a FormData body.
      // @ts-expect-error
      duplex: 'half',
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Hugging Face error: ${errorText}` }, { status: response.status });
    }

    // 4. Send the image back to your frontend
    const imageBlob = await response.blob();
    return new NextResponse(imageBlob, {
      headers: { 'Content-Type': 'image/png' },
    });

  } catch (error: any) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}