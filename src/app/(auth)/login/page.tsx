import { LoginForm } from "@/features/auth/components/login-form";
import { ResendVerificationBanner } from "@/features/auth/components/resend-verification-banner";
import Link from "next/link";
import { ROUTES } from "@/config/app";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export const metadata = { title: "Sign in — MDSSC" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; error?: string }>;
}) {
  const { reset, error } = await searchParams;

  return (
    <Card>
      <CardHeader>
        <CardTitle
          style={{
            fontSize: "clamp(20px, 4vw, 26px)",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
            color: "#f57a22",
          }}
        >
          Sign in
        </CardTitle>
        <CardDescription>Your dashboard awaits.</CardDescription>
      </CardHeader>

      <CardContent
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {reset === "success" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 14px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#15803d",
            }}
          >
            <span>✓</span> Password updated — you can now sign in.
          </div>
        )}

        {error === "unverified" && <ResendVerificationBanner />}

        <LoginForm />
      </CardContent>

      <CardFooter
        style={{
          flexDirection: "column",
          gap: "8px",
          borderTop: "1px solid #e2e8f0",
          paddingTop: "1.25rem",
        }}
      >
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.register}
            style={{
              color: "#f57a22 ",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create one
          </Link>
        </p>
        <Link
          href={ROUTES.forgotPassword}
          style={{
            fontSize: "12px",
            color: "#f57a22 ",
            textDecoration: "none",
          }}
        >
          Forgot your password?
        </Link>
      </CardFooter>
    </Card>
  );
}
