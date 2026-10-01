import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { AuthCompleteFlow } from "./auth-complete-flow";

export default async function AuthCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string | string[] }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const isSignup = (await searchParams).flow === "signup";
  return <AuthCompleteFlow isSignup={isSignup} />;
}
