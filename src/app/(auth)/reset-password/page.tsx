// import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
// import Link from "next/link";
// import { ROUTES } from "@/config/app";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardFooter,
// } from "@/components/ui/card";

// export const metadata = { title: "Reset password — MDSSC" };

// export default async function ResetPasswordPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ token?: string }>;
// }) {
//   const { token } = await searchParams;

//   if (!token) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle
//             style={{
//               fontSize: "clamp(20px, 4vw, 26px)",
//               fontWeight: 800,
//               letterSpacing: "-0.5px",
//               lineHeight: 1.2,
//             }}
//           >
//             Invalid reset link.
//           </CardTitle>
//           <CardDescription>
//             This link is missing or has already been used.
//           </CardDescription>
//         </CardHeader>

//         <CardContent
//           style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
//         >
//           <div
//             style={{
//               padding: "12px 14px",
//               background: "#fef2f2",
//               border: "1px solid #fecaca",
//               borderRadius: "10px",
//               fontSize: "13px",
//               color: "#dc2626",
//             }}
//           >
//             This password reset link is invalid or has expired. Please request a
//             new one.
//           </div>
//           <Link
//             href={ROUTES.forgotPassword}
//             style={{
//               display: "block",
//               height: "44px",
//               lineHeight: "44px",
//               textAlign: "center",
//               width: "100%",
//               background: "#ff7a00",
//               color: "#fff",
//               fontWeight: 600,
//               fontSize: "14px",
//               borderRadius: "10px",
//               textDecoration: "none",
//             }}
//           >
//             Request a new link
//           </Link>
//         </CardContent>

//         <CardFooter
//           style={{
//             borderTop: "1px solid #e2e8f0",
//             paddingTop: "1.25rem",
//             justifyContent: "center",
//           }}
//         >
//           <Link
//             href={ROUTES.login}
//             style={{
//               fontSize: "13px",
//               color: "#0951a5  ",
//               fontWeight: 600,
//               textDecoration: "none",
//             }}
//           >
//             ← Back to sign in
//           </Link>
//         </CardFooter>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle
//           style={{
//             fontSize: "clamp(20px, 4vw, 26px)",
//             fontWeight: 800,
//             letterSpacing: "-0.5px",
//             lineHeight: 1.2,
//           }}
//         >
//           Set a new password.
//         </CardTitle>
//         <CardDescription>
//           Choose a strong password for your MDSSC account.
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <ResetPasswordForm token={token} />
//       </CardContent>

//       <CardFooter
//         style={{
//           borderTop: "1px solid #e2e8f0",
//           paddingTop: "1.25rem",
//           justifyContent: "center",
//         }}
//       >
//         <Link
//           href={ROUTES.login}
//           style={{
//             fontSize: "13px",
//             color: "#0951a5 ",
//             fontWeight: 600,
//             textDecoration: "none",
//           }}
//         >
//           ← Back to sign in
//         </Link>
//       </CardFooter>
//     </Card>
//   );
// }

import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
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
import { getPasswordResetToken } from "@/server/tokens";
import { isTokenExpired } from "@/server/tokens";

export const metadata = { title: "Reset password — MDSSC" };

function InvalidCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle
          style={{
            fontSize: "clamp(20px, 4vw, 26px)",
            fontWeight: 800,
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
            color: "#0951a5 ",
          }}
        >
          Invalid reset link.
        </CardTitle>
        <CardDescription>
          This link is missing or has already been used.
        </CardDescription>
      </CardHeader>
      <CardContent
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <div
          style={{
            padding: "12px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#dc2626",
          }}
        >
          This password reset link is invalid or has expired. Please request a
          new one.
        </div>
        <Link
          href={ROUTES.forgotPassword}
          style={{
            display: "block",
            height: "44px",
            lineHeight: "44px",
            textAlign: "center",
            width: "100%",
            background: "#0951a5 ",
            color: "#fff",
            fontWeight: 600,
            fontSize: "14px",
            borderRadius: "10px",
            textDecoration: "none",
          }}
        >
          Request a new link
        </Link>
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
            color: "#0951a5",
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
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) return <InvalidCard />;

  const record = await getPasswordResetToken(token);

  if (!record || isTokenExpired(record.expires)) return <InvalidCard />;

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
          Set a new password.
        </CardTitle>
        <CardDescription>
          Choose a strong password for your MDSSC account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm token={token} />
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
            color: "#0951a5",
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
