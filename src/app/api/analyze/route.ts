import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";
import { Op } from "sequelize";
import SearchHistory from "@/lib/models/SearchHistory";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const LISTING_PROMPT = `
You are a professional e-commerce copywriter for eBay, Poshmark, and Amazon, and an expert in writing details for item listings with optimized for SEO. 
Analyze the image and create a high-converting product listing.
If multiple images are uploaded and each or all of the photos are not related to the same item, for example three photos are uploaded and two are of a stuffed animal and third of a sofa, return a response like "Images are not for the same item. Please select photos of the same item."  

OUTPUT FORMAT:
Return a valid JSON object:
{
  "title": "SEO-optimized title (max 80 chars)",
  "description": "Professional, bulleted description including features, condition, and specs.",
  "category": "Suggested marketplace category",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "specs": {
    "Brand": "Name",
    "Model": "Name/Number",
    "Condition": "Visual assessment",
    "Material/Type": "Details"
  }
}
`;

    const APPRAISAL_PROMPT = `
You are an expert in item identification and resale value. 
When provided an image or images, you provide in this format the potential resale price range of the item, a title of the item, a short 3 to 5 sentence description of what the item is and what it last sold for (be as descriptive as possible), and an estimated shipping cost.

If there is not enough information you can get from the images to determine its worth based on its condition or you cannot determine the item based on the images, you can respond with the message "Could not determine value. Please provide another image of the item with more detail.". 
You can curate the message to what it is you need for information or details about, for example "Please provide another image of the item with better lighting.". You can also follow up the response with another question for better determining the valuation if needed, "Take a picture of the serial number for more accurate valuation." or "Take a picture of the book's Copyright Page for a more accurate valuation.". 
If follow-up images are provided and add more context to the valuation, update the value range of the item accordingly. 

Do not offer help, such as "Want me to find the particular brand for you?". 
Instead just tell the user to take an image or what details you need to get a better valuation. 
Do not ask the user questions. 
Give only a statement about the item for the description.

If the image or images are a picture of food, a person or people, an animal or livestock, or non-tangible things like ghosts or fake AI generated images, return a response like "Image(s) does not meet criteria for analysis." 
If the image or images are something personal that should not be shared or is not for resale, for example an insulin pump or personal medical equipment, return a response like "Image(s) does not meet criteria for analysis."
If multiple images are uploaded and each or all of the photos are not related to the same item, for example three photos are uploaded and two are of a stuffed animal and third of a sofa, return a response like "Images are not for the same item. Please select photos of the same item."  
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
  ],
  "estimatedShippingCost": "$X"
}

DATA SOURCING:
Search marketplaces like eBay, WhatNot, Facebook Marketplace, and other resale sites and auction sites. 
List 1-4 real-world sold or listed examples in the 'sources' array. 
Do not ask questions or offer extra help. 
Provide statements only.
Prioritize checking eBay, Facebook Marketplace, and Craigslist first before checking other sites online.
    `;

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findByPk(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const today = new Date().toISOString().split('T')[0];
    if (user.lastScanDate !== today) {
      await user.update({ dailyScansCount: 0, lastScanDate: today });
    }

    if (user.subscriptionStatus === 'basic' && user.dailyScansCount >= 5) {
      return NextResponse.json({ 
        error: "Daily scan limit reached. Please upgrade to Pro for unlimited scans." 
      }, { status: 429 });
    }

    const data = await req.formData();
    const mode = data.get("mode") || "appraisal";
    
    const files = data.getAll("image") as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    let activePrompt = APPRAISAL_PROMPT; 
    if (mode === "listing") {
      if (user.subscriptionStatus !== 'pro') {
        return NextResponse.json({ error: "Listing generation is a Pro feature." }, { status: 403 });
      }
      activePrompt = LISTING_PROMPT;
    }

    const imageParts = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType: file.type,
          },
        };
      })
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: { responseMimeType: "application/json" },
    });
    
    const result = await model.generateContent([
      { text: activePrompt },
      ...imageParts,
    ]);

    const response = await result.response;
    const jsonResponse = JSON.parse(response.text());

    if (jsonResponse.error) {
      return NextResponse.json({ error: jsonResponse.error }, { status: 422 });
    }

    if (mode === "appraisal") {
      await SearchHistory.create({
        userId: user.id,
        itemTitle: jsonResponse.title,
        priceRange: jsonResponse.priceRange,
        description: jsonResponse.description,
        platform: jsonResponse.platform || "Unidentified platform",
        sources: jsonResponse.sources || [],
      });
    }

    await user.increment('dailyScansCount');

    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 500 });
  }
}