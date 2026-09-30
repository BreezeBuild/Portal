import { auth } from "@clerk/nextjs/server";
import { v7 as uuidv7, validate as uuidValidate, version as uuidVersion } from "uuid";

const REQUEST_ID_HEADER = "X-Request-ID";

export async function POST(request: Request) {
  const requestId = resolveRequestId(request.headers.get(REQUEST_ID_HEADER));
  const { getToken } = await auth();
  const token = await getToken();

  if (!token) {
    return apiError(401, requestId, "Authentication is required.", "UNAUTHENTICATED");
  }

  const coreApiBaseUrl = process.env.CORE_API_BASE_URL;
  if (!coreApiBaseUrl) {
    return apiError(503, requestId, "Breeze Core is unavailable.", "CORE_UNAVAILABLE");
  }

  try {
    const coreResponse = await fetch(`${coreApiBaseUrl.replace(/\/$/, "")}/api/users/provision`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        [REQUEST_ID_HEADER]: requestId,
      },
      cache: "no-store",
    });

    return new Response(coreResponse.body, {
      status: coreResponse.status,
      headers: {
        "content-type": coreResponse.headers.get("content-type") ?? "application/json",
        [REQUEST_ID_HEADER]: coreResponse.headers.get(REQUEST_ID_HEADER) ?? requestId,
      },
    });
  } catch {
    return apiError(502, requestId, "Breeze Core is unavailable.", "CORE_UNAVAILABLE");
  }
}

function resolveRequestId(inboundRequestId: string | null) {
  if (inboundRequestId && uuidValidate(inboundRequestId) && uuidVersion(inboundRequestId) === 7) {
    return inboundRequestId.toLowerCase();
  }

  return uuidv7();
}

function apiError(status: number, requestId: string, message: string, errorCode: string) {
  return Response.json(
    { code: 0, message, errorCode, data: null },
    { status, headers: { [REQUEST_ID_HEADER]: requestId } },
  );
}
