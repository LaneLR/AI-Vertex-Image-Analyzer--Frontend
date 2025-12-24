// eslint-disable-next-line @typescript-eslint/no-explicit-any
import HomeClient from "../components/HomeClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import User from "../lib/models/User";
import jwt from "jsonwebtoken";

async function getAuthData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findByPk(decoded.id);
    return user ? user.toJSON() : null;
  } catch {
    return null;
  }
}

export default async function Page() {
  const userData = await getAuthData();

  // Redirect if not logged in - prevents unauthorized scans
  if (!userData) {
    redirect("/login");
  }

  return <HomeClient initialUser={userData} />;
}