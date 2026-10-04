# BreezeBuild

**v0.0.1 — very early days.** This is the frontend application for BreezeBuild,
built in public. Things will change, break, and get rewritten.

## The idea

You already know how to build a backend. You just don't want to spend another
afternoon on the same project setup, the same Gradle config, the same test
harness, the same deploy wiring.

BreezeBuild is meant to take a backend described in plain English and turn it
into a real **Spring Boot + PostgreSQL** application — provisioned, deployed to a
live preview, with Swagger docs and synthetic data to test against. Then you
iterate on it with AI agents that propose small, explained, reviewable changes
rather than dumping code on you.

The loop it's aiming at:

```
idea -> architecture -> small AI change -> human review -> test -> preview
```

Two things it is deliberately not:

- **Not a code generator that runs unattended.** Every meaningful change is
  small, explained, and waits for approval. The engineer stays in the driving
  seat.
- **Not for people who can't build backends.** It's for people who can, and
  would rather skip the repetitive parts.

It's opinionated on purpose: fixed project structure, conventions, testing
practices, and reliability patterns, so generated projects look like each other
and like something you'd actually ship.

## What's in this repo

The BreezeBuild frontend — the web application users sign in to and work in, not
a separate marketing site. It currently has the landing surface, authentication,
account setup, and the protected browser API boundary. The browser IDE, agent
panel, diff review, test runs, and live preview are still being built.

The platform services live in separate repositories: [Core](https://github.com/cychatwani/BreezeBuildCore)
owns users and project metadata; [Workspace](https://github.com/cychatwani/BreezeBuildWorkSpace)
will own generated source-code workspaces; and [Agentic](https://github.com/cychatwani/BreezeBuildAgentic)
is the Python/FastAPI AI service. Next.js Route Handlers are the browser-facing
API layer, not a standalone gateway. Core now queues project initialization
through Temporal, but the Workspace creation worker is not implemented yet.

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 + CSS Modules |
| Auth | Clerk |
| Animation | Motion |
| Graphics | Paper Shaders (WebGL dithering) |
| Font | Geist |
| Package manager | Yarn |

The initial target for generated projects is Java 21, Spring Boot, PostgreSQL,
Flyway, and Gradle. Later build and preview infrastructure is not in this repo.

## Running it

```bash
yarn install
yarn dev
```

Then open http://localhost:3000.

You'll need a `.env.local` with your own Clerk keys — the app won't boot without
them:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CORE_API_BASE_URL=http://localhost:8080
```

The fastest way to get those is `npx clerk@latest init`, which provisions a
development instance and writes the file for you. `.env.local` is gitignored —
keep it that way.

After Clerk sign-in or sign-up, Clerk redirects to the account setup page. Its
multi-step loader follows the real provisioning request to Breeze Core through
the same-origin API route. Signup shows the loader for at least two seconds; any
remaining time is spent on the final stage after provisioning succeeds. A slower
request keeps the loader up until it finishes. If setup fails, the page offers
a retry link and request ID. Next.js Route Handlers are the browser-facing API
layer; `CORE_API_BASE_URL` points to Core. The Clerk token and Core URL stay on
the server; `X-Request-ID` is propagated through the request. Protected browser
API routes check `GET /api/users/provisioned` in Core before forwarding work.
The provisioning route is exempt because it creates the local user.

To enable New Relic monitoring for the Next.js server, add
`NEW_RELIC_LICENSE_KEY` to `.env.local` or to your deployment's server-side
environment. The agent is inactive when the key is absent. The Node.js runtime
uses New Relic's Next.js hybrid instrumentation; the Edge runtime and browser
are not instrumented by this setup. The agent is named `BreezeBuild Web`.

## Status

| | |
|---|---|
| Version | 0.0.1 |
| Stage | Early web app with authentication and account setup; IDE in progress |
| Stability | None. Assume anything can move. |

## Collaboration

Create a feature branch for each change and open a pull request against `main`.
The `main` branch requires a PR. Changes are left for human review and merge on
GitHub; do not push directly to `main`.

## Feedback

I'd genuinely like to hear from developers who'd use something like this — what
would make it useful, and what would make you close the tab.

**contact@chirag45.dev**

Built by [Chirag Chatwani](https://chirag45.dev) — software engineer working on
backend systems and AI-powered tooling.

Built in public, one piece at a time.
