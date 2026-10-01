"use client";

import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { authLoadingStates } from "./loading-states";

export default function Loading() {
  return <MultiStepLoader loading loadingStates={authLoadingStates} event={0} />;
}
