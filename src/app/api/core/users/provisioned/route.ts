import { withProvisionedUser } from "@/lib/protected-api";

export async function GET(request: Request) {
  return withProvisionedUser(request, ({ requestId }) =>
    new Response(null, { status: 204, headers: { "X-Request-ID": requestId } }),
  );
}
