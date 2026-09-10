import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { formatDate } from "@/lib/utils";
import { AdminUserActions } from "@/features/admin/components/admin-user-actions";
import Link from "next/link";

const avatarPalette = [
  { bg: "#eff6ff", color: "#1d4ed8" },
  { bg: "#f0fdf4", color: "#16a34a" },
  { bg: "#fdf4ff", color: "#9333ea" },
  { bg: "#fff7ed", color: "#ea580c" },
  { bg: "#fef2f2", color: "#dc2626" },
  { bg: "#f0f9ff", color: "#0284c7" },
];
function avatarColor(seed: string) {
  return avatarPalette[seed.charCodeAt(0) % avatarPalette.length];
}

const ROLE_STYLE: Record<
  string,
  { bg: string; color: string; border: string }
> = {
  ADMIN: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
  FACULTY: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  STUDENT: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  CMS_EDITOR: { bg: "#fdf4ff", color: "#9333ea", border: "#e9d5ff" },
};
function roleStyle(role: string) {
  return (
    ROLE_STYLE[role] ?? { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" }
  );
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { sessions: true } },
    },
  });

  if (!user) notFound();

  const isSelf = session.user.id === user.id;
  const palette = avatarColor(user.email);
  const role = roleStyle(user.role);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const infoRows = [
    {
      label: "Email",
      value: user.email,
      mono: false,
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      label: "Role",
      value: user.role,
      mono: false,
      badge: true,
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      label: "Status",
      value: user.isActive ? "Active" : "Inactive",
      mono: false,
      statusBadge: true,
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
    },
    {
      label: "Email Verified",
      value: user.emailVerified
        ? formatDate(user.emailVerified)
        : "Not verified",
      mono: false,
      verifiedBadge: true,
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: "Active Sessions",
      value: String(user._count.sessions),
      mono: true,
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
    {
      label: "Member Since",
      value: formatDate(user.createdAt),
      mono: false,
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
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
    },
    {
      label: "Last Updated",
      value: formatDate(user.updatedAt),
      mono: false,
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: "640px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "1.75rem",
        }}
      >
        <Link
          href={ROUTES.adminUsers}
          style={{
            fontSize: "12.5px",
            color: "#64748b",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            fontWeight: 500,
            padding: "5px 10px",
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: "7px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Users
        </Link>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span style={{ fontSize: "12.5px", color: "#0f172a", fontWeight: 600 }}>
          {user.name ?? user.email}
        </span>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          marginBottom: "1.25rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "1.25rem 1.5rem",
            borderBottom: "1px solid #f1f5f9",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: palette.bg,
              color: palette.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              fontWeight: 700,
              flexShrink: 0,
              letterSpacing: "-0.5px",
              border: `1.5px solid ${palette.color}22`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: "16px",
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.3px",
              }}
            >
              {user.name ?? (
                <span style={{ color: "#94a3b8", fontWeight: 400 }}>
                  No name
                </span>
              )}
            </p>
            <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>
              {user.email}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "5px",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: "10.5px",
                padding: "3px 10px",
                borderRadius: "6px",
                fontWeight: 700,
                background: role.bg,
                color: role.color,
                border: `1px solid ${role.border}`,
                letterSpacing: "0.02em",
              }}
            >
              {user.role}
            </span>
            <span
              style={{
                fontSize: "10.5px",
                padding: "3px 10px",
                borderRadius: "6px",
                fontWeight: 600,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: user.isActive ? "#f0fdf4" : "#fef2f2",
                color: user.isActive ? "#16a34a" : "#dc2626",
                border: `1px solid ${user.isActive ? "#bbf7d0" : "#fecaca"}`,
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: user.isActive ? "#16a34a" : "#dc2626",
                }}
              />
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {infoRows.map(
          (
            { label, value, mono, badge, statusBadge, verifiedBadge, icon },
            i,
          ) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "11px 1.5rem",
                borderBottom:
                  i < infoRows.length - 1 ? "1px solid #f8fafc" : "none",
                gap: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  flexShrink: 0,
                }}
              >
                {icon}
                <span
                  style={{
                    fontSize: "12.5px",
                    color: "#64748b",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </span>
              </div>

              <div style={{ textAlign: "right", minWidth: 0 }}>
                {badge ? (
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 9px",
                      borderRadius: "6px",
                      fontWeight: 700,
                      background: role.bg,
                      color: role.color,
                      border: `1px solid ${role.border}`,
                    }}
                  >
                    {value}
                  </span>
                ) : statusBadge ? (
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 9px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: user.isActive ? "#f0fdf4" : "#fef2f2",
                      color: user.isActive ? "#16a34a" : "#dc2626",
                      border: `1px solid ${user.isActive ? "#bbf7d0" : "#fecaca"}`,
                    }}
                  >
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: user.isActive ? "#16a34a" : "#dc2626",
                      }}
                    />
                    {value}
                  </span>
                ) : verifiedBadge ? (
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "2px 9px",
                      borderRadius: "6px",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      background: user.emailVerified ? "#f0fdf4" : "#fffbeb",
                      color: user.emailVerified ? "#16a34a" : "#d97706",
                      border: `1px solid ${user.emailVerified ? "#bbf7d0" : "#fde68a"}`,
                    }}
                  >
                    {user.emailVerified ? (
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    )}
                    {value}
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: mono ? "11.5px" : "12.5px",
                      fontWeight: 500,
                      color: "#0f172a",
                      fontFamily: mono
                        ? "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"
                        : "inherit",
                      letterSpacing: mono ? "-0.3px" : "0",
                      wordBreak: "break-all",
                    }}
                  >
                    {value}
                  </span>
                )}
              </div>
            </div>
          ),
        )}
      </div>

      {!isSelf ? (
        <AdminUserActions
          user={{ id: user.id, role: user.role, isActive: user.isActive }}
        />
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 16px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#92400e",
          }}
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#d97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span style={{ fontWeight: 500 }}>
            You cannot modify your own admin account from this panel.
          </span>
        </div>
      )}
    </div>
  );
}
