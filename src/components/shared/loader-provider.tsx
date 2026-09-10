import { Suspense } from "react";
import { PageLoader } from "./page-loader";

export function LoaderProvider() {
  return (
    <Suspense fallback={null}>
      <PageLoader />
    </Suspense>
  );
}
