// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// const COMPANY_TYPE_LABELS: Record<string, string> = {
//   COMPANY: "Company",
//   STARTUP: "Startup",
//   NGO: "NGO",
//   INSTITUTE: "Institute",
//   FREELANCER: "Freelancer",
//   RECRUITER: "Recruiter / Agency",
// };

// const COMPANY_SIZE_LABELS: Record<string, string> = {
//   STARTUP_1_10: "1-10 employees",
//   SMALL_11_50: "11-50 employees",
//   MEDIUM_51_200: "51-200 employees",
//   LARGE_201_500: "201-500 employees",
//   ENTERPRISE_500_PLUS: "500+ employees",
// };

// const STATUS_CONFIG: Record<
//   string,
//   { label: string; bg: string; color: string }
// > = {
//   PENDING: { label: "Pending Review", bg: "#fefce8", color: "#854d0e" },
//   APPROVED: { label: "Approved", bg: "#f0fdf4", color: "#166534" },
//   REJECTED: { label: "Rejected", bg: "#fef2f2", color: "#991b1b" },
//   SUSPENDED: { label: "Suspended", bg: "#faf5ff", color: "#6b21a8" },
// };

// type Company = {
//   id: string;
//   companyName: string;
//   slug: string;
//   companyType: string;
//   industry: string;
//   website: string | null;
//   logoUrl: string | null;
//   description: string | null;
//   companySize: string;
//   headquarters: string;
//   city: string;
//   state: string;
//   country: string;
//   contactPerson: string;
//   contactEmail: string;
//   contactPhone: string;
//   designation: string;
//   approvalStatus: string;
//   rejectedReason: string | null;
//   approvedAt: Date | null;
//   linkedinUrl: string | null;
//   glassdoorUrl: string | null;
//   createdAt: Date;
//   _count: { jobListings: number };
// };

// function InfoRow({ label, value }: { label: string; value: string | null }) {
//   if (!value) return null;
//   return (
//     <div
//       style={{
//         display: "flex",
//         justifyContent: "space-between",
//         padding: "8px 0",
//         borderBottom: "1px solid #f1f5f9",
//         fontSize: "13px",
//       }}
//     >
//       <span style={{ color: "#64748b" }}>{label}</span>
//       <span style={{ fontWeight: 600, color: "#0f172a", textAlign: "right" }}>
//         {value}
//       </span>
//     </div>
//   );
// }

// export function CompanyReviewPanel({ company }: { company: Company }) {
//   const router = useRouter();
//   const [showRejectForm, setShowRejectForm] = useState(false);
//   const [reason, setReason] = useState("");
//   const [loading, setLoading] = useState<string | null>(null);
//   const [error, setError] = useState("");

//   const statusCfg = STATUS_CONFIG[company.approvalStatus];

//   async function handleApprove() {
//     setLoading("approve");
//     setError("");
//     const res = await fetch(`/api/cms/companies/${company.id}/approve`, {
//       method: "PATCH",
//     });
//     const json = await res.json();
//     setLoading(null);
//     if (!json.success) {
//       setError(json.error);
//       return;
//     }
//     router.refresh();
//   }

//   async function handleReject() {
//     if (reason.trim().length < 10) {
//       setError("Please provide a detailed reason (min 10 characters).");
//       return;
//     }
//     setLoading("reject");
//     setError("");
//     const res = await fetch(`/api/cms/companies/${company.id}/reject`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ reason }),
//     });
//     const json = await res.json();
//     setLoading(null);
//     if (!json.success) {
//       setError(json.error);
//       return;
//     }
//     setShowRejectForm(false);
//     router.refresh();
//   }

//   return (
//     <div>
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "16px",
//           marginBottom: "1.5rem",
//         }}
//       >
//         <div
//           style={{
//             width: "64px",
//             height: "64px",
//             borderRadius: "14px",
//             background: "#f1f5f9",
//             flexShrink: 0,
//             overflow: "hidden",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {company.logoUrl ? (
//             <img
//               src={company.logoUrl}
//               alt={company.companyName}
//               style={{ width: "100%", height: "100%", objectFit: "cover" }}
//             />
//           ) : (
//             <span
//               style={{ fontSize: "22px", fontWeight: 700, color: "#94a3b8" }}
//             >
//               {company.companyName[0]}
//             </span>
//           )}
//         </div>
//         <div style={{ flex: 1 }}>
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               marginBottom: "4px",
//             }}
//           >
//             <h1
//               style={{
//                 fontSize: "20px",
//                 fontWeight: 700,
//                 color: "#0f172a",
//                 margin: 0,
//               }}
//             >
//               {company.companyName}
//             </h1>
//             <span
//               style={{
//                 fontSize: "10.5px",
//                 fontWeight: 700,
//                 padding: "2px 8px",
//                 borderRadius: "20px",
//                 background: statusCfg.bg,
//                 color: statusCfg.color,
//               }}
//             >
//               {statusCfg.label}
//             </span>
//           </div>
//           <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
//             {COMPANY_TYPE_LABELS[company.companyType]} · {company.industry} ·{" "}
//             {company._count.jobListings} listings
//           </p>
//         </div>
//       </div>

//       {/* Description */}
//       {company.description && (
//         <div
//           style={{
//             background: "#fff",
//             border: "1px solid #e8edf2",
//             borderRadius: "14px",
//             padding: "1.1rem",
//             marginBottom: "1rem",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "12px",
//               fontWeight: 700,
//               color: "#94a3b8",
//               textTransform: "uppercase",
//               letterSpacing: "0.06em",
//               margin: "0 0 8px",
//             }}
//           >
//             About
//           </p>
//           <p
//             style={{
//               fontSize: "13.5px",
//               color: "#475569",
//               margin: 0,
//               lineHeight: 1.7,
//             }}
//           >
//             {company.description}
//           </p>
//         </div>
//       )}

//       {/* Company Details */}
//       <div
//         style={{
//           background: "#fff",
//           border: "1px solid #e8edf2",
//           borderRadius: "14px",
//           padding: "1.1rem",
//           marginBottom: "1rem",
//         }}
//       >
//         <p
//           style={{
//             fontSize: "12px",
//             fontWeight: 700,
//             color: "#94a3b8",
//             textTransform: "uppercase",
//             letterSpacing: "0.06em",
//             margin: "0 0 8px",
//           }}
//         >
//           Company Details
//         </p>
//         <InfoRow
//           label="Company Size"
//           value={COMPANY_SIZE_LABELS[company.companySize]}
//         />
//         <InfoRow label="Headquarters" value={company.headquarters} />
//         <InfoRow
//           label="Location"
//           value={`${company.city}, ${company.state}, ${company.country}`}
//         />
//         <InfoRow label="Website" value={company.website} />
//         <InfoRow label="LinkedIn" value={company.linkedinUrl} />
//         <InfoRow label="Glassdoor" value={company.glassdoorUrl} />
//       </div>

//       {/* Contact Details */}
//       <div
//         style={{
//           background: "#fff",
//           border: "1px solid #e8edf2",
//           borderRadius: "14px",
//           padding: "1.1rem",
//           marginBottom: "1rem",
//         }}
//       >
//         <p
//           style={{
//             fontSize: "12px",
//             fontWeight: 700,
//             color: "#94a3b8",
//             textTransform: "uppercase",
//             letterSpacing: "0.06em",
//             margin: "0 0 8px",
//           }}
//         >
//           Contact Person
//         </p>
//         <InfoRow label="Name" value={company.contactPerson} />
//         <InfoRow label="Designation" value={company.designation} />
//         <InfoRow label="Email" value={company.contactEmail} />
//         <InfoRow label="Phone" value={company.contactPhone} />
//       </div>

//       {/* Rejected reason — if applicable */}
//       {company.approvalStatus === "REJECTED" && company.rejectedReason && (
//         <div
//           style={{
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             borderRadius: "14px",
//             padding: "1.1rem",
//             marginBottom: "1rem",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "12px",
//               fontWeight: 700,
//               color: "#991b1b",
//               textTransform: "uppercase",
//               letterSpacing: "0.06em",
//               margin: "0 0 8px",
//             }}
//           >
//             Previous Rejection Reason
//           </p>
//           <p
//             style={{
//               fontSize: "13.5px",
//               color: "#dc2626",
//               margin: 0,
//               lineHeight: 1.6,
//             }}
//           >
//             {company.rejectedReason}
//           </p>
//         </div>
//       )}

//       {/* Actions — only for PENDING */}
//       {company.approvalStatus === "PENDING" && (
//         <div
//           style={{
//             background: "#fffbeb",
//             border: "1.5px solid #fde68a",
//             borderRadius: "14px",
//             padding: "1.25rem",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "13px",
//               fontWeight: 700,
//               color: "#92400e",
//               margin: "0 0 4px",
//             }}
//           >
//             Review Required
//           </p>
//           <p
//             style={{ fontSize: "12.5px", color: "#b45309", margin: "0 0 14px" }}
//           >
//             Approve to activate this account and allow job posting, or reject
//             with a reason.
//           </p>

//           {error && (
//             <p
//               style={{
//                 fontSize: "12.5px",
//                 color: "#dc2626",
//                 marginBottom: "10px",
//               }}
//             >
//               {error}
//             </p>
//           )}

//           {!showRejectForm ? (
//             <div style={{ display: "flex", gap: "8px" }}>
//               <button
//                 onClick={handleApprove}
//                 disabled={loading !== null}
//                 style={{
//                   height: "38px",
//                   padding: "0 20px",
//                   border: "none",
//                   borderRadius: "10px",
//                   background:
//                     "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
//                   color: "#fff",
//                   fontSize: "13px",
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 {loading === "approve" ? "Approving…" : "✓ Approve Company"}
//               </button>
//               <button
//                 onClick={() => setShowRejectForm(true)}
//                 disabled={loading !== null}
//                 style={{
//                   height: "38px",
//                   padding: "0 20px",
//                   border: "1px solid #fecaca",
//                   borderRadius: "10px",
//                   background: "#fef2f2",
//                   color: "#dc2626",
//                   fontSize: "13px",
//                   fontWeight: 600,
//                   cursor: "pointer",
//                 }}
//               >
//                 ✕ Reject
//               </button>
//             </div>
//           ) : (
//             <div>
//               <textarea
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 placeholder="Explain why this registration is being rejected — the provider will receive this via email."
//                 style={{
//                   width: "100%",
//                   minHeight: "80px",
//                   padding: "10px 12px",
//                   border: "1px solid #fecaca",
//                   borderRadius: "10px",
//                   fontSize: "13px",
//                   resize: "vertical",
//                   marginBottom: "10px",
//                 }}
//               />
//               <div style={{ display: "flex", gap: "8px" }}>
//                 <button
//                   onClick={handleReject}
//                   disabled={loading !== null}
//                   style={{
//                     height: "36px",
//                     padding: "0 18px",
//                     border: "none",
//                     borderRadius: "9px",
//                     background: "#dc2626",
//                     color: "#fff",
//                     fontSize: "12.5px",
//                     fontWeight: 600,
//                     cursor: "pointer",
//                   }}
//                 >
//                   {loading === "reject" ? "Rejecting…" : "Confirm Rejection"}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowRejectForm(false);
//                     setReason("");
//                     setError("");
//                   }}
//                   style={{
//                     height: "36px",
//                     padding: "0 16px",
//                     border: "1px solid #e2e8f0",
//                     borderRadius: "9px",
//                     background: "#fff",
//                     color: "#64748b",
//                     fontSize: "12.5px",
//                     cursor: "pointer",
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Already approved info */}
//       {company.approvalStatus === "APPROVED" && (
//         <div
//           style={{
//             background: "#f0fdf4",
//             border: "1px solid #bbf7d0",
//             borderRadius: "14px",
//             padding: "1.1rem",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "13px",
//               fontWeight: 700,
//               color: "#166534",
//               margin: 0,
//             }}
//           >
//             ✓ Approved on{" "}
//             {company.approvedAt?.toLocaleDateString("en-IN", {
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//             })}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";

type Company = {
  id: string;
  companyName: string;
  slug: string;
  companyType: string;
  industry: string;
  website: string | null;
  logoUrl: string | null;
  description: string | null;
  companySize: string;
  headquarters: string;
  city: string;
  state: string;
  country: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  designation: string;
  approvalStatus: string;
  rejectedReason: string | null;
  approvedAt: Date | null;
  linkedinUrl: string | null;
  glassdoorUrl: string | null;
  createdAt: Date;
  panNumber: string | null;
  udyamCertificateUrl: string | null;
  _count: { jobListings: number };
};

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "8px 0",
        borderBottom: "1px solid #f8fafc",
        fontSize: "13px",
        gap: "12px",
      }}
    >
      <span style={{ color: "#64748b", flexShrink: 0 }}>{label}</span>
      <span style={{ fontWeight: 600, color: "#0f172a", textAlign: "right" }}>
        {value ?? "—"}
      </span>
    </div>
  );
}

const COMPANY_SIZE_LABELS: Record<string, string> = {
  STARTUP_1_10: "1–10 employees",
  SMALL_11_50: "11–50 employees",
  MEDIUM_51_200: "51–200 employees",
  LARGE_201_500: "201–500 employees",
  ENTERPRISE_500_PLUS: "500+ employees",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; dot: string }
> = {
  PENDING: {
    label: "Pending Review",
    bg: "#fefce8",
    color: "#854d0e",
    dot: "#eab308",
  },
  APPROVED: {
    label: "Approved",
    bg: "#f0fdf4",
    color: "#166534",
    dot: "#16a34a",
  },
  REJECTED: {
    label: "Rejected",
    bg: "#fef2f2",
    color: "#991b1b",
    dot: "#ef4444",
  },
  SUSPENDED: {
    label: "Suspended",
    bg: "#f8fafc",
    color: "#475569",
    dot: "#94a3b8",
  },
};

// ── Component ──────────────────────────────────────────────────
export function CompanyReviewPanel({ company }: { company: Company }) {
  const router = useRouter();

  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionError, setActionError] = useState("");

  const statusCfg =
    STATUS_CONFIG[company.approvalStatus] ?? STATUS_CONFIG.PENDING;

  async function handleApprove() {
    setLoading("approve");
    setActionError("");
    try {
      const res = await fetch(`/api/cms/companies/${company.id}/approve`, {
        method: "PATCH",
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      router.push(ROUTES.cmsCompanies);
      router.refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to approve.");
    } finally {
      setLoading(null);
    }
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      setActionError("Please provide a reason for rejection.");
      return;
    }
    setLoading("reject");
    setActionError("");
    try {
      const res = await fetch(`/api/cms/companies/${company.id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason.trim() }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      router.push(ROUTES.cmsCompanies);
      router.refresh();
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Failed to reject.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Logo */}
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.companyName}
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                objectFit: "cover",
                border: "1px solid #e2e8f0",
              }}
            />
          ) : (
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
                border: "1px solid #bfdbfe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                color: "#1d4ed8",
              }}
            >
              {company.companyName[0]}
            </div>
          )}
          <div>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 4px",
                letterSpacing: "-0.3px",
              }}
            >
              {company.companyName}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 10px",
                  borderRadius: "20px",
                  background: statusCfg.bg,
                  color: statusCfg.color,
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: statusCfg.dot,
                  }}
                />
                {statusCfg.label}
              </span>
              <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                {company._count.jobListings} listing
                {company._count.jobListings !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
          Registered{" "}
          {new Date(company.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      {/* ── Rejected reason ── */}
      {company.approvalStatus === "REJECTED" && company.rejectedReason && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "10px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            fontSize: "13px",
            color: "#dc2626",
            marginBottom: "1rem",
          }}
        >
          <strong>Rejection reason:</strong> {company.rejectedReason}
        </div>
      )}

      {/* ── Company Info ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.1rem",
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
            margin: "0 0 8px",
          }}
        >
          Company Information
        </p>
        <InfoRow label="Type" value={company.companyType} />
        <InfoRow label="Industry" value={company.industry} />
        <InfoRow
          label="Size"
          value={
            COMPANY_SIZE_LABELS[company.companySize] ?? company.companySize
          }
        />
        <InfoRow label="Headquarters" value={company.headquarters} />
        <InfoRow
          label="City"
          value={`${company.city}, ${company.state}, ${company.country}`}
        />
        {company.website && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              fontSize: "13px",
              borderBottom: "1px solid #f8fafc",
            }}
          >
            <span style={{ color: "#64748b" }}>Website</span>
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "12.5px", fontWeight: 600, color: "#1d4ed8" }}
            >
              {company.website}
            </a>
          </div>
        )}
        {company.linkedinUrl && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              fontSize: "13px",
              borderBottom: "1px solid #f8fafc",
            }}
          >
            <span style={{ color: "#64748b" }}>LinkedIn</span>
            <a
              href={company.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "12.5px", fontWeight: 600, color: "#1d4ed8" }}
            >
              View Profile
            </a>
          </div>
        )}
        {company.description && (
          <div style={{ paddingTop: "10px" }}>
            <p
              style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 4px" }}
            >
              About
            </p>
            <p
              style={{
                fontSize: "13px",
                color: "#374151",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {company.description}
            </p>
          </div>
        )}
      </div>

      {/* ── Contact Details ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.1rem",
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
            margin: "0 0 8px",
          }}
        >
          Contact Details
        </p>
        <InfoRow label="Contact Person" value={company.contactPerson} />
        <InfoRow label="Designation" value={company.designation} />
        <InfoRow label="Email" value={company.contactEmail} />
        <InfoRow label="Phone" value={company.contactPhone} />
      </div>

      {/* ── Compliance Documents ── */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.1rem",
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
            margin: "0 0 8px",
          }}
        >
          Compliance Documents
        </p>

        {/* PAN Number */}
        {company.panNumber ? (
          <InfoRow label="PAN Number" value={company.panNumber} />
        ) : (
          <p
            style={{
              fontSize: "12.5px",
              color: "#94a3b8",
              padding: "8px 0",
              margin: 0,
              borderBottom: "1px solid #f8fafc",
            }}
          >
            PAN not provided (registered before this requirement)
          </p>
        )}

        {/* Udyam Certificate */}
        {company.udyamCertificateUrl ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "8px 0",
              fontSize: "13px",
            }}
          >
            <span style={{ color: "#64748b" }}>Udyam Certificate</span>
            <a
              href={company.udyamCertificateUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: "#1d4ed8",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                textDecoration: "none",
              }}
            >
              📄 View Certificate
            </a>
          </div>
        ) : (
          <p
            style={{
              fontSize: "12.5px",
              color: "#94a3b8",
              padding: "8px 0",
              margin: 0,
            }}
          >
            Udyam certificate not uploaded (registered before this requirement)
          </p>
        )}
      </div>

      {/* ── Action error ── */}
      {actionError && (
        <div
          style={{
            padding: "10px 14px",
            borderRadius: "9px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            fontSize: "12.5px",
            color: "#dc2626",
            marginBottom: "1rem",
          }}
        >
          {actionError}
        </div>
      )}

      {/* ── Reject form ── */}
      {showRejectForm && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "12px",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#dc2626",
              margin: "0 0 8px",
            }}
          >
            Reason for rejection
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why this company profile is being rejected…"
            rows={3}
            style={{
              width: "100%",
              padding: "9px 12px",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              fontSize: "13px",
              outline: "none",
              resize: "vertical",
              boxSizing: "border-box",
              background: "#fff",
            }}
          />
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "10px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={() => {
                setShowRejectForm(false);
                setRejectReason("");
                setActionError("");
              }}
              style={{
                height: "34px",
                padding: "0 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                background: "#fff",
                fontSize: "12.5px",
                color: "#64748b",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={loading === "reject"}
              style={{
                height: "34px",
                padding: "0 16px",
                border: "none",
                borderRadius: "8px",
                background: "#dc2626",
                color: "#fff",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading === "reject" ? "Rejecting…" : "Confirm Reject"}
            </button>
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      {company.approvalStatus === "PENDING" && !showRejectForm && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleApprove}
            disabled={loading === "approve"}
            style={{
              flex: 1,
              height: "42px",
              border: "none",
              borderRadius: "11px",
              background:
                loading === "approve"
                  ? "#86efac"
                  : "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
              color: "#fff",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: loading === "approve" ? "not-allowed" : "pointer",
              boxShadow: "0 2px 8px rgba(22,163,74,0.25)",
            }}
          >
            {loading === "approve" ? "Approving…" : "✓ Approve Company"}
          </button>
          <button
            onClick={() => setShowRejectForm(true)}
            style={{
              flex: 1,
              height: "42px",
              border: "1.5px solid #fecaca",
              borderRadius: "11px",
              background: "#fef2f2",
              color: "#dc2626",
              fontSize: "13.5px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ✕ Reject
          </button>
        </div>
      )}

      {/* Approved state */}
      {company.approvalStatus === "APPROVED" && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: "11px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            fontSize: "13px",
            color: "#166534",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          ✓ Company approved on{" "}
          {company.approvedAt
            ? new Date(company.approvedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "—"}
        </div>
      )}
    </div>
  );
}
