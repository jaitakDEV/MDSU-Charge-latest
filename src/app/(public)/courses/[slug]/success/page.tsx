import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { formatExpiryDate, ACCESS_DURATION_LABELS } from "@/lib/access-utils";
import { AccessDurationBadge } from "@/features/courses/components/access-duration-badge";
import Link from "next/link";
import type { AccessDuration } from "@prisma/client";

export const metadata = { title: "Enrolment Successful — MDSU - Charge" };

export default async function CourseSuccessPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const { slug } = await params;

  const course = await db.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: { id: true, title: true, thumbnail: true, totalLectures: true },
  });

  if (!course) notFound();

  // Enrolment verify karo — DB se confirm karo payment hua
  const enrolment = await db.enrolment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId: course.id },
    },
    select: {
      id: true,
      accessDuration: true,
      accessGrantedAt: true,
      accessExpiresAt: true,
      order: { select: { amountPaid: true, razorpayPaymentId: true } },
    },
  });

  // Enrolment nahi mili — payment pending/failed
  if (!enrolment) {
    return (
      <div
        style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          minHeight: "100vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "#fef2f2",
              border: "2px solid #fecaca",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              fontSize: "28px",
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 8px",
            }}
          >
            Payment Pending
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "#64748b",
              margin: "0 0 1.5rem",
              lineHeight: 1.6,
            }}
          >
            Your payment is being processed. This usually takes a few seconds.
            If you already paid, please wait and refresh.
          </p>
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "center" }}
          >
            <button
              onClick={() => window.location.reload()}
              style={{
                height: "40px",
                padding: "0 20px",
                border: "none",
                borderRadius: "10px",
                background: "#1d4ed8",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Refresh
            </button>
            <Link
              href={ROUTES.courses}
              style={{
                height: "40px",
                padding: "0 20px",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                background: "#fff",
                color: "#475569",
                fontSize: "13px",
                fontWeight: 600,
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isLifetime = enrolment.accessExpiresAt === null;
  const expiryStr = formatExpiryDate(enrolment.accessExpiresAt);
  const amountPaid = enrolment.order?.amountPaid ?? 0;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "520px", width: "100%" }}>
        {/* Success card */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          }}
        >
          {/* Top accent */}
          <div
            style={{
              height: "5px",
              background: "linear-gradient(90deg, #16a34a, #22c55e)",
            }}
          />

          <div style={{ padding: "2rem" }}>
            {/* Success icon */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "1.75rem",
              }}
            >
              <div
                style={{
                  width: "68px",
                  height: "68px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                  border: "2px solid #86efac",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 6px",
                  letterSpacing: "-0.5px",
                  textAlign: "center",
                }}
              >
                You're enrolled!
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "#64748b",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Your payment was successful. Start learning now.
              </p>
            </div>

            {/* Course info */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "12px",
                marginBottom: "1.25rem",
              }}
            >
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{
                    width: "64px",
                    height: "42px",
                    objectFit: "cover",
                    borderRadius: "7px",
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 2px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {course.title}
                </p>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  {course.totalLectures} lectures
                </p>
              </div>
            </div>

            {/* Access details — V3 key section */}
            <div
              style={{
                background: isLifetime ? "#fffbeb" : "#f0fdf4",
                border: `1.5px solid ${isLifetime ? "#fde68a" : "#86efac"}`,
                borderRadius: "14px",
                padding: "1rem 1.25rem",
                marginBottom: "1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 10px",
                }}
              >
                Your Access Details
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                    Access plan
                  </span>
                  <AccessDurationBadge
                    duration={enrolment.accessDuration as AccessDuration}
                    variant="card"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                    Access granted
                  </span>
                  <span
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    {enrolment.accessGrantedAt.toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                    Access valid until
                  </span>
                  <span
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 700,
                      color: isLifetime ? "#92400e" : "#166534",
                    }}
                  >
                    {isLifetime ? "∞ Lifetime — No Expiry" : expiryStr}
                  </span>
                </div>

                {amountPaid > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                      Amount paid
                    </span>
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      ₹{(amountPaid / 100).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                {enrolment.order?.razorpayPaymentId && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "12.5px", color: "#64748b" }}>
                      Payment ID
                    </span>
                    <code
                      style={{
                        fontSize: "11px",
                        color: "#64748b",
                        background: "rgba(255,255,255,0.7)",
                        padding: "2px 7px",
                        borderRadius: "5px",
                      }}
                    >
                      {enrolment.order.razorpayPaymentId.slice(-12)}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {/* CTA buttons */}
            <Link
              href={ROUTES.coursePlayer(slug)}
              style={{
                display: "block",
                width: "100%",
                height: "48px",
                lineHeight: "48px",
                textAlign: "center",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                marginBottom: "8px",
                boxShadow: "0 4px 14px rgba(29,78,216,0.3)",
                letterSpacing: "-0.2px",
              }}
            >
              Start Learning Now →
            </Link>

            <div style={{ display: "flex", gap: "8px" }}>
              <Link
                href={ROUTES.myCourses}
                style={{
                  flex: 1,
                  height: "40px",
                  lineHeight: "40px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  background: "#fff",
                }}
              >
                My Courses
              </Link>
              <Link
                href={ROUTES.courses}
                style={{
                  flex: 1,
                  height: "40px",
                  lineHeight: "40px",
                  textAlign: "center",
                  border: "1px solid #e2e8f0",
                  borderRadius: "10px",
                  color: "#475569",
                  fontSize: "13px",
                  fontWeight: 600,
                  textDecoration: "none",
                  background: "#fff",
                }}
              >
                Browse More
              </Link>
            </div>
          </div>
        </div>

        {/* Email notice */}
        <p
          style={{
            textAlign: "center",
            fontSize: "12.5px",
            color: "#94a3b8",
            marginTop: "14px",
          }}
        >
          A confirmation email has been sent to your registered email address.
        </p>
      </div>
    </div>
  );
}
