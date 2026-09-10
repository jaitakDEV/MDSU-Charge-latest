"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/validations/auth";
import { ROUTES } from "@/config/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginInput) {
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      const errorMessage =
        result.error === "EmailNotVerified"
          ? "Please verify your email before signing in."
          : "Invalid email or password. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage, {
        description:
          result.error === "EmailNotVerified"
            ? "Check your inbox for the verification link."
            : "Double-check your credentials and try again.",
        duration: 4000,
      });
      return;
    }

    const { getSession } = await import("next-auth/react");
    const session = await getSession();

    toast.success("Welcome back!", {
      description: `Signed in as ${session?.user?.name ?? session?.user?.email}`,
      duration: 3000,
    });

    if (session?.user?.role === "ADMIN") {
      router.push(ROUTES.admin);
    } else {
      router.push(ROUTES.dashboard);
    }
    router.refresh();
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
            color: "#f57a22",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Work Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="name@company.com"
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

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <Label
          htmlFor="password"
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#f57a22",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Password
        </Label>
        <div style={{ position: "relative" }}>
          <Input
            id="password"
            type={showPass ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
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
              color: "#f57a22",
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

      {/* Error */}
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
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        style={{
          height: "44px",
          width: "100%",
          background: loading ? "#f57a22" : "#f57a22 ",
          color: "#fff",
          fontWeight: 600,
          fontSize: "14px",
          borderRadius: "10px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "4px",
        }}
      >
        {loading ? "Signing you in…" : "Sign in"}
      </Button>
    </form>
  );
}
