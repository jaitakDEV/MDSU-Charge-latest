import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";

export const metadata = { title: "Account Pending Approval" };

export default async function ProviderPendingPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);
  if (session.user.role !== "JOB_PROVIDER") redirect(ROUTES.dashboard);

  const company = await db.companyProfile.findUnique({
    where: { userId: session.user.id },
    select: { companyName: true, approvalStatus: true, rejectedReason: true },
  });

  const isRejected = company?.approvalStatus === "REJECTED";

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "440px",
          width: "100%",
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            height: "4px",
            background: isRejected
              ? "linear-gradient(90deg, #dc2626, #ef4444)"
              : "linear-gradient(90deg, #eab308, #facc15)",
          }}
        />

        <div style={{ padding: "2rem", textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: isRejected ? "#fef2f2" : "#fefce8",
              border: `2px solid ${isRejected ? "#fecaca" : "#fde68a"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              fontSize: "28px",
            }}
          >
            {isRejected ? "✕" : "⏳"}
          </div>

          <h1
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 8px",
              letterSpacing: "-0.4px",
            }}
          >
            {isRejected ? "Registration Not Approved" : "Account Under Review"}
          </h1>

          <p
            style={{
              fontSize: "14px",
              color: "#64748b",
              margin: "0 0 20px",
              lineHeight: 1.6,
            }}
          >
            {isRejected
              ? "Your company registration was not approved. You can update your details and reapply."
              : `Your company profile ${company?.companyName ? `for "${company.companyName}"` : ""} is currently being reviewed by our team. This usually takes 1-2 business days.`}
          </p>

          {isRejected && company?.rejectedReason && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "10px",
                padding: "14px",
                marginBottom: "20px",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#991b1b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  margin: "0 0 6px",
                }}
              >
                Reason
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#dc2626",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {company.rejectedReason}
              </p>
            </div>
          )}

          {isRejected ? (
            <Link
              href={ROUTES.employerRegister}
              style={{
                display: "block",
                height: "44px",
                lineHeight: "44px",
                borderRadius: "10px",
                background: "#1d4ed8",
                color: "#fff",
                fontSize: "13.5px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Update & Reapply
            </Link>
          ) : (
            <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: 0 }}>
              We'll email you as soon as a decision is made.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
