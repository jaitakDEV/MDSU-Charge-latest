import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { AddCollegeModal } from "@/features/admin/components/add-college-modal";
import { ToggleCollegeStatusButton } from "@/features/admin/components/toggle-college-status-button";

export const metadata = { title: "Admin — Colleges" };

const PER_PAGE = 10;

export default async function AdminCollegesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { q, page } = await searchParams;
  const query = q?.trim() ?? "";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const skip = (currentPage - 1) * PER_PAGE;

  const where: Prisma.CollegeWhereInput = query
    ? { name: { contains: query, mode: "insensitive" } }
    : {};

  // const [totalCount, colleges] = await Promise.all([
  //   db.college.count({ where }),
  //   db.college.findMany({
  //     where,
  //     orderBy: [{ isOther: "asc" }, { name: "asc" }],
  //     skip,
  //     take: PER_PAGE,
  //     select: {
  //       id: true,
  //       name: true,
  //       city: true,
  //       state: true,
  //       isActive: true,
  //       isOther: true,
  //       users: {
  //         where: { role: "FACULTY", isActive: true },
  //         select: { id: true, name: true, email: true },
  //       },
  //       _count: { select: { users: true } },
  //     },
  //   }),
  // ]);

  const [totalCount, activeCount, inactiveCount, colleges] = await Promise.all([
    db.college.count({ where }),
    db.college.count({ where: { ...where, isActive: true } }),
    db.college.count({ where: { ...where, isActive: false } }),
    db.college.findMany({
      where,
      orderBy: [{ isOther: "asc" }, { name: "asc" }],
      skip,
      take: PER_PAGE,
      select: {
        id: true,
        name: true,
        city: true,
        state: true,
        isActive: true,
        isOther: true,
        users: {
          where: { role: "FACULTY", isActive: true },
          select: { id: true, name: true, email: true },
        },
        _count: { select: { users: true } },
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / PER_PAGE);
  // const activeCount = colleges.filter((c) => c.isActive).length;

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `${ROUTES.adminColleges}${qs ? `?${qs}` : ""}`;
  }

  function getPageNumbers() {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "16px",
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
            Colleges
            <span
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#94a3b8",
                marginLeft: "10px",
              }}
            >
              ({totalCount})
            </span>
          </h1>
          <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0 }}>
            Manage college listings and faculty assignments.
          </p>
        </div>

        <form
          method="GET"
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div style={{ position: "relative" }}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

            <input
              name="q"
              defaultValue={query}
              placeholder="Search college…"
              style={{
                fontSize: "13px",
                padding: "8px 12px 8px 32px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                background: "#fff",
                color: "#0f172a",
                width: "230px",
                outline: "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              fontSize: "13px",
              padding: "8px 18px",
              border: "none",
              borderRadius: "9px",
              background: "#1d4ed8",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 600,
              boxShadow: "0 1px 3px rgba(29,78,216,0.25)",
            }}
          >
            Search
          </button>
          {query && (
            <a
              href={ROUTES.adminColleges}
              style={{
                fontSize: "13px",
                padding: "8px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                color: "#64748b",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                background: "#fff",
                fontWeight: 500,
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
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
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              Clear
            </a>
          )}
        </form>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            label: "Total Colleges",
            value: totalCount,
            iconColor: "#1d4ed8",
            iconBg: "#eff6ff",
            bg: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
            border: "#e2e8f0",
            valueColor: "#0f172a",
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            ),
          },
          {
            label: "Active",
            // value: colleges.filter((c) => c.isActive).length,
            value: activeCount,
            iconColor: "#16a34a",
            iconBg: "#f0fdf4",
            bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
            border: "#bbf7d0",
            valueColor: "#15803d",
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
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ),
          },
          {
            label: "Inactive",
            // value: colleges.filter((c) => !c.isActive).length,
            value: inactiveCount,
            iconColor: "#dc2626",
            iconBg: "#fef2f2",
            bg: "linear-gradient(135deg, #fef2f2 0%, #fecaca 100%)",
            border: "#fecaca",
            valueColor: "#dc2626",
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
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            ),
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: "14px",
              padding: "1.25rem 1.4rem",
              display: "flex",
              alignItems: "center",
              gap: "16px",
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
                background: s.iconColor,
                opacity: 0.07,
              }}
            />
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "11px",
                background: s.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: s.iconColor,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}
            >
              {s.icon}
            </div>
            <div>
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
                {s.label}
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  margin: 0,
                  color: s.valueColor,
                  letterSpacing: "-1px",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <AddCollegeModal />
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
            justifyContent: "space-between",
            padding: "1rem 1.5rem",
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
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
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
                All Colleges
              </p>
              <p style={{ margin: 0, fontSize: "11.5px", color: "#94a3b8" }}>
                {query ? `Results for "${query}" — ` : ""}
                Page {currentPage} of {totalPages || 1}
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
            {colleges.length} / {totalCount}
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
                  "College",
                  "Location",
                  "Total Users",
                  "Faculty Assigned",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 18px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#94a3b8",
                      fontSize: "10.5px",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      whiteSpace: "nowrap",
                      borderBottom: "1px solid #f1f5f9",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {colleges.map((c, i) => {
                const activeFaculty = c.users[0];
                return (
                  <tr
                    key={c.id}
                    style={{
                      borderBottom:
                        i < colleges.length - 1 ? "1px solid #f8fafc" : "none",
                    }}
                  >
                    <td style={{ padding: "13px 18px" }}>
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
                            borderRadius: "9px",
                            background:
                              "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                            border: "1px solid #bfdbfe",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#1d4ed8"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        </div>
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 600,
                              color: "#0f172a",
                              lineHeight: 1.3,
                            }}
                          >
                            {c.name}
                          </p>
                          {c.isOther && (
                            <span
                              style={{
                                fontSize: "10px",
                                padding: "1px 7px",
                                borderRadius: "5px",
                                background: "#f1f5f9",
                                color: "#94a3b8",
                                fontWeight: 600,
                                letterSpacing: "0.03em",
                                display: "inline-block",
                                marginTop: "2px",
                              }}
                            >
                              fallback
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "13px 18px" }}>
                      {c.city ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            color: "#64748b",
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#cbd5e1"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {c.city}
                          {c.state ? `, ${c.state}` : ""}
                        </div>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>

                    <td style={{ padding: "13px 18px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: c._count.users > 0 ? "#0f172a" : "#cbd5e1",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={c._count.users > 0 ? "#94a3b8" : "#e2e8f0"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        {c._count.users}
                      </span>
                    </td>

                    <td style={{ padding: "13px 18px" }}>
                      {activeFaculty ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "7px",
                          }}
                        >
                          <div
                            style={{
                              width: "22px",
                              height: "22px",
                              borderRadius: "6px",
                              background: "#f0fdf4",
                              border: "1px solid #bbf7d0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "9px",
                              fontWeight: 700,
                              color: "#16a34a",
                              flexShrink: 0,
                            }}
                          >
                            {(activeFaculty.name ??
                              activeFaculty.email)[0].toUpperCase()}
                          </div>
                          <span
                            style={{
                              fontSize: "12.5px",
                              color: "#16a34a",
                              fontWeight: 600,
                            }}
                          >
                            {activeFaculty.name ?? activeFaculty.email}
                          </span>
                        </div>
                      ) : (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#cbd5e1",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                          </svg>
                          None assigned
                        </span>
                      )}
                    </td>

                    <td style={{ padding: "13px 18px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "11px",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontWeight: 600,
                          background: c.isActive ? "#f0fdf4" : "#fef2f2",
                          color: c.isActive ? "#16a34a" : "#dc2626",
                          border: `1px solid ${c.isActive ? "#bbf7d0" : "#fecaca"}`,
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: c.isActive ? "#16a34a" : "#dc2626",
                            flexShrink: 0,
                          }}
                        />
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 18px" }}>
                      <ToggleCollegeStatusButton
                        collegeId={c.id}
                        isActive={c.isActive}
                      />
                    </td>
                  </tr>
                );
              })}

              {colleges.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{ padding: "4rem 2rem", textAlign: "center" }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        background: "#f8fafc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#cbd5e1"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#475569",
                      }}
                    >
                      No colleges found
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "12.5px",
                        color: "#94a3b8",
                      }}
                    >
                      {query
                        ? `No results for "${query}". Try a different search term.`
                        : "No colleges have been added yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalCount > 0 && (
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid #f1f5f9",
              background: "#fafafa",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8" }}>
              Showing{" "}
              <span style={{ fontWeight: 600, color: "#64748b" }}>
                {skip + 1}–{Math.min(skip + PER_PAGE, totalCount)}
              </span>{" "}
              of{" "}
              <span style={{ fontWeight: 600, color: "#64748b" }}>
                {totalCount}
              </span>{" "}
              colleges{query && ` matching "${query}"`}
            </p>

            {totalPages > 1 && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                {currentPage > 1 ? (
                  <Link
                    href={pageUrl(currentPage - 1)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      color: "#64748b",
                      textDecoration: "none",
                      fontSize: "13px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
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
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </Link>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid #f1f5f9",
                      background: "#f8fafc",
                      color: "#cbd5e1",
                      fontSize: "13px",
                    }}
                  >
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
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </span>
                )}

                {getPageNumbers().map((p, idx) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        fontSize: "13px",
                        color: "#94a3b8",
                      }}
                    >
                      ···
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={pageUrl(p as number)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        border:
                          p === currentPage
                            ? "1px solid #bfdbfe"
                            : "1px solid #e2e8f0",
                        background:
                          p === currentPage
                            ? "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
                            : "#fff",
                        color: p === currentPage ? "#1d4ed8" : "#64748b",
                        textDecoration: "none",
                        fontSize: "12.5px",
                        fontWeight: p === currentPage ? 700 : 500,
                        boxShadow:
                          p === currentPage
                            ? "none"
                            : "0 1px 2px rgba(0,0,0,0.04)",
                      }}
                    >
                      {p}
                    </Link>
                  ),
                )}

                {currentPage < totalPages ? (
                  <Link
                    href={pageUrl(currentPage + 1)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      background: "#fff",
                      color: "#64748b",
                      textDecoration: "none",
                      fontSize: "13px",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                    }}
                  >
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
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                ) : (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1px solid #f1f5f9",
                      background: "#f8fafc",
                      color: "#cbd5e1",
                      fontSize: "13px",
                    }}
                  >
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
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
