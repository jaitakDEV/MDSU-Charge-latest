import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import {
  getCheckoutExpiryPreview,
  ACCESS_DURATION_LABELS,
} from "@/lib/access-utils";
import { AccessDurationBadge } from "@/features/courses/components/access-duration-badge";
import { CheckoutClient } from "@/features/courses/components/checkout-client";
import type { AccessDuration } from "@prisma/client";

export const metadata = { title: "Checkout — MDSU - Charge" };

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    const { slug } = await params;
    redirect(
      `${ROUTES.login}?callbackUrl=${encodeURIComponent(ROUTES.courseCheckout(slug))}`,
    );
  }

  if (session.user.role !== "STUDENT") {
    redirect(ROUTES.dashboard);
  }

  const { slug } = await params;

  const course = await db.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      thumbnail: true,
      price: true,
      mrp: true,
      accessDuration: true,
      totalLectures: true,
      author: { select: { name: true } },
      category: { select: { name: true } },
    },
  });

  if (!course) notFound();

  // Already enrolled check
  const enrolment = await db.enrolment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId: course.id },
    },
    select: { id: true },
  });

  if (enrolment) {
    redirect(ROUTES.coursePlayer(course.slug));
  }

  if (course.price === 0) {
    redirect(ROUTES.coursePlayer(course.slug));
  }

  const expiryPreview = getCheckoutExpiryPreview(
    course.accessDuration as AccessDuration,
  );
  const discountPct =
    course.mrp > course.price
      ? Math.round(((course.mrp - course.price) / course.mrp) * 100)
      : 0;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <div
        style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#0f172a",
              margin: "0 0 4px",
              letterSpacing: "-0.5px",
            }}
          >
            Complete Your Enrolment
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            Review your order and proceed to payment
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1.75rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* ── Left: Order Summary ── */}
          <div
            style={{
              flex: 1,
              minWidth: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Course card */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "16px",
                padding: "1.25rem",
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
                Order Summary
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                {course.thumbnail && (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{
                      width: "80px",
                      height: "52px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      flexShrink: 0,
                    }}
                  />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 3px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {course.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                    By {course.author.name} · {course.totalLectures} lectures
                  </p>
                </div>
              </div>
            </div>

            {/* Access duration info — key V3 feature */}
            <div
              style={{
                background:
                  course.accessDuration === "LIFETIME" ? "#fffbeb" : "#f0fdf4",
                border: `1px solid ${course.accessDuration === "LIFETIME" ? "#fde68a" : "#bbf7d0"}`,
                borderRadius: "14px",
                padding: "1rem 1.25rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <p
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  Course Access
                </p>
                <AccessDurationBadge
                  duration={course.accessDuration as AccessDuration}
                  variant="card"
                />
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color:
                    course.accessDuration === "LIFETIME"
                      ? "#92400e"
                      : "#166534",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {course.accessDuration === "LIFETIME"
                  ? "∞ Lifetime access — never expires"
                  : `Access valid until ${expiryPreview}`}
              </p>
              {course.accessDuration !== "LIFETIME" && (
                <p
                  style={{
                    fontSize: "11.5px",
                    color: "#94a3b8",
                    margin: "4px 0 0",
                  }}
                >
                  Access starts from the date of purchase
                </p>
              )}
            </div>

            {/* Student info */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "14px",
                padding: "1rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 8px",
                }}
              >
                Enrolling As
              </p>
              <p
                style={{
                  fontSize: "13.5px",
                  fontWeight: 600,
                  color: "#0f172a",
                  margin: "0 0 2px",
                }}
              >
                {session.user.name ?? "Student"}
              </p>
              <p style={{ fontSize: "12.5px", color: "#64748b", margin: 0 }}>
                {session.user.email}
              </p>
            </div>
          </div>

          {/* ── Right: Payment ── */}
          <div style={{ width: "320px", flexShrink: 0 }}>
            <CheckoutClient
              courseId={course.id}
              courseSlug={course.slug}
              originalPrice={course.price}
              mrp={course.mrp}
              discountPct={discountPct}
              accessDuration={course.accessDuration}
              expiryPreview={expiryPreview}
              studentName={session.user.name ?? "Student"}
              studentEmail={session.user.email ?? ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
