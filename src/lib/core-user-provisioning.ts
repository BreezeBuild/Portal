import { v7 as uuidv7, validate as uuidValidate, version as uuidVersion } from "uuid";

const REQUEST_ID_HEADER = "X-Request-ID";

export function resolveRequestId(inboundRequestId: string | null) {
  if (inboundRequestId && uuidValidate(inboundRequestId) && uuidVersion(inboundRequestId) === 7) {
    return inboundRequestId.toLowerCase();
  }

  return uuidv7();
}

export async function provisionCoreUser(token: string, requestId: string, clerkUserId: string) {
  if (process.env.NEW_RELIC_LICENSE_KEY) {
    const newrelic = await import("newrelic");
    newrelic.addCustomAttribute("requestId", requestId);
    newrelic.addCustomAttribute("clerkUserId", clerkUserId);
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

    return new Response(await coreResponse.text(), {
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

export function apiError(status: number, requestId: string, message: string, errorCode: string) {
  return Response.json(
    { code: 0, message, errorCode, data: null },
    { status, headers: { [REQUEST_ID_HEADER]: requestId } },
  );
}
