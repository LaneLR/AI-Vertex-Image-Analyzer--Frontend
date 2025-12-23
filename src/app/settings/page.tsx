import SettingsClient from "@/components/SettingsClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // 1. Security Check: Only logged-in users can see settings
  if (!token) {
    redirect("/login");
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    redirect("/login");
  }

  // 2. Return the UI. Since we aren't using DB for these settings,
  // we just render the client component with default values.
  return <SettingsClient />;
}