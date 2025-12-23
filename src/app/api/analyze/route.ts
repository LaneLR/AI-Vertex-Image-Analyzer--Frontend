import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Using gemini-1.5-flash which is standard in late 2025 for this use case
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      // FORCING structured output via generationConfig
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `
    Act as an expert in item identification and resale value. Analyze the provided image.

CRITERIA:
- If the image is food, people, animals, or non-tangible/AI-generated items, return ONLY: {"error": "Image does not meet criteria for analysis."}
- If you cannot identify the item, return ONLY: {"error": "Could not determine value. Please provide another image of the item with more detail."}

OUTPUT FORMAT:
You must return a valid JSON object. Do not include any markdown formatting like.

{
  "priceRange": "$X - $Y",
  "title": "Item Name",
  "description": "3 to 5 sentence description including what the item is and what it last sold for. Be descriptive.",
  "platform": "Primary Marketplace Name",
  "sources": [
    "Marketplace Name - sold for $Price (Condition)",
    "Marketplace Name - listed for $Price (Condition)"
  ]
}

DATA SOURCING:
Search marketplaces like eBay, OfferUp, Facebook Marketplace, and other resale sites and auction sites. List 1-3 real-world sold or listed examples in the 'sources' array. Do not ask questions or offer extra help.
    `;

    const result = await model.generateContent([
      { text: prompt },
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        },
      },
    ]);

    const response = await result.response;
    const jsonResponse = JSON.parse(response.text());

    // 422 Unprocessable Entity for valid requests that don't meet criteria (e.g., a photo of a dog)
    if (jsonResponse.error) {
      return NextResponse.json({ error: jsonResponse.error }, { status: 422 });
    }

    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
  }
}