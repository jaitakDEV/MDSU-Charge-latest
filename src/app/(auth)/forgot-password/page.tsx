import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
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

export const metadata = { title: "Forgot password — MDSSC" };

export default function ForgotPasswordPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          style={{
            fontSize: "clamp(20px, 4vw, 26px)",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
          }}
        >
          Forgot your password?
        </CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a reset link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ForgotPasswordForm />
      </CardContent>

      <CardFooter
        style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: "1.25rem",
          justifyContent: "center",
        }}
      >
        <Link
          href={ROUTES.login}
          style={{
            fontSize: "13px",
            color: "#0951a5 ",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
