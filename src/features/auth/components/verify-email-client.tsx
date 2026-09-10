"use client";

import { useEffect, useState } from "react";
import { verifyEmailAction } from "@/features/auth/actions/verify-email";
import { resendVerificationAction } from "@/features/auth/actions/resend-verification";
import Link from "next/link";
import { ROUTES } from "@/config/app";
import { Button } from "@/components/ui/button";

type Status = "loading" | "success" | "expired" | "invalid";

export function VerifyEmailClient({ token }: { token: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    verifyEmailAction(token).then((res) => {
      if (res.success) {
        setStatus("success");
      } else if (res.error?.includes("expired")) {
        setStatus("expired");
      } else {
        setStatus("invalid");
      }
    });
  }, [token]);

  async function handleResend() {
    if (!email.trim()) return;
    setResending(true);
    await resendVerificationAction(email);
    setResending(false);
    setResent(true);
  }

  if (status === "loading") {
    return (
      <p style={{ color: "var(--color-text-secondary)", fontSize: "14px" }}>
        Verifying your email…
      </p>
    );
  }

  if (status === "success") {
    return (
      <>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "var(--color-background-success)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}
        >
          <i
            className="ti ti-check"
            style={{ fontSize: "22px", color: "var(--color-text-success)" }}
            aria-hidden="true"
          />
        </div>
        <p style={{ fontWeight: 500, marginBottom: "6px" }}>Email verified!</p>
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-secondary)",
            marginBottom: "1.25rem",
          }}
        >
          Your account is now active.
        </p>
        <Link href={ROUTES.login}>
          <Button style={{ width: "100%" }}>Sign in to your account</Button>
        </Link>
      </>
    );
  }

  if (status === "expired") {
    return (
      <>
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "var(--color-background-warning)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1rem",
          }}
        >
          <i
            className="ti ti-clock"
            style={{ fontSize: "22px", color: "var(--color-text-warning)" }}
            aria-hidden="true"
          />
        </div>
        <p style={{ fontWeight: 500, marginBottom: "6px" }}>Link expired</p>
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-secondary)",
            marginBottom: "1.25rem",
          }}
        >
          This verification link has expired. Enter your email to get a new one.
        </p>
        {resent ? (
          <p style={{ fontSize: "14px", color: "var(--color-text-success)" }}>
            New verification email sent — check your inbox.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%" }}
            />
            <Button
              onClick={handleResend}
              disabled={resending || !email.trim()}
              style={{ width: "100%" }}
            >
              {resending ? "Sending…" : "Resend verification email"}
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--color-background-danger)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1rem",
        }}
      >
        <i
          className="ti ti-x"
          style={{ fontSize: "22px", color: "var(--color-text-danger)" }}
          aria-hidden="true"
        />
      </div>
      <p style={{ fontWeight: 500, marginBottom: "6px" }}>Invalid link</p>
      <p
        style={{
          fontSize: "14px",
          color: "var(--color-text-secondary)",
          marginBottom: "1.25rem",
        }}
      >
        This link is invalid or has already been used.
      </p>
      <Link
        href={ROUTES.login}
        style={{ fontSize: "14px", color: "var(--color-text-info)" }}
      >
        Back to sign in
      </Link>
    </>
  );
}
