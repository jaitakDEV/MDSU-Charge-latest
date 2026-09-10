import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Admin — Overview" };

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const [totalUsers, activeUsers, unverifiedUsers, adminCount] =
    await Promise.all([
      db.user.count(),
      db.user.count({ where: { isActive: true } }),
      db.user.count({ where: { emailVerified: null } }),
      db.user.count({ where: { role: "ADMIN" } }),
    ]);

  const recentUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
      isActive: true,
    },
  });

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      accent: "#3b82f6",
      bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
      iconBg: "#3b82f6",
      delta: "+12% this month",
    },
    {
      label: "Active Users",
      value: activeUsers,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      ),
      accent: "#10b981",
      bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
      iconBg: "#10b981",
      delta: "Currently online",
    },
    {
      label: "Unverified",
      value: unverifiedUsers,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      accent: "#f59e0b",
      bg: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
      iconBg: "#f59e0b",
      delta: "Needs attention",
    },
    {
      label: "Admins",
      value: adminCount,
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      accent: "#8b5cf6",
      bg: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
      iconBg: "#8b5cf6",
      delta: "Super users",
    },
  ];

  return (
    <div
      style={{
        padding: "0",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "2rem",
          paddingBottom: "1.5rem",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#94a3b8",
              margin: "0 0 6px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Admin Console
          </p>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px",
              letterSpacing: "-0.6px",
              lineHeight: 1.2,
            }}
          >
            Platform Overview
          </h1>
          <p
            style={{
              fontSize: "13.5px",
              color: "#94a3b8",
              margin: 0,
              fontWeight: 400,
            }}
          >
            Monitor user activity and platform health at a glance.
          </p>
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
          Live data
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: "14px",
              padding: "1.4rem 1.5rem",
              border: "1px solid rgba(0,0,0,0.05)",
              position: "relative",
              overflow: "hidden",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: s.accent,
                opacity: 0.07,
              }}
            />

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                  margin: 0,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                {s.label}
              </p>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  background: s.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
            </div>

            <p
              style={{
                fontSize: "32px",
                fontWeight: 800,
                margin: "0 0 6px",
                color: "#0f172a",
                letterSpacing: "-1.5px",
                lineHeight: 1,
              }}
            >
              {s.value.toLocaleString()}
            </p>
            <p
              style={{
                fontSize: "11.5px",
                color: "#94a3b8",
                margin: 0,
                fontWeight: 500,
              }}
            >
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1.1rem 1.5rem",
            borderBottom: "1px solid #f1f5f9",
            background: "#fafafa",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.2px",
                }}
              >
                Recent Signups
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "11.5px",
                  color: "#94a3b8",
                  fontWeight: 400,
                }}
              >
                Last 5 registered users
              </p>
            </div>
          </div>

          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#64748b",
              background: "#f1f5f9",
              padding: "4px 10px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
            }}
          >
            {recentUsers.length} users
          </span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {[
                  { label: "User", width: "35%" },
                  { label: "Email", width: "30%" },
                  { label: "Role", width: "15%" },
                  { label: "Status", width: "20%" },
                ].map((h) => (
                  <th
                    key={h.label}
                    style={{
                      padding: "10px 20px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#94a3b8",
                      fontSize: "10.5px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid #f1f5f9",
                      width: h.width,
                    }}
                  >
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom:
                      i < recentUsers.length - 1 ? "1px solid #f8fafc" : "none",
                    transition: "background 0.1s ease",
                  }}
                >
                  <td style={{ padding: "14px 20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "10px",
                          background: `hsl(${((u.name?.charCodeAt(0) ?? 65) * 5) % 360}, 55%, 92%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: `hsl(${((u.name?.charCodeAt(0) ?? 65) * 5) % 360}, 45%, 38%)`,
                          flexShrink: 0,
                          letterSpacing: "-0.5px",
                        }}
                      >
                        {u.name
                          ? u.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : "—"}
                      </div>
                      <span
                        style={{
                          fontWeight: 600,
                          color: "#0f172a",
                          letterSpacing: "-0.1px",
                        }}
                      >
                        {u.name ?? (
                          <span style={{ color: "#cbd5e1", fontWeight: 400 }}>
                            No name
                          </span>
                        )}
                      </span>
                    </div>
                  </td>

                  <td
                    style={{
                      padding: "14px 20px",
                      color: "#64748b",
                      fontWeight: 400,
                    }}
                  >
                    {u.email}
                  </td>

                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        background: u.role === "ADMIN" ? "#fef2f2" : "#f8fafc",
                        color: u.role === "ADMIN" ? "#dc2626" : "#475569",
                        border: `1px solid ${u.role === "ADMIN" ? "#fecaca" : "#e2e8f0"}`,
                      }}
                    >
                      {u.role === "ADMIN" && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      )}
                      {u.role}
                    </span>
                  </td>

                  <td style={{ padding: "14px 20px" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        padding: "3px 10px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        background: u.isActive ? "#f0fdf4" : "#fef2f2",
                        color: u.isActive ? "#16a34a" : "#dc2626",
                        border: `1px solid ${u.isActive ? "#bbf7d0" : "#fecaca"}`,
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: u.isActive ? "#16a34a" : "#dc2626",
                          flexShrink: 0,
                        }}
                      />
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #f1f5f9",
            background: "#fafafa",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              color: "#94a3b8",
              fontWeight: 400,
            }}
          >
            Showing most recent {recentUsers.length} signups
          </p>
          <a
            href="/admin/users"
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#3b82f6",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            View all users
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
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
