import { Suspense } from "react";
import { VerifyEmailClient } from "@/features/auth/components/verify-email-client";

export const metadata = { title: "Verify your email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <Suspense
        fallback={
          <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
            Verifying your email…
          </p>
        }
      >
        <VerifyEmailClient token={token ?? ""} />
      </Suspense>
    </div>
  );
}
