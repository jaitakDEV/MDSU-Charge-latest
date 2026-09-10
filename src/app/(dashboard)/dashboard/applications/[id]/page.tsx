import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import {
  getApplicationStatusLabel,
  OPPORTUNITY_TYPE_LABELS,
} from "@/lib/job-utils";
import { WithdrawButton } from "@/features/career/components/WithdrawButton";

const STATUS_STEPS = [
  "APPLIED",
  "UNDER_REVIEW",
  "SHORTLISTED",
  "INTERVIEW_SCHEDULED",
  "INTERVIEWED",
  "OFFERED",
];

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const { id } = await params;

  const application = await db.jobApplication.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      statusNote: true,
      statusUpdatedAt: true,
      createdAt: true,
      coverLetter: true,
      expectedSalary: true,
      noticePeriod: true,
      availableFrom: true,
      portfolioUrl: true,
      interviewDate: true,
      interviewMode: true,
      interviewLink: true,
      resumeUrl: true,
      profile: { select: { userId: true } },
      listing: {
        select: {
          id: true,
          title: true,
          slug: true,
          opportunityType: true,
          workMode: true,
          location: true,
          company: { select: { companyName: true, logoUrl: true, slug: true } },
        },
      },
    },
  });

  if (!application) notFound();
  if (application.profile.userId !== session.user.id)
    redirect(ROUTES.applications);

  const isTerminal = [
    "REJECTED",
    "WITHDRAWN",
    "OFFER_ACCEPTED",
    "OFFER_REJECTED",
  ].includes(application.status);
  const isRejectedByCompany = application.status === "REJECTED";
  const currentStepIndex = STATUS_STEPS.indexOf(application.status);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "640px",
      }}
    >
      <Link
        href={ROUTES.applications}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "12.5px",
          color: "#64748b",
          textDecoration: "none",
          marginBottom: "1rem",
        }}
      >
        ← All Applications
      </Link>

      <div style={{ display: "flex", gap: "14px", marginBottom: "1.5rem" }}>
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "12px",
            background: "#f1f5f9",
            flexShrink: 0,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {application.listing.company.logoUrl ? (
            <img
              src={application.listing.company.logoUrl}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{ fontSize: "18px", fontWeight: 700, color: "#94a3b8" }}
            >
              {application.listing.company.companyName[0]}
            </span>
          )}
        </div>
        <div>
          <h1
            style={{
              fontSize: "19px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 3px",
            }}
          >
            {application.listing.title}
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            {application.listing.company.companyName}
          </p>
        </div>
      </div>

      {/* Status timeline — only for active applications */}
      {!isTerminal && !isRejectedByCompany && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e8edf2",
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#94a3b8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 14px",
            }}
          >
            Status Timeline
          </p>
          <div style={{ display: "flex", alignItems: "center" }}>
            {STATUS_STEPS.map((step, i) => {
              const isDone = i <= currentStepIndex;
              const isLast = i === STATUS_STEPS.length - 1;
              return (
                <div
                  key={step}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: isLast ? "0 0 auto" : 1,
                  }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: isDone ? "#1d4ed8" : "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isDone && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {!isLast && (
                    <div
                      style={{
                        flex: 1,
                        height: "2px",
                        background:
                          i < currentStepIndex ? "#1d4ed8" : "#e2e8f0",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#1d4ed8",
              margin: "12px 0 0",
            }}
          >
            {getApplicationStatusLabel(application.status)}
          </p>
        </div>
      )}

      {/* Rejected/terminal state */}
      {(isTerminal || isRejectedByCompany) && (
        <div
          style={{
            background:
              application.status === "OFFER_ACCEPTED" ? "#f0fdf4" : "#f8fafc",
            border: `1px solid ${application.status === "OFFER_ACCEPTED" ? "#bbf7d0" : "#e2e8f0"}`,
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color:
                application.status === "OFFER_ACCEPTED" ? "#166534" : "#475569",
              margin: 0,
            }}
          >
            {getApplicationStatusLabel(application.status)}
          </p>
        </div>
      )}

      {/* Status note from company */}
      {application.statusNote && (
        <div
          style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: "14px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#1d4ed8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 6px",
            }}
          >
            Note from {application.listing.company.companyName}
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#334155",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            {application.statusNote}
          </p>
        </div>
      )}

      {/* Interview details */}
      {application.interviewDate && (
        <div
          style={{
            background: "#faf5ff",
            border: "1px solid #e9d5ff",
            borderRadius: "14px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#6b21a8",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 8px",
            }}
          >
            Interview Scheduled
          </p>
          <p style={{ fontSize: "13px", color: "#334155", margin: "0 0 3px" }}>
            {application.interviewDate.toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {application.interviewMode && (
            <p
              style={{ fontSize: "13px", color: "#334155", margin: "0 0 3px" }}
            >
              Mode: {application.interviewMode}
            </p>
          )}
          {application.interviewLink && (
            <a
              href={application.interviewLink}
              style={{ fontSize: "13px", color: "#7c3aed", fontWeight: 600 }}
            >
              Join Interview →
            </a>
          )}
        </div>
      )}

      {/* Application details */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "16px",
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            margin: "0 0 10px",
          }}
        >
          Your Application
        </p>
        {application.coverLetter && (
          <p
            style={{
              fontSize: "13px",
              color: "#475569",
              margin: "0 0 10px",
              lineHeight: 1.6,
            }}
          >
            {application.coverLetter}
          </p>
        )}
        <a
          href={application.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "12.5px", color: "#1d4ed8", fontWeight: 600 }}
        >
          View submitted resume →
        </a>
        <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: "10px 0 0" }}>
          Applied{" "}
          {application.createdAt.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {!isTerminal && <WithdrawButton applicationId={application.id} />}
    </div>
  );
}
