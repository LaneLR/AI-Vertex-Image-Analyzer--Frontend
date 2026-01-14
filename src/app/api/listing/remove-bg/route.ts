// app/api/listing/remove-bg/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    // Call Hugging Face (update URL to your actual Space URL)
    const response = await fetch("https://lkaynlee123-background-remover.hf.space/remove_background", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    // 1. Get the image data as a buffer
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    // 2. Return the binary data DIRECTLY with image headers
    return new Response(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}