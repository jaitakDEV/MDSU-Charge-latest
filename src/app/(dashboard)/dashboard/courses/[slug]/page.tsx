import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { isAccessExpired, getAccessStatus } from "@/lib/access-utils";
import { ExpiryWarningBanner } from "@/features/enrolments/components/expiry-warning-banner";
import { LectureSidebar } from "@/features/dashboard/components/player/lecture-sidebar";
import { VideoPlayer } from "@/features/dashboard/components/player/video-player";
import Link from "next/link";

export const metadata = { title: "Course Player — MDSSC" };

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lecture?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);
  if (session.user.role !== "STUDENT") redirect(ROUTES.dashboard);

  const { slug } = await params;
  const { lecture: lectureId } = await searchParams;

  const course = await db.course.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      totalLectures: true,
      sections: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          title: true,
          lectures: {
            where: { isPublished: true },
            orderBy: { displayOrder: "asc" },
            select: {
              id: true,
              title: true,
              type: true,
              videoUrl: true,
              documentUrl: true,
              textContent: true,
              duration: true,
              isPreview: true,
            },
          },
        },
      },
    },
  });

  if (!course) notFound();

  // ── Access guard — Step 1: Enrolment check ─────────────────
  const enrolment = await db.enrolment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId: course.id },
    },
    select: {
      id: true,
      accessExpiresAt: true,
      completionPercent: true,
    },
  });

  if (!enrolment) {
    // Not enrolled — redirect to course detail
    redirect(ROUTES.courseDetail(slug));
  }

  // ── Access guard — Step 2: Expiry check ───────────────────
  if (isAccessExpired(enrolment.accessExpiresAt)) {
    return (
      <ExpiredAccessPage
        courseTitle={course.title}
        courseSlug={course.slug}
        accessExpiresAt={enrolment.accessExpiresAt}
      />
    );
  }

  // ── Select active lecture ─────────────────────────────────
  const allLectures = course.sections.flatMap((s) => s.lectures);
  const activeLecture =
    allLectures.find((l) => l.id === lectureId) ?? allLectures[0];

  // ── Progress for this student ─────────────────────────────
  const progressRecords = await db.lectureProgress.findMany({
    where: {
      userId: session.user.id,
      lectureId: { in: allLectures.map((l) => l.id) },
    },
    select: { lectureId: true, isCompleted: true },
  });
  const completedIds = new Set(
    progressRecords.filter((p) => p.isCompleted).map((p) => p.lectureId),
  );

  const accessStatus = getAccessStatus(enrolment.accessExpiresAt);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: "calc(100vh - 56px)",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 1.5rem",
          borderBottom: "1px solid #f1f5f9",
          background: "#fff",
          flexShrink: 0,
        }}
      >
        <Link
          href={ROUTES.myCourses}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12.5px",
            color: "#64748b",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          My Courses
        </Link>
        <span style={{ color: "#e2e8f0" }}>›</span>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#0f172a",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {course.title}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
            {completedIds.size}/{course.totalLectures} done
          </span>
          <div
            style={{
              width: "80px",
              height: "4px",
              background: "#f1f5f9",
              borderRadius: "99px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "4px",
                background: "#1d4ed8",
                borderRadius: "99px",
                width: `${course.totalLectures > 0 ? (completedIds.size / course.totalLectures) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Expiry warning */}
      {accessStatus === "EXPIRING_SOON" && (
        <div
          style={{
            padding: "10px 1.5rem",
            background: "#fafafa",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <ExpiryWarningBanner
            accessExpiresAt={enrolment.accessExpiresAt}
            courseSlug={course.slug}
          />
        </div>
      )}

      {/* Main layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <LectureSidebar
          sections={course.sections}
          activeLectureId={activeLecture?.id ?? ""}
          courseSlug={course.slug}
          completedIds={Array.from(completedIds)}
        />

        {/* Player area */}
        <div style={{ flex: 1, overflow: "auto", background: "#f8fafc" }}>
          {activeLecture ? (
            <VideoPlayer
              key={activeLecture.id}
              lecture={activeLecture}
              courseId={course.id}
              userId={session.user.id}
              courseSlug={course.slug}
              isCompleted={completedIds.has(activeLecture.id)}
              allLectures={allLectures}
            />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              No lectures available yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Expired Access State ───────────────────────────────────────
function ExpiredAccessPage({
  courseTitle,
  courseSlug,
  accessExpiresAt,
}: {
  courseTitle: string;
  courseSlug: string;
  accessExpiresAt: Date | null;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "440px", width: "100%", textAlign: "center" }}>
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
          🔒
        </div>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 8px",
          }}
        >
          Access Expired
        </h2>
        <p
          style={{
            fontSize: "13.5px",
            color: "#64748b",
            margin: "0 0 6px",
            lineHeight: 1.6,
          }}
        >
          Your access to{" "}
          <strong style={{ color: "#0f172a" }}>{courseTitle}</strong> expired on{" "}
          {accessExpiresAt?.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          .
        </p>
        <p
          style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 1.75rem" }}
        >
          Your certificate (if earned) is still accessible from your dashboard.
        </p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <Link
            href={ROUTES.courseDetail(courseSlug)}
            style={{
              height: "40px",
              padding: "0 20px",
              display: "flex",
              alignItems: "center",
              border: "none",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Re-enrol
          </Link>
          <Link
            href={ROUTES.certificates}
            style={{
              height: "40px",
              padding: "0 18px",
              display: "flex",
              alignItems: "center",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              background: "#fff",
              color: "#475569",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            My Certificates
          </Link>
        </div>
      </div>
    </div>
  );
}
