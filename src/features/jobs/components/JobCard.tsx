// import Link from "next/link";
// import { ROUTES } from "@/config/app";
// import { OPPORTUNITY_TYPE_LABELS, formatSalary } from "@/lib/job-utils";
// import { Briefcase, MapPin, IndianRupee, Clock } from "lucide-react";

// type JobCardData = {
//   id: string;
//   title: string;
//   slug: string;
//   opportunityType: string;
//   workMode: string;
//   location: string | null;
//   compensationType: string;
//   salaryMin: number | null;
//   salaryMax: number | null;
//   stipendMin: number | null;
//   stipendMax: number | null;
//   isSalaryDisclosed: boolean;
//   applicationDeadline: Date | null;
//   createdAt: Date;
//   isFeatured: boolean;
//   skills: string[];
//   company: { companyName: string; logoUrl: string | null };
// };

// const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
//   FULL_TIME_JOB: { bg: "#eff6ff", color: "#1d4ed8" },
//   INTERNSHIP: { bg: "#f0fdf4", color: "#166534" },
//   APPRENTICESHIP: { bg: "#faf5ff", color: "#6b21a8" },
//   FREELANCE: { bg: "#fff7ed", color: "#9a3412" },
//   WALK_IN_DRIVE: { bg: "#fef2f2", color: "#991b1b" },
//   CAMPUS_HIRING: { bg: "#f0fdfa", color: "#0f766e" },
//   PART_TIME: { bg: "#fefce8", color: "#854d0e" },
// };

// export function JobCard({ job }: { job: JobCardData }) {
//   const typeCfg = TYPE_COLORS[job.opportunityType];
//   const compText =
//     !job.isSalaryDisclosed || job.compensationType !== "PAID"
//       ? job.compensationType === "UNPAID"
//         ? "Unpaid"
//         : job.compensationType === "NEGOTIABLE"
//           ? "Negotiable"
//           : "Not disclosed"
//       : formatSalary(
//           job.salaryMin ?? job.stipendMin,
//           job.salaryMax ?? job.stipendMax,
//         );

//   const daysAgo = Math.floor(
//     (Date.now() - new Date(job.createdAt).getTime()) / 86400000,
//   );
//   const postedStr =
//     daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

//   return (
//     <Link
//       href={ROUTES.jobDetail(job.slug)}
//       style={{
//         display: "flex",
//         gap: "14px",
//         background: "#fff",
//         border: job.isFeatured ? "1.5px solid #bfdbfe" : "1px solid #e8edf2",
//         borderRadius: "16px",
//         padding: "1.1rem",
//         textDecoration: "none",
//         boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
//       }}
//     >
//       <div
//         style={{
//           width: "48px",
//           height: "48px",
//           borderRadius: "10px",
//           background: "#f1f5f9",
//           flexShrink: 0,
//           overflow: "hidden",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}
//       >
//         {job.company.logoUrl ? (
//           <img
//             src={job.company.logoUrl}
//             alt={job.company.companyName}
//             style={{ width: "100%", height: "100%", objectFit: "cover" }}
//           />
//         ) : (
//           <span style={{ fontSize: "16px", fontWeight: 700, color: "#94a3b8" }}>
//             {job.company.companyName[0]}
//           </span>
//         )}
//       </div>

//       <div style={{ flex: 1, minWidth: 0 }}>
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "6px",
//             marginBottom: "4px",
//             flexWrap: "wrap",
//           }}
//         >
//           <span
//             style={{
//               fontSize: "10px",
//               fontWeight: 700,
//               padding: "2px 8px",
//               borderRadius: "20px",
//               background: typeCfg.bg,
//               color: typeCfg.color,
//             }}
//           >
//             {OPPORTUNITY_TYPE_LABELS[job.opportunityType]}
//           </span>
//           {job.isFeatured && (
//             <span
//               style={{
//                 fontSize: "10px",
//                 fontWeight: 700,
//                 padding: "2px 8px",
//                 borderRadius: "20px",
//                 background: "#fbbf24",
//                 color: "#451a03",
//               }}
//             >
//               ★ Featured
//             </span>
//           )}
//         </div>

//         <h3
//           style={{
//             fontSize: "14.5px",
//             fontWeight: 700,
//             color: "#0f172a",
//             margin: "0 0 3px",
//             letterSpacing: "-0.2px",
//           }}
//         >
//           {job.title}
//         </h3>
//         <p style={{ fontSize: "12.5px", color: "#64748b", margin: "0 0 8px" }}>
//           {job.company.companyName}
//         </p>

//         {/* <div
//           style={{
//             display: "flex",
//             gap: "10px",
//             fontSize: "11.5px",
//             color: "#94a3b8",
//             flexWrap: "wrap",
//           }}
//         >
//           <span>
//             {job.workMode === "ONSITE"
//               ? "On-site"
//               : job.workMode === "REMOTE"
//                 ? "Remote"
//                 : "Hybrid"}
//           </span>
//           {job.location && <span>· {job.location}</span>}
//           <span>· {compText}</span>
//           <span>· Posted {postedStr}</span>
//         </div> */}
//         <div
//           style={{
//             display: "flex",
//             gap: "12px",
//             fontSize: "11.5px",
//             color: "#94a3b8",
//             flexWrap: "wrap",
//           }}
//         >
//           <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//             <Briefcase size={12} strokeWidth={2} />
//             {job.workMode === "ONSITE"
//               ? "On-site"
//               : job.workMode === "REMOTE"
//                 ? "Remote"
//                 : "Hybrid"}
//           </span>
//           {job.location && (
//             <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//               <MapPin size={12} strokeWidth={2} />
//               {job.location}
//             </span>
//           )}
//           <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//             {compText}
//           </span>
//           <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
//             <Clock size={12} strokeWidth={2} />
//             Posted {postedStr}
//           </span>
//         </div>

//         {job.skills.length > 0 && (
//           <div
//             style={{
//               display: "flex",
//               gap: "5px",
//               marginTop: "8px",
//               flexWrap: "wrap",
//             }}
//           >
//             {job.skills.slice(0, 4).map((s) => (
//               <span
//                 key={s}
//                 style={{
//                   fontSize: "10.5px",
//                   padding: "2px 8px",
//                   borderRadius: "6px",
//                   background: "#f8fafc",
//                   color: "#64748b",
//                   border: "1px solid #e2e8f0",
//                 }}
//               >
//                 {s}
//               </span>
//             ))}
//           </div>
//         )}
//       </div>
//     </Link>
//   );
// }

import Link from "next/link";
import { ROUTES } from "@/config/app";
import { OPPORTUNITY_TYPE_LABELS, formatSalary } from "@/lib/job-utils";
import { Briefcase, MapPin, Clock, Star, ArrowUpRight } from "lucide-react";

type JobCardData = {
  id: string;
  title: string;
  slug: string;
  opportunityType: string;
  workMode: string;
  location: string | null;
  compensationType: string;
  salaryMin: number | null;
  salaryMax: number | null;
  stipendMin: number | null;
  stipendMax: number | null;
  isSalaryDisclosed: boolean;
  applicationDeadline: Date | null;
  createdAt: Date;
  isFeatured: boolean;
  skills: string[];
  company: { companyName: string; logoUrl: string | null };
};

const TYPE_COLORS: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  FULL_TIME_JOB: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  INTERNSHIP: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  APPRENTICESHIP: { bg: "#faf5ff", color: "#6b21a8", border: "#e9d5ff" },
  FREELANCE: { bg: "#fff7ed", color: "#9a3412", border: "#fed7aa" },
  WALK_IN_DRIVE: { bg: "#fef2f2", color: "#991b1b", border: "#fecaca" },
  CAMPUS_HIRING: { bg: "#f0fdfa", color: "#0f766e", border: "#99f6e4" },
  PART_TIME: { bg: "#fefce8", color: "#854d0e", border: "#fef08a" },
};

export function JobCard({ job }: { job: JobCardData }) {
  const typeCfg = TYPE_COLORS[job.opportunityType];
  const compText =
    !job.isSalaryDisclosed || job.compensationType !== "PAID"
      ? job.compensationType === "UNPAID"
        ? "Unpaid"
        : job.compensationType === "NEGOTIABLE"
          ? "Negotiable"
          : "Not disclosed"
      : formatSalary(
          job.salaryMin ?? job.stipendMin,
          job.salaryMax ?? job.stipendMax,
        );

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.createdAt).getTime()) / 86400000,
  );
  const postedStr =
    daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`;

  const deadlineSoon =
    job.applicationDeadline &&
    new Date(job.applicationDeadline).getTime() - Date.now() < 3 * 86400000; // < 3 days left

  return (
    <Link
      href={ROUTES.jobDetail(job.slug)}
      className="job-card"
      style={{
        display: "flex",
        gap: "16px",
        position: "relative",
        background: "#fff",
        border: job.isFeatured ? "1.5px solid #93c5fd" : "1px solid #e8edf2",
        borderRadius: "18px",
        padding: "1.25rem 1.35rem",
        textDecoration: "none",
        boxShadow: job.isFeatured
          ? "0 2px 14px rgba(29,78,216,0.08)"
          : "0 1px 3px rgba(15,23,42,0.04)",
        transition: "all 0.18s ease",
      }}
    >
      {job.isFeatured && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "14px",
            bottom: "14px",
            width: "3px",
            borderRadius: "0 3px 3px 0",
            background: "linear-gradient(180deg, #3b82f6, #1d4ed8)",
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "8px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "10.5px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "20px",
              background: typeCfg.bg,
              color: typeCfg.color,
              border: `1px solid ${typeCfg.border}`,
              letterSpacing: "0.01em",
            }}
          >
            {OPPORTUNITY_TYPE_LABELS[job.opportunityType]}
          </span>
          {job.isFeatured && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "10.5px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #fde68a, #fbbf24)",
                color: "#78350f",
              }}
            >
              <Star size={10} fill="#78350f" strokeWidth={0} />
              Featured
            </span>
          )}
          {deadlineSoon && (
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: "20px",
                background: "#fef2f2",
                color: "#dc2626",
              }}
            >
              Closing soon
            </span>
          )}
        </div>

        <h3
          style={{
            fontSize: "16px",
            fontWeight: 750,
            color: "#0f172a",
            margin: "0 0 4px",
            letterSpacing: "-0.3px",
            lineHeight: 1.3,
          }}
        >
          {job.title}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "#64748b",
            margin: "0 0 12px",
            fontWeight: 500,
          }}
        >
          {job.company.companyName}
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "12px",
            color: "#64748b",
            flexWrap: "wrap",
            marginBottom: job.skills.length > 0 ? "12px" : 0,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Briefcase size={13} strokeWidth={1.8} color="#94a3b8" />
            {job.workMode === "ONSITE"
              ? "On-site"
              : job.workMode === "REMOTE"
                ? "Remote"
                : "Hybrid"}
          </span>
          {job.location && (
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <MapPin size={13} strokeWidth={1.8} color="#94a3b8" />
              {job.location}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {compText}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Clock size={13} strokeWidth={1.8} color="#94a3b8" />
            Posted {postedStr}
          </span>
        </div>

        {job.skills.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
            }}
          >
            {job.skills.slice(0, 4).map((s) => (
              <span
                key={s}
                style={{
                  fontSize: "10.5px",
                  fontWeight: 500,
                  padding: "3px 10px",
                  borderRadius: "7px",
                  background: "#f8fafc",
                  color: "#475569",
                  border: "1px solid #eef2f6",
                }}
              >
                {s}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span
                style={{
                  fontSize: "10.5px",
                  fontWeight: 500,
                  padding: "3px 10px",
                  color: "#94a3b8",
                }}
              >
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexShrink: 0,
          minWidth: "104px",
        }}
      >
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "12px",
            background: "#f8fafc",
            border: "1px solid #eef2f6",
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
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{ fontSize: "17px", fontWeight: 700, color: "#94a3b8" }}
            >
              {job.company.companyName[0]}
            </span>
          )}
        </div>

        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 2px",
              whiteSpace: "nowrap",
            }}
          >
            {/* {compText} */}
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "2px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#1d4ed8",
            }}
          >
            View role
            <ArrowUpRight size={12} strokeWidth={2.2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
