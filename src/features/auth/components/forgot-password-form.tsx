"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/validations/auth";
import { forgotPasswordAction } from "@/features/auth/actions/forgot-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setLoading(true);
    await forgotPasswordAction(data.email);
    setLoading(false);
    toast.success("Reset link sent!", {
      description:
        "If that email is registered, you'll receive a link shortly. Check your inbox.",
      duration: 5000,
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          padding: "16px 18px",
          background: "#f0fdf4",
          border: "1px solid #bbf7d0",
          borderRadius: "10px",
          fontSize: "14px",
          color: "#15803d",
        }}
      >
        <span style={{ fontSize: "18px", lineHeight: 1 }}>📬</span>
        <div>
          <p style={{ fontWeight: 600, margin: "0 0 4px" }}>Check your email</p>
          <p style={{ margin: 0, lineHeight: 1.6, color: "#166534" }}>
            If an account with that email exists, we&apos;ve sent a password
            reset link. It expires in 1 hour.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label
          htmlFor="email"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0951a5  ",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          suppressHydrationWarning
          style={{
            height: "44px",
            borderRadius: "10px",
            borderColor: errors.email ? "#ef4444" : "#e2e8f0",
            fontSize: "14px",
            width: "100%",
            boxSizing: "border-box",
          }}
          {...register("email")}
        />
        {errors.email && (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
            {errors.email.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        style={{
          height: "44px",
          width: "100%",
          background: loading ? "#1a6fd4 " : "#0951a5 ",
          color: "#fff",
          fontWeight: 600,
          fontSize: "14px",
          borderRadius: "10px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "4px",
        }}
      >
        {loading ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}
