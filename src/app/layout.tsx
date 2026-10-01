import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BreezeBuild",
  description:
    "Describe your backend in plain English. BreezeBuild generates a real Spring Boot application, deploys it, and gives you a live preview to test against.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
          Set as props, not env vars. Clerk resolves these as
          `props.signInUrl || process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || ""`,
          and an empty value makes it fall back to Clerk's hosted Account
          Portal instead of these routes. The paths are identical in every
          environment, so hardcoding them here removes a per-environment
          variable that has to be remembered on each deploy target.
        */}
        <ClerkProvider
          signInUrl="/sign-in"
          signUpUrl="/sign-up"
          signInForceRedirectUrl="/auth/complete"
          signUpForceRedirectUrl="/auth/complete"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
