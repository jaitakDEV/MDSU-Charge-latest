"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/app";

const icons = {
  overview: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  company: (
    <svg
      width="14"
      height="14"
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
  listings: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  profile: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  settings: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
    </svg>
  ),
};

const navGroups = [
  {
    label: "Navigation",
    items: [{ label: "Overview", href: ROUTES.provider, icon: icons.overview }],
  },
  {
    label: "Hiring",
    items: [
      {
        label: "My Listings",
        href: ROUTES.providerListings,
        icon: icons.listings,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Company Profile",
        href: ROUTES.providerCompany,
        icon: icons.company,
      },
      {
        label: "Settings",
        href: ROUTES.providerSettings,
        icon: icons.settings,
      },
    ],
  },
];

function NavLink({
  label,
  href,
  icon,
  isActive,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 12px",
        borderRadius: "9px",
        fontSize: "13.5px",
        fontWeight: isActive ? 600 : 450,
        color: isActive ? "#1d4ed8" : "#64748b",
        background: isActive
          ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
          : "transparent",
        textDecoration: "none",
        border: isActive ? "1px solid #bfdbfe" : "1px solid transparent",
        position: "relative",
      }}
    >
      {isActive && (
        <span
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "3px",
            height: "18px",
            borderRadius: "0 3px 3px 0",
            background: "#1d4ed8",
          }}
        />
      )}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "28px",
          height: "28px",
          borderRadius: "7px",
          background: isActive ? "#dbeafe" : "#f8fafc",
          flexShrink: 0,
          color: isActive ? "#1d4ed8" : "#94a3b8",
        }}
      >
        {icon}
      </span>
      {label}
    </Link>
  );
}

export function ProviderSidebar({
  companyName,
  logoUrl,
}: {
  companyName: string;
  logoUrl: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "232px",
        flexShrink: 0,
        background: "#fff",
        borderRight: "1px solid #e8edf2",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Company header */}
      <div
        style={{
          padding: "1.25rem",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "#f1f5f9",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span
              style={{ fontSize: "15px", fontWeight: 700, color: "#94a3b8" }}
            >
              {companyName[0]}
            </span>
          )}
        </div>
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0f172a",
            margin: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {companyName}
        </p>
      </div>

      <nav
        style={{
          flex: 1,
          padding: "1.25rem 0.875rem",
          display: "flex",
          flexDirection: "column",
          gap: "0",
          overflowY: "auto",
        }}
        aria-label="Provider navigation"
      >
        {navGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: "4px" }}>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#b0bec5",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                padding: "0 0.625rem",
                margin: gi === 0 ? "0 0 8px" : "12px 0 8px",
              }}
            >
              {group.label}
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1px" }}
            >
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <NavLink
                    key={item.href}
                    label={item.label}
                    href={item.href}
                    icon={item.icon}
                    isActive={isActive}
                  />
                );
              })}
            </div>
            {gi < navGroups.length - 1 && (
              <div
                style={{
                  height: "1px",
                  background:
                    "linear-gradient(to right, #f1f5f9, #e2e8f0, #f1f5f9)",
                  margin: "10px 0.625rem 0",
                }}
              />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
