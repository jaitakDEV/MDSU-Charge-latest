// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { db } from "@/server/db";
// import { ROUTES } from "@/config/app";
// import { formatDate } from "@/lib/utils";

// export const metadata = { title: "Faculty Dashboard" };

// export default async function FacultyHomePage() {
//   const session = await auth();
//   if (!session?.user) redirect(ROUTES.login);

//   const user = await db.user.findUnique({
//     where: { id: session.user.id },
//     select: {
//       name: true,
//       email: true,
//       phoneNumber: true,
//       createdAt: true,
//       college: { select: { name: true, city: true, state: true } },
//     },
//   });

//   if (!user) redirect(ROUTES.login);

//   return (
//     <div>
//       <h1 style={{ fontSize: "22px", fontWeight: 500, marginBottom: "6px" }}>
//         Welcome, {user.name?.split(" ")[0] ?? "Faculty"}
//       </h1>
//       <p
//         style={{
//           fontSize: "14px",
//           color: "var(--color-text-secondary)",
//           marginBottom: "2rem",
//         }}
//       >
//         Your faculty dashboard overview.
//       </p>

//       <div
//         style={{
//           display: "grid",
//           gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
//           gap: "12px",
//           marginBottom: "2rem",
//         }}
//       >
//         <div
//           style={{
//             background: "var(--color-background-secondary)",
//             borderRadius: "var(--border-radius-md)",
//             padding: "1rem",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "13px",
//               color: "var(--color-text-secondary)",
//               margin: "0 0 6px",
//             }}
//           >
//             College
//           </p>
//           <p style={{ fontSize: "16px", fontWeight: 500, margin: 0 }}>
//             {user.college?.name ?? "—"}
//           </p>
//         </div>
//         <div
//           style={{
//             background: "var(--color-background-secondary)",
//             borderRadius: "var(--border-radius-md)",
//             padding: "1rem",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "13px",
//               color: "var(--color-text-secondary)",
//               margin: "0 0 6px",
//             }}
//           >
//             Location
//           </p>
//           <p style={{ fontSize: "16px", fontWeight: 500, margin: 0 }}>
//             {user.college?.city ?? "—"}
//             {user.college?.state ? `, ${user.college.state}` : ""}
//           </p>
//         </div>
//         <div
//           style={{
//             background: "var(--color-background-secondary)",
//             borderRadius: "var(--border-radius-md)",
//             padding: "1rem",
//           }}
//         >
//           <p
//             style={{
//               fontSize: "13px",
//               color: "var(--color-text-secondary)",
//               margin: "0 0 6px",
//             }}
//           >
//             Member since
//           </p>
//           <p style={{ fontSize: "16px", fontWeight: 500, margin: 0 }}>
//             {formatDate(user.createdAt)}
//           </p>
//         </div>
//       </div>

//       <div
//         style={{
//           background: "var(--color-background-primary)",
//           border: "0.5px solid var(--color-border-tertiary)",
//           borderRadius: "var(--border-radius-lg)",
//           padding: "1.25rem",
//         }}
//       >
//         <p style={{ fontSize: "14px", fontWeight: 500, marginBottom: "6px" }}>
//           Quick actions
//         </p>
//         <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
//           <a
//             href={ROUTES.facultyProfile}
//             style={{
//               fontSize: "13px",
//               padding: "6px 14px",
//               borderRadius: "var(--border-radius-md)",
//               border: "0.5px solid var(--color-border-secondary)",
//               color: "var(--color-text-primary)",
//               textDecoration: "none",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//           >
//             <i
//               className="ti ti-user"
//               style={{ fontSize: "15px" }}
//               aria-hidden="true"
//             />{" "}
//             Edit profile
//           </a>
//           <a
//             href={ROUTES.facultySettings}
//             style={{
//               fontSize: "13px",
//               padding: "6px 14px",
//               borderRadius: "var(--border-radius-md)",
//               border: "0.5px solid var(--color-border-secondary)",
//               color: "var(--color-text-primary)",
//               textDecoration: "none",
//               display: "flex",
//               alignItems: "center",
//               gap: "6px",
//             }}
//           >
//             <i
//               className="ti ti-settings"
//               style={{ fontSize: "15px" }}
//               aria-hidden="true"
//             />{" "}
//             Settings
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Faculty Dashboard" };

export default async function FacultyHomePage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      phoneNumber: true,
      createdAt: true,
      college: { select: { name: true, city: true, state: true } },
    },
  });

  if (!user) redirect(ROUTES.login);

  const firstName = user.name?.split(" ")[0] ?? "Faculty";
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "FA";

  const infoCards = [
    {
      label: "College",
      value: user.college?.name ?? "—",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      iconBg: "#eff6ff",
      iconColor: "#1d4ed8",
      bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
      border: "#e2e8f0",
    },
    {
      label: "Location",
      value: user.college?.city
        ? `${user.college.city}${user.college.state ? `, ${user.college.state}` : ""}`
        : "—",
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      iconBg: "#f0fdf4",
      iconColor: "#16a34a",
      bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      border: "#bbf7d0",
    },
    {
      label: "Member Since",
      value: formatDate(user.createdAt),
      icon: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      iconBg: "#fff7ed",
      iconColor: "#ea580c",
      bg: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)",
      border: "#fed7aa",
    },
  ];

  const quickActions = [
    {
      label: "Edit Profile",
      href: ROUTES.facultyProfile,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: "Settings",
      href: ROUTES.facultySettings,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
              letterSpacing: "-0.5px",
              boxShadow: "0 2px 8px rgba(29,78,216,0.25)",
            }}
          >
            {initials}
          </div>
          <div>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#94a3b8",
                margin: "0 0 4px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Faculty Portal
            </p>
            <h1
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#0f172a",
                margin: 0,
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              Welcome back, {firstName} 👋
            </h1>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            padding: "8px 14px",
            fontSize: "12px",
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 0 2px #d1fae5",
            }}
          />
          Active session
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {infoCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
              borderRadius: "14px",
              padding: "1.25rem 1.4rem",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-18px",
                right: "-18px",
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: card.iconColor,
                opacity: 0.07,
              }}
            />
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "11px",
                background: card.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: card.iconColor,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {card.icon}
            </div>
            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  fontSize: "10.5px",
                  color: "#94a3b8",
                  margin: "0 0 4px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {card.label}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  margin: 0,
                  color: "#0f172a",
                  letterSpacing: "-0.2px",
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                }}
              >
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid #f1f5f9",
            background: "#fafafa",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#64748b"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.2px",
            }}
          >
            Quick Actions
          </p>
        </div>

        <div
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              style={{
                fontSize: "13px",
                padding: "8px 16px",
                borderRadius: "9px",
                border: "1px solid #e2e8f0",
                color: "#334155",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: "#fff",
                fontWeight: 600,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                transition: "all 0.14s",
              }}
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
