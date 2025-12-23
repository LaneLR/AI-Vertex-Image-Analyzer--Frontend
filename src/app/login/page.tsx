import LoginClient from "../../components/LoginClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Login | Flip Finder",
  description: "Log in to your Flip Finder account to manage your thrift appraisals.",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  // If the user is already logged in, send them to the home page
  if (token) {
    redirect("/");
  }

  return <LoginClient />;
}