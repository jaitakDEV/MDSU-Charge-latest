"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/validations/auth";
import { resetPasswordAction } from "@/features/auth/actions/reset-password";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/config/app";
import Link from "next/link";

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  async function onSubmit(data: ResetPasswordInput) {
    setLoading(true);
    setError(null);
    const result = await resetPasswordAction(token, data.password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      toast.error("Password reset failed", {
        description: result.error,
        duration: 5000,
      });
      return;
    }

    toast.success("Password updated!", {
      description: "Your new password is set. Please sign in.",
      duration: 4000,
    });
    router.push(ROUTES.login + "?reset=success");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label
          htmlFor="password"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0951a5 ",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          New Password
        </Label>
        <div style={{ position: "relative" }}>
          <Input
            id="password"
            type={showPass ? "text" : "password"}
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            autoComplete="new-password"
            suppressHydrationWarning
            style={{
              height: "44px",
              borderRadius: "10px",
              borderColor: errors.password ? "#ef4444" : "#e2e8f0",
              fontSize: "14px",
              paddingRight: "90px",
              width: "100%",
              boxSizing: "border-box",
            }}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              color: "#94a3b8",
              fontWeight: 500,
              padding: 0,
              whiteSpace: "nowrap",
            }}
          >
            {showPass ? "Hide" : "Show password"}
          </button>
        </div>
        {errors.password && (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
            {errors.password.message}
          </p>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label
          htmlFor="confirmPassword"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#0951a5 ",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Confirm Password
        </Label>
        <div style={{ position: "relative" }}>
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            suppressHydrationWarning
            style={{
              height: "44px",
              borderRadius: "10px",
              borderColor: errors.confirmPassword ? "#ef4444" : "#e2e8f0",
              fontSize: "14px",
              paddingRight: "90px",
              width: "100%",
              boxSizing: "border-box",
            }}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              color: "#94a3b8",
              fontWeight: 500,
              padding: 0,
              whiteSpace: "nowrap",
            }}
          >
            {showConfirm ? "Hide" : "Show password"}
          </button>
        </div>
        {errors.confirmPassword && (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#dc2626",
          }}
        >
          {error}{" "}
          {error.includes("expired") && (
            <Link
              href={ROUTES.forgotPassword}
              style={{ color: "#dc2626", textDecoration: "underline" }}
            >
              Request a new link
            </Link>
          )}
        </div>
      )}

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
        {loading ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}
