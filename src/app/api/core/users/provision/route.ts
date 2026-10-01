import { auth } from "@clerk/nextjs/server";
import { apiError, provisionCoreUser, resolveRequestId } from "@/lib/core-user-provisioning";

export async function POST(request: Request) {
  const requestId = resolveRequestId(request.headers.get("X-Request-ID"));
  const { getToken, userId } = await auth();
  const token = await getToken();

  if (!token || !userId) {
    return apiError(401, requestId, "Authentication is required.", "UNAUTHENTICATED");
  }

  return provisionCoreUser(token, requestId, userId);
}
