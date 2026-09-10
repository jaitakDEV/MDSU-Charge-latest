import { db } from "@/server/db";
import { notFound } from "next/navigation";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { JobCard } from "@/features/jobs/components/JobCard";

const COMPANY_TYPE_LABELS: Record<string, string> = {
  COMPANY: "Company",
  STARTUP: "Startup",
  NGO: "NGO",
  INSTITUTE: "Institute",
  FREELANCER: "Freelancer",
  RECRUITER: "Recruiter / Agency",
};
const COMPANY_SIZE_LABELS: Record<string, string> = {
  STARTUP_1_10: "1-10 employees",
  SMALL_11_50: "11-50 employees",
  MEDIUM_51_200: "51-200 employees",
  LARGE_201_500: "201-500 employees",
  ENTERPRISE_500_PLUS: "500+ employees",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await db.companyProfile.findUnique({
    where: { slug, approvalStatus: "APPROVED" },
    select: {
      companyName: true,
      metaTitle: true,
      metaDescription: true,
      description: true,
      logoUrl: true,
    },
  });
  if (!company) return { title: "Company Not Found" };
  return {
    title: company.metaTitle ?? `${company.companyName} — Careers — MDSSC`,
    description:
      company.metaDescription ?? company.description?.slice(0, 160) ?? "",
    openGraph: { images: company.logoUrl ? [company.logoUrl] : [] },
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const company = await db.companyProfile.findUnique({
    where: { slug, approvalStatus: "APPROVED" },
    select: {
      id: true,
      companyName: true,
      companyType: true,
      industry: true,
      website: true,
      logoUrl: true,
      description: true,
      companySize: true,
      headquarters: true,
      city: true,
      state: true,
      country: true,
      linkedinUrl: true,
      glassdoorUrl: true,
      jobListings: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          opportunityType: true,
          workMode: true,
          location: true,
          compensationType: true,
          salaryMin: true,
          salaryMax: true,
          stipendMin: true,
          stipendMax: true,
          isSalaryDisclosed: true,
          applicationDeadline: true,
          createdAt: true,
          isFeatured: true,
          skills: true,
        },
      },
    },
  });

  if (!company) notFound();

  const jobsWithCompany = company.jobListings.map((j) => ({
    ...j,
    company: { companyName: company.companyName, logoUrl: company.logoUrl },
  }));

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            gap: "18px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "16px",
              background: "#fff",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {company.logoUrl ? (
              <img
                src={company.logoUrl}
                alt={company.companyName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span
                style={{ fontSize: "28px", fontWeight: 700, color: "#94a3b8" }}
              >
                {company.companyName[0]}
              </span>
            )}
          </div>
          <div>
            <h1
              style={{
                fontSize: "clamp(22px, 3.5vw, 30px)",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 6px",
                letterSpacing: "-0.5px",
              }}
            >
              {company.companyName}
            </h1>
            <p style={{ fontSize: "13.5px", color: "#cbd5e1", margin: 0 }}>
              {company.industry} · {COMPANY_TYPE_LABELS[company.companyType]} ·{" "}
              {COMPANY_SIZE_LABELS[company.companySize]}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: "280px" }}>
          {company.description && (
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
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 10px",
                }}
              >
                About {company.companyName}
              </p>
              <p
                style={{
                  fontSize: "13.5px",
                  color: "#475569",
                  margin: 0,
                  lineHeight: 1.75,
                }}
              >
                {company.description}
              </p>
            </div>
          )}

          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 1rem",
            }}
          >
            Open Positions ({jobsWithCompany.length})
          </p>

          {jobsWithCompany.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "3rem",
                background: "#fff",
                border: "1px solid #e8edf2",
                borderRadius: "16px",
              }}
            >
              <p style={{ fontSize: "13.5px", color: "#94a3b8" }}>
                No open positions right now
              </p>
            </div>
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {jobsWithCompany.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar info */}
        <div style={{ width: "280px", flexShrink: 0 }}>
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
                fontSize: "12px",
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0 0 12px",
              }}
            >
              Company Info
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "13px",
              }}
            >
              <div>
                <p
                  style={{
                    color: "#94a3b8",
                    margin: "0 0 2px",
                    fontSize: "11.5px",
                  }}
                >
                  Headquarters
                </p>
                <p style={{ color: "#0f172a", fontWeight: 600, margin: 0 }}>
                  {company.headquarters}
                </p>
              </div>
              <div>
                <p
                  style={{
                    color: "#94a3b8",
                    margin: "0 0 2px",
                    fontSize: "11.5px",
                  }}
                >
                  Location
                </p>
                <p style={{ color: "#0f172a", fontWeight: 600, margin: 0 }}>
                  {company.city}, {company.state}
                </p>
              </div>
              {company.website && (
                <div>
                  <p
                    style={{
                      color: "#94a3b8",
                      margin: "0 0 2px",
                      fontSize: "11.5px",
                    }}
                  >
                    Website
                  </p>
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#1d4ed8",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    Visit site →
                  </a>
                </div>
              )}
              {company.linkedinUrl && (
                <div>
                  <a
                    href={company.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#1d4ed8",
                      fontWeight: 600,
                      fontSize: "13px",
                    }}
                  >
                    LinkedIn →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
