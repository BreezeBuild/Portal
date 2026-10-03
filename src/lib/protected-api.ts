import { auth } from "@clerk/nextjs/server";
import { apiError, resolveRequestId } from "@/lib/core-user-provisioning";

export type ProtectedApiContext = {
  clerkUserId: string;
  requestId: string;
  token: string;
};

export async function withProvisionedUser(
  request: Request,
  handler: (context: ProtectedApiContext) => Promise<Response> | Response,
): Promise<Response> {
  const requestId = resolveRequestId(request.headers.get("X-Request-ID"));
  const { getToken, userId } = await auth();
  const token = await getToken();

  if (!userId || !token) {
    return apiError(401, requestId, "Authentication is required.", "UNAUTHENTICATED");
  }

  const coreApiBaseUrl = process.env.CORE_API_BASE_URL;
  if (!coreApiBaseUrl) {
    return apiError(503, requestId, "Breeze Core is unavailable.", "CORE_UNAVAILABLE");
  }

  try {
    const response = await fetch(`${coreApiBaseUrl.replace(/\/$/, "")}/api/users/provisioned`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Request-ID": requestId,
      },
      cache: "no-store",
    });

    if (response.status === 428 || response.status === 401 || response.status === 403) {
      return new Response(await response.text(), {
        status: response.status,
        headers: {
          "content-type": response.headers.get("content-type") ?? "application/json",
          "X-Request-ID": requestId,
        },
      });
    }

    if (response.status !== 204) {
      return apiError(503, requestId, "Breeze Core is unavailable.", "CORE_UNAVAILABLE");
    }
  } catch {
    return apiError(503, requestId, "Breeze Core is unavailable.", "CORE_UNAVAILABLE");
  }

  return handler({ clerkUserId: userId, requestId, token });
}
