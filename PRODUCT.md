# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are experienced backend engineers starting greenfield Spring Boot projects. They know how to build a backend and want to spend less time repeating setup, testing, and deployment work while retaining control over the code.

## Product Purpose

BreezeBuild is an AI-assisted platform for turning a backend idea into a Spring Boot application and iterating on it through small, explained changes. The intended workflow runs from an idea through architecture, human review, tests, and a live preview. Success means an engineer can reach a working backend faster and understand and approve each meaningful change.

## Positioning

Engineer-controlled AI development is the central promise: changes are small, explained, tested, and presented for human approval. BreezeBuild also follows opinionated project conventions so generated applications remain consistent and reviewable.

## Operating Context

Engineers use a browser application to describe a backend, inspect proposed code changes, review test results, and work with a live API preview. The intended output is a Spring Boot and PostgreSQL application. Clerk handles sign-in to the BreezeBuild web app.

## Capabilities and Constraints

- The current web app includes a landing page, Clerk sign-in and sign-up, account provisioning through Breeze Core, and an early authenticated dashboard. The dashboard is not yet evidence of a working project workspace.
- Project generation, AI-guided code iteration, diff approval, automated testing, synthetic data, and live preview are intended product capabilities; do not present them as implemented solely because they appear in marketing copy or illustrations.
- The web app uses Next.js, React, and TypeScript. Breeze Core is a separate Spring Boot service; the browser app is not the generated backend.
- Pricing, credits, vendor usage examples, and deployment infrastructure details shown on the landing page are provisional copy, not confirmed product commitments.

## Brand Commitments

The product name is BreezeBuild. The existing BreezeBuild logo, icon, favicon, and related exports are documented in `../BrandKit/README.md`; web assets already use this identity. Preserve those assets and the established product terminology unless the user changes them.

## Evidence on Hand

The repo README and landing page describe the intended workflow. The current routes and components demonstrate authentication, account provisioning, and an early dashboard. The workflow illustration and pricing examples are illustrative; the repo does not establish shipped generation or deployment results, customer testimonials, or validated pricing.

## Product Principles

1. Keep the engineer in control of meaningful code changes.
2. Make proposals small, explained, testable, and easy to review.
3. Reduce repetitive backend setup through consistent, opinionated conventions.
