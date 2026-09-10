"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resendVerificationAction } from "@/features/auth/actions/resend-verification";

export function ResendVerificationBanner() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function handleResend() {
    if (!email.trim()) return;
    setLoading(true);
    await resendVerificationAction(email);
    setLoading(false);
    setSent(true);
  }

  return (
    <div
      style={{
        padding: "12px 14px",
        background: "var(--color-background-warning)",
        borderLeft: "2px solid var(--color-border-warning)",
        borderRadius: 0,
        fontSize: "13px",
        color: "var(--color-text-warning)",
        marginBottom: "1.25rem",
      }}
    >
      {sent ? (
        <p>Verification email sent — check your inbox.</p>
      ) : (
        <>
          <p style={{ marginBottom: showForm ? "10px" : 0 }}>
            Your email is not verified.{" "}
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  color: "var(--color-text-warning)",
                  textDecoration: "underline",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Resend verification email
              </button>
            )}
          </p>
          {showForm && (
            <div style={{ display: "flex", gap: "8px" }}>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1 }}
              />
              <Button
                onClick={handleResend}
                disabled={loading || !email.trim()}
              >
                {loading ? "Sending…" : "Send"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
