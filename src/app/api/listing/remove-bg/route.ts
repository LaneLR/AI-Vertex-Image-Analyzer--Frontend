import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Adjust path as needed

// IMPORTANT: Replace this with the actual URL of your deployed Python service
const REMBG_SERVICE_URL = process.env.REMBG_SERVICE_URL || ''; 

export async function POST(req: NextRequest) {
  // Optional: Add authentication/authorization check here
  // For example, check if the user is subscribed to a tier that allows this feature.
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // You might want to check the user's subscription status here
  // const user = await db.getUser(session.user.id);
  // if (user.subscriptionStatus === 'basic') {
  //   return NextResponse.json({ error: "Subscription required for this feature" }, { status: 403 });
  // }


  if (!req.body) {
    return NextResponse.json({ error: "No request body provided" }, { status: 400 });
  }

  try {
    // Forward the FormData directly to the Python microservice
    const rembgResponse = await fetch(REMBG_SERVICE_URL, {
      method: 'POST',
      body: req.body, 
      // @ts-expect-error 
      duplex: 'half',
    });

    if (!rembgResponse.ok) {
      const errorText = await rembgResponse.text();
      console.error(`Rembg service error: ${rembgResponse.status} - ${errorText}`);
      return NextResponse.json({ error: `Rembg service failed: ${errorText}` }, { status: rembgResponse.status });
    }

    // Get the image blob from the Python service response
    const imageBlob = await rembgResponse.blob();

    // Create a data URL for the image so it can be displayed/downloaded on the frontend
    const reader = new FileReader();
    const dataUrlPromise = new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageBlob);
    });

    const dataUrl = await dataUrlPromise;

    return NextResponse.json({ url: dataUrl });

  } catch (error: any) {
    console.error("Error in Next.js background removal proxy:", error);
    return NextResponse.json({ error: error.message || "Failed to process image" }, { status: 500 });
  }
}