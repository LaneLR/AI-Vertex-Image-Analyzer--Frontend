// eslint-disable-next-line @typescript-eslint/no-explicit-any
import HomeClient from "../components/HomeClient";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <HomeClient initialUser={session.user?.email} />;
}
