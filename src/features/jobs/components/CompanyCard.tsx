import Link from "next/link";
import { ROUTES } from "@/config/app";

const COMPANY_TYPE_LABELS: Record<string, string> = {
  COMPANY: "Company",
  STARTUP: "Startup",
  NGO: "NGO",
  INSTITUTE: "Institute",
  FREELANCER: "Freelancer",
  RECRUITER: "Recruiter",
};

type CompanyCardData = {
  id: string;
  companyName: string;
  slug: string;
  companyType: string;
  industry: string;
  logoUrl: string | null;
  city: string;
  state: string;
  _count: { jobListings: number };
};

export function CompanyCard({ company }: { company: CompanyCardData }) {
  return (
    <Link
      href={ROUTES.companyDetail(company.slug)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        background: "#fff",
        border: "1px solid #e8edf2",
        borderRadius: "16px",
        padding: "1.5rem 1.25rem",
        textDecoration: "none",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "14px",
          background: "#f1f5f9",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        {company.logoUrl ? (
          <img
            src={company.logoUrl}
            alt={company.companyName}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ fontSize: "22px", fontWeight: 700, color: "#94a3b8" }}>
            {company.companyName[0]}
          </span>
        )}
      </div>

      <p
        style={{
          fontSize: "14.5px",
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 4px",
          letterSpacing: "-0.2px",
        }}
      >
        {company.companyName}
      </p>
      <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 10px" }}>
        {company.industry} · {company.city}
      </p>

      <div style={{ display: "flex", gap: "6px" }}>
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "6px",
            background: "#f8fafc",
            color: "#64748b",
            border: "1px solid #e2e8f0",
          }}
        >
          {COMPANY_TYPE_LABELS[company.companyType]}
        </span>
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: 600,
            padding: "2px 8px",
            borderRadius: "6px",
            background: "#eff6ff",
            color: "#1d4ed8",
          }}
        >
          {company._count.jobListings} open roles
        </span>
      </div>
    </Link>
  );
}
