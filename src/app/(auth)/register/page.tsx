import { RegisterForm } from "@/features/auth/components/register-form";
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

export const metadata = { title: "Create account — MDSSC" };

export default function RegisterPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          style={{
            fontSize: "clamp(20px, 4vw, 26px)",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
            color: "#0951a5",
          }}
        >
          Create your account.
        </CardTitle>
        <CardDescription>
          Join MDSSC and start managing your business smarter.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <RegisterForm />
      </CardContent>
      <CardFooter
        style={{
          borderTop: "1px solid #e2e8f0",
          paddingTop: "1.25rem",
          justifyContent: "center",
        }}
      >
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Already have an account?{" "}
          <Link
            href={ROUTES.login}
            style={{
              color: "#0951a5",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
