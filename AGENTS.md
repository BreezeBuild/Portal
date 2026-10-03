<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Platform identifier contract

Every BreezeBuild-generated UUID, including `X-Request-ID` correlation IDs, must be UUIDv7. Use the maintained `uuid` package's `v7()` generator and its `validate()`/`version()` functions for inbound UUIDs; do not hand-write UUID generation or use `crypto.randomUUID()`, which creates UUIDv4 values. Accept an inbound correlation ID only when it is a valid UUIDv7; otherwise replace it with a new UUIDv7. External identifiers, including Clerk user IDs, are not subject to this rule.

## Browser API boundary

Next.js Route Handlers are BreezeBuild's browser-facing API layer; do not add a standalone Gateway service. Core owns local user provisioning and project/user metadata. Workspace owns project source code. Temporal will coordinate long-running cross-service workflows when the first such flow is implemented.

Use `withProvisionedUser` from `src/lib/protected-api.ts` for protected browser API routes. It verifies the Clerk session and checks Core for a provisioned local user on each request. The user-provisioning route is exempt so a new Clerk user can be created in Core. Forward the verified Clerk token and UUIDv7 request ID to downstream services, which must still enforce their own authentication and resource authorization.
