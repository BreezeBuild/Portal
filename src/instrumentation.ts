export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || !process.env.NEW_RELIC_LICENSE_KEY) {
    return;
  }

  await import("newrelic");
}
