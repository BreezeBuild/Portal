import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { provisionCoreUser, resolveRequestId } from "@/lib/core-user-provisioning";

export default async function AuthCompletePage() {
  const { getToken, userId } = await auth();
  const token = await getToken();

  if (!token || !userId) {
    redirect("/sign-in");
  }

  const requestId = resolveRequestId(null);
  const response = await provisionCoreUser(token, requestId, userId);

  if (response.ok) {
    redirect("/");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">We couldn&apos;t finish setting up your account.</h1>
      <p>Please try again. Your Clerk sign-in is complete.</p>
      <a className="underline" href="/auth/complete">Try again</a>
      <p className="text-sm opacity-70">Request ID: {requestId}</p>
    </main>
  );
}
