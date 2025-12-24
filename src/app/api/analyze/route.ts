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
      },
    });

    const prompt = `
You are an expert in item identification and resale value. 
When provided an image or images, you provide in this format the potential resale price range of the item, a title of the item, and a short 3 to 5 sentence description of what the item is and what it last sold for (be as descriptive as possible).

If there is not enough information you can get from the images to determine its worth based on its condition or you cannot determine the item based on the images, you can respond with the message "Could not determine value. Please provide another image of the item with more detail.". 
You can curate the message to what it is you need for information or details about, for example "Please provide another image of the item with better lighting.". You can also follow up the response with another question for better determining the valuation if needed, "Take a picture of the serial number for more accurate valuation." or "Take a picture of the book's Copyright Page for a more accurate valuation.". 
If follow-up images are provided and add more context to the valuation, update the value range of the item accordingly. 

Do not offer help, such as "Want me to find the particular brand for you?". 
Instead just tell the user to take an image or what details you need to get a better valuation. 
Do not ask the user questions. 
Give only a statement about the item for the description.

If the image is a picture of food, a person or people, an animal or livestock, or non-tangible things like ghosts or fake AI generated images, return a response like "Image does not meet criteria for analysis." 
If the image is something personal that should not be shared or is not for resale, for example an insulin pump or personal medical equipment, return a response like "Image does not meet criteria for analysis."
These sorts of images should not be used to give a valuation in any case or instance. 

CRITERIA:
- If the image is food, people, animals, or non-tangible/AI-generated items, return ONLY: {"error": "Image does not meet criteria for analysis."}
- If you cannot identify the item, return ONLY: {"error": "Could not determine value. Please provide another image of the item with more detail."}
- If the image is something personal that should not be shared or is not for resale, return ONLY: {"error": "Image does not meet criteria for analysis."}
OUTPUT FORMAT:
You must return a valid JSON object. Do not include any markdown formatting.

{
  "priceRange": "$X - $Y",
  "title": "Item Name",
  "description": "3 to 5 sentence description including what the item is and what it last sold for. Be descriptive.",
  "platform": "Primary Marketplace Name",
  "sources": [
    "Marketplace Name - sold for $Price (Condition)",
    "Marketplace Name - listed for $Price (Condition)",
    "Marketplace Name - listed for $Price (Condition)"
  ]
}

DATA SOURCING:
Search marketplaces like eBay, WhatNot, Facebook Marketplace, and other resale sites and auction sites. 
List 1-3 real-world sold or listed examples in the 'sources' array. 
Do not ask questions or offer extra help. 
Provide statements only.
Prioritize checking eBay, Facebook Marketplace, Craigslist, and WhatNot first before checking other sites online.
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
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 500 }
    );
  }
}
