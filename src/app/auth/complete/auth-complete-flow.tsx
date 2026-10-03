"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { authLoadingStates } from "./loading-states";

const SIGNUP_MINIMUM_MS = 2_000;
const FINAL_STAGE = authLoadingStates.length - 1;

export function AuthCompleteFlow({ isSignup }: { isSignup: boolean }) {
  const router = useRouter();
  const startedAt = useRef<number | null>(null);
  const provisionRequest = useRef<Promise<Response> | null>(null);
  const [stage, setStage] = useState(0);
  const [provisioned, setProvisioned] = useState(false);
  const [finalStageSettled, setFinalStageSettled] = useState(false);
  const [errorRequestId, setErrorRequestId] = useState<string | null | undefined>();

  useEffect(() => {
    startedAt.current ??= performance.now();
    let active = true;
    queueMicrotask(() => {
      if (active) setStage(1);
    });

    // Keep one request across React's development effect replay.
    provisionRequest.current ??= fetch("/api/core/users/provision", {
      method: "POST",
      cache: "no-store",
    });

    provisionRequest.current.then((response) => {
      if (!active) return;
      if (response.status === 401) {
        router.replace("/sign-in");
      } else if (!response.ok) {
        setErrorRequestId(response.headers.get("X-Request-ID"));
      } else {
        setProvisioned(true);
        setStage(FINAL_STAGE);
      }
    }).catch(() => {
      if (active) setErrorRequestId(null);
    });

    return () => { active = false; };
  }, [router]);

  const handleStageSettled = useCallback((settledStage: number) => {
    if (settledStage === FINAL_STAGE) setFinalStageSettled(true);
  }, []);

  useEffect(() => {
    if (!provisioned || !finalStageSettled) return;

    const elapsed = performance.now() - (startedAt.current ?? performance.now());
    const remaining = isSignup ? Math.max(0, SIGNUP_MINIMUM_MS - elapsed) : 0;
    const redirectTimer = window.setTimeout(() => router.replace("/dashboard"), remaining);
    return () => window.clearTimeout(redirectTimer);
  }, [finalStageSettled, isSignup, provisioned, router]);

  if (errorRequestId !== undefined) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 px-6">
        <h1 className="text-2xl font-semibold">We couldn&apos;t finish setting up your account.</h1>
        <p>Please try again. Your Clerk sign-in is complete.</p>
        <a className="underline" href={isSignup ? "/auth/complete?flow=signup" : "/auth/complete"}>Try again</a>
        {errorRequestId && <p className="text-sm opacity-70">Request ID: {errorRequestId}</p>}
      </main>
    );
  }

  return (
    <MultiStepLoader
      loading
      loadingStates={authLoadingStates}
      event={stage}
      onStageSettled={handleStageSettled}
    />
  );
}
