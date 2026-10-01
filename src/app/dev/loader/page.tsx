import { notFound } from "next/navigation";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { authLoadingStates } from "@/app/auth/complete/loading-states";

export default function LoaderPreviewPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <main>
      <MultiStepLoader
        loading
        loadingStates={authLoadingStates}
        duration={1_500}
        loop={false}
      />
    </main>
  );
}
