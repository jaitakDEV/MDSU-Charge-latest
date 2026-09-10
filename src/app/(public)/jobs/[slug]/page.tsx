import { auth } from "@/server/auth";
import { notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { OPPORTUNITY_TYPE_LABELS, formatSalary } from "@/lib/job-utils";
import { JobDetailClient } from "@/features/jobs/components/JobDetailClient";
import {
  Briefcase,
  MapPin,
  Users,
  Calendar,
  GraduationCap,
  ClipboardList,
  ListChecks,
  Sparkles,
  MapPinned,
  Clock3,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await db.jobListing.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      title: true,
      metaTitle: true,
      metaDescription: true,
      description: true,
      company: { select: { companyName: true, logoUrl: true } },
    },
  });
  if (!job) return { title: "Job Not Found" };
  return {
    title:
      job.metaTitle ?? `${job.title} at ${job.company.companyName} — MDSSC`,
    description: job.metaDescription ?? job.description.slice(0, 160),
    openGraph: { images: job.company.logoUrl ? [job.company.logoUrl] : [] },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const { slug } = await params;

  const job = await db.jobListing.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      opportunityType: true,
      description: true,
      responsibilities: true,
      requirements: true,
      skills: true,
      workMode: true,
      location: true,
      state: true,
      compensationType: true,
      salaryMin: true,
      salaryMax: true,
      stipendMin: true,
      stipendMax: true,
      projectBudget: true,
      isSalaryDisclosed: true,
      durationType: true,
      durationValue: true,
      durationUnit: true,
      walkInDate: true,
      walkInTime: true,
      walkInVenue: true,
      targetColleges: true,
      targetBatchYears: true,
      certificateOffered: true,
      ppoOffered: true,
      minCgpa: true,
      educationLevel: true,
      educationStream: true,
      minExperienceYears: true,
      maxExperienceYears: true,
      openings: true,
      applicationDeadline: true,
      applicationCount: true,
      createdAt: true,
      screeningQuestions: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          question: true,
          type: true,
          options: true,
          isRequired: true,
        },
      },
      company: {
        select: {
          id: true,
          companyName: true,
          slug: true,
          logoUrl: true,
          industry: true,
          companySize: true,
          city: true,
          state: true,
        },
      },
    },
  });

  if (!job) notFound();

  //   let hasApplied = false;
  //   let hasSaved = false;
  //   let hasResume = false;

  //   if (session?.user && session.user.role === "STUDENT") {
  //     const profile = await db.studentCareerProfile.findUnique({
  //       where: { userId: session.user.id },
  //       select: { id: true, resumeUrl: true },
  //     });
  //     hasResume = !!profile?.resumeUrl;
  //     if (profile) {
  //       const [app, saved] = await Promise.all([
  //         db.jobApplication.findUnique({
  //           where: {
  //             listingId_profileId: { listingId: job.id, profileId: profile.id },
  //           },
  //         }),
  //         db.savedJob.findUnique({
  //           where: {
  //             listingId_profileId: { listingId: job.id, profileId: profile.id },
  //           },
  //         }),
  //       ]);
  //       hasApplied = !!app;
  //       hasSaved = !!saved;
  //     }
  //   }

  let hasApplied = false;
  let hasSaved = false;
  let hasResume = false;
  let resumeUrl: string | null = null;

  if (session?.user && session.user.role === "STUDENT") {
    const profile = await db.studentCareerProfile.findUnique({
      where: { userId: session.user.id },
      select: { id: true, resumeUrl: true },
    });
    hasResume = !!profile?.resumeUrl;
    resumeUrl = profile?.resumeUrl ?? null;
    if (profile) {
      const [app, saved] = await Promise.all([
        db.jobApplication.findUnique({
          where: {
            listingId_profileId: { listingId: job.id, profileId: profile.id },
          },
        }),
        db.savedJob.findUnique({
          where: {
            listingId_profileId: { listingId: job.id, profileId: profile.id },
          },
        }),
      ]);
      hasApplied = !!app;
      hasSaved = !!saved;
    }
  }

  const isExpired = job.applicationDeadline
    ? job.applicationDeadline < new Date()
    : false;

  const daysLeft = job.applicationDeadline
    ? Math.ceil(
        (new Date(job.applicationDeadline).getTime() - Date.now()) / 86400000,
      )
    : null;
  const deadlineSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 3;

  const compText = job.isSalaryDisclosed
    ? job.compensationType === "PAID"
      ? formatSalary(
          job.salaryMin ?? job.stipendMin,
          job.salaryMax ?? job.stipendMax,
        ) ||
        (job.projectBudget
          ? `₹${job.projectBudget.toLocaleString("en-IN")}`
          : "")
      : job.compensationType === "UNPAID"
        ? "Unpaid"
        : "Negotiable"
    : "Not disclosed";

  const sectionCardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #edf0f4",
    borderRadius: "18px",
    padding: "1.5rem",
    marginBottom: "1.1rem",
    boxShadow: "0 1px 3px rgba(15,23,42,0.03)",
  };

  const sectionTitleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14.5px",
    fontWeight: 750,
    color: "#0f172a",
    margin: "0 0 14px",
    letterSpacing: "-0.1px",
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fff7f0 0%, #f8fafc 220px)",
      }}
    >
      {/* Top banner strip */}
      <div
        style={{
          background:
            "linear-gradient(90deg, #f57a22 0%, #fb923c 55%, #f57a22 100%)",
          height: "5px",
          width: "100%",
        }}
      />

      <div
        style={{
          maxWidth: "1060px",
          margin: "0 auto",
          padding: "2.75rem 1.5rem 4rem",
        }}
      >
        {/* Breadcrumb-ish back link */}
        <Link
          href={ROUTES.jobs}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "12.5px",
            fontWeight: 600,
            color: "#94a3b8",
            textDecoration: "none",
            marginBottom: "1.25rem",
          }}
        >
          ← Back to all opportunities
        </Link>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "300px" }}>
            {/* Header card */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #edf0f4",
                borderRadius: "20px",
                padding: "1.75rem",
                marginBottom: "1.25rem",
                boxShadow: "0 2px 16px rgba(245,122,34,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-40px",
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(245,122,34,0.08), transparent 70%)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "16px",
                  marginBottom: "1.25rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "62px",
                    height: "62px",
                    borderRadius: "14px",
                    background: "#fff7f0",
                    border: "1px solid #fde3cc",
                    flexShrink: 0,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {job.company.logoUrl ? (
                    <img
                      src={job.company.logoUrl}
                      alt={job.company.companyName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 700,
                        color: "#f57a22",
                      }}
                    >
                      {job.company.companyName[0]}
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h1
                    style={{
                      fontSize: "clamp(21px, 3vw, 27px)",
                      fontWeight: 800,
                      color: "#0f172a",
                      margin: "0 0 5px",
                      letterSpacing: "-0.6px",
                      lineHeight: 1.25,
                    }}
                  >
                    {job.title}
                  </h1>
                  <Link
                    href={ROUTES.companyDetail(job.company.slug)}
                    style={{
                      fontSize: "13.5px",
                      color: "#f57a22",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {job.company.companyName}
                  </Link>
                  {job.company.industry && (
                    <span
                      style={{
                        fontSize: "12.5px",
                        color: "#94a3b8",
                        marginLeft: "8px",
                      }}
                    >
                      · {job.company.industry}
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: "20px",
                    background: "#fff1e5",
                    color: "#c2570f",
                    border: "1px solid #fde3cc",
                  }}
                >
                  <Briefcase size={12} strokeWidth={2} />
                  {OPPORTUNITY_TYPE_LABELS[job.opportunityType]}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    padding: "5px 12px",
                    borderRadius: "20px",
                    background: "#f8fafc",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <MapPinned size={12} strokeWidth={2} />
                  {job.workMode === "ONSITE"
                    ? "On-site"
                    : job.workMode === "REMOTE"
                      ? "Remote"
                      : "Hybrid"}
                </span>
                {job.location && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      padding: "5px 12px",
                      borderRadius: "20px",
                      background: "#f8fafc",
                      color: "#64748b",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <MapPin size={12} strokeWidth={2} />
                    {job.location}
                  </span>
                )}
                {deadlineSoon && !isExpired && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      padding: "5px 12px",
                      borderRadius: "20px",
                      background: "#fef2f2",
                      color: "#dc2626",
                    }}
                  >
                    <Clock3 size={12} strokeWidth={2} />
                    Closing soon
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={sectionCardStyle}>
              <p style={sectionTitleStyle}>
                <ClipboardList size={16} color="#f57a22" strokeWidth={2.2} />
                Job Description
              </p>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "#475569",
                  margin: 0,
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {job.description}
              </p>
            </div>

            {job.responsibilities.length > 0 && (
              <div style={sectionCardStyle}>
                <p style={sectionTitleStyle}>
                  <ListChecks size={16} color="#f57a22" strokeWidth={2.2} />
                  Responsibilities
                </p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {job.responsibilities.map((r, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: "10px",
                        fontSize: "13.5px",
                        color: "#475569",
                        marginBottom: "9px",
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#f57a22",
                          marginTop: "7px",
                        }}
                      />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.requirements.length > 0 && (
              <div style={sectionCardStyle}>
                <p style={sectionTitleStyle}>
                  <GraduationCap size={16} color="#f57a22" strokeWidth={2.2} />
                  Requirements
                </p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
                  {job.requirements.map((r, i) => (
                    <li
                      key={i}
                      style={{
                        display: "flex",
                        gap: "10px",
                        fontSize: "13.5px",
                        color: "#475569",
                        marginBottom: "9px",
                        lineHeight: 1.6,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#f57a22",
                          marginTop: "7px",
                        }}
                      />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.skills.length > 0 && (
              <div style={sectionCardStyle}>
                <p style={sectionTitleStyle}>
                  <Sparkles size={16} color="#f57a22" strokeWidth={2.2} />
                  Skills Required
                </p>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {job.skills.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "5px 13px",
                        borderRadius: "20px",
                        background: "#fff1e5",
                        color: "#c2570f",
                        border: "1px solid #fde3cc",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job.opportunityType === "WALK_IN_DRIVE" && job.walkInDate && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #fef2f2 0%, #fff5f5 100%)",
                  border: "1px solid #fecaca",
                  borderRadius: "18px",
                  padding: "1.4rem",
                }}
              >
                <p
                  style={{
                    fontSize: "13.5px",
                    fontWeight: 750,
                    color: "#991b1b",
                    margin: "0 0 10px",
                  }}
                >
                  Walk-in Details
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#dc2626",
                    margin: "0 0 5px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Calendar size={13} strokeWidth={2} />
                  {new Date(job.walkInDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                {job.walkInTime && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#dc2626",
                      margin: "0 0 5px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Clock3 size={13} strokeWidth={2} />
                    {job.walkInTime}
                  </p>
                )}
                {job.walkInVenue && (
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#dc2626",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <MapPin size={13} strokeWidth={2} />
                    {job.walkInVenue}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right — Apply card */}
          <div style={{ width: "312px", flexShrink: 0 }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #edf0f4",
                borderRadius: "20px",
                padding: "1.6rem",
                position: "sticky",
                top: "80px",
                boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #fff1e5 0%, #fff7f0 100%)",
                  border: "1px solid #fde3cc",
                  borderRadius: "14px",
                  padding: "1rem 1.1rem",
                  marginBottom: "1.25rem",
                }}
              >
                <p
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 700,
                    color: "#c2570f",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: "0 0 4px",
                  }}
                >
                  Compensation
                </p>
                <p
                  style={{
                    fontSize: "23px",
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: "0 0 2px",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {compText}
                </p>
                <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                  {job.compensationType === "PAID" ? "per month" : ""}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginBottom: "1.25rem",
                  fontSize: "12.5px",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Users size={13} color="#94a3b8" strokeWidth={2} />
                    Openings
                  </span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>
                    {job.openings}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <ClipboardList size={13} color="#94a3b8" strokeWidth={2} />
                    Applicants
                  </span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>
                    {job.applicationCount}
                  </span>
                </div>
                {job.applicationDeadline && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Calendar size={13} color="#94a3b8" strokeWidth={2} />
                      Deadline
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: isExpired ? "#ef4444" : "#0f172a",
                      }}
                    >
                      {new Date(job.applicationDeadline).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short" },
                      )}
                    </span>
                  </div>
                )}
                {job.minCgpa && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <GraduationCap
                        size={13}
                        color="#94a3b8"
                        strokeWidth={2}
                      />
                      Min CGPA
                    </span>
                    <span style={{ fontWeight: 700, color: "#0f172a" }}>
                      {job.minCgpa}
                    </span>
                  </div>
                )}
              </div>

              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, transparent, #edf0f4, transparent)",
                  marginBottom: "1.25rem",
                }}
              />

              <JobDetailClient
                jobId={job.id}
                jobTitle={job.title}
                companyName={job.company.companyName}
                screeningQuestions={job.screeningQuestions}
                isLoggedIn={!!session?.user}
                isStudent={session?.user?.role === "STUDENT"}
                hasApplied={hasApplied}
                hasSaved={hasSaved}
                hasResume={hasResume}
                resumeUrl={resumeUrl ?? ""}
                isExpired={isExpired}
                currentPath={`/jobs/${job.slug}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
