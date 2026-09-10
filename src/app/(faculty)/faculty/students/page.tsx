import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";

export const metadata = { title: "Faculty — My Students" };

const PAGE_SIZE = 20;

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

export default async function FacultyStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  // Faculty ka college fetch karo
  const faculty = await db.user.findUnique({
    where: { id: session.user.id },
    select: { collegeId: true, college: { select: { name: true } } },
  });

  if (!faculty || session.user.role !== "FACULTY") redirect(ROUTES.login);

  // Agar faculty ka college nahi hai
  if (!faculty.collegeId) {
    return (
      <div
        style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          textAlign: "center",
          padding: "4rem 2rem",
        }}
      >
        <p style={{ fontSize: "15px", color: "#64748b" }}>
          No college assigned to your account.
        </p>
      </div>
    );
  }

  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, Number(pageParam ?? 1));
  const skip = (page - 1) * PAGE_SIZE;

  const where = {
    role: "STUDENT" as const,
    collegeId: faculty.collegeId, // sirf apne college ke students
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" as const } },
            { email: { contains: query, mode: "insensitive" as const } },
            {
              registrationNumber: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            { rollNumber: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [students, total] = await Promise.all([
    db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: PAGE_SIZE,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        emailVerified: true,
        registrationNumber: true,
        rollNumber: true,
        createdAt: true,
      },
    }),
    db.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `${ROUTES.facultyStudents}${qs ? `?${qs}` : ""}`;
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
            {faculty.college?.name}
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
            Students
            <span
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#94a3b8",
                marginLeft: "10px",
              }}
            >
              ({total})
            </span>
          </h1>
          <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0 }}>
            Students registered from your college.
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
              placeholder="Search name, email, roll no…"
              style={{
                fontSize: "13px",
                padding: "8px 12px 8px 32px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                background: "#fff",
                color: "#0f172a",
                width: "240px",
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
            }}
          >
            Search
          </button>
          {query && (
            <a
              href={ROUTES.facultyStudents}
              style={{
                fontSize: "13px",
                padding: "8px 14px",
                border: "1px solid #e2e8f0",
                borderRadius: "9px",
                color: "#64748b",
                textDecoration: "none",
                background: "#fff",
                fontWeight: 500,
              }}
            >
              Clear
            </a>
          )}
        </form>
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
                  "Student",
                  "Roll No",
                  "Reg No",
                  "Phone",
                  "Status",
                  "Verified",
                  "Joined",
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
              {students.map((s, i) => {
                const palette = avatarColor(s.email);
                const initials = s.name
                  ? s.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "?";
                return (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom:
                        i < students.length - 1 ? "1px solid #f8fafc" : "none",
                    }}
                  >
                    <td style={{ padding: "13px 18px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "11px",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: palette.bg,
                            color: palette.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12.5px",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {initials}
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
                            {s.name ?? (
                              <span style={{ color: "#cbd5e1" }}>No name</span>
                            )}
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "11.5px",
                              color: "#94a3b8",
                            }}
                          >
                            {s.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontSize: "12.5px",
                          fontWeight: 700,
                          color: "#1d4ed8",
                        }}
                      >
                        {s.rollNumber ?? (
                          <span style={{ color: "#cbd5e1", fontWeight: 400 }}>
                            —
                          </span>
                        )}
                      </span>
                    </td>

                    <td style={{ padding: "13px 18px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          fontSize: "11.5px",
                          color: "#475569",
                          fontFamily: "monospace",
                        }}
                      >
                        {s.registrationNumber ?? (
                          <span style={{ color: "#cbd5e1" }}>—</span>
                        )}
                      </span>
                    </td>

                    <td style={{ padding: "13px 18px", color: "#64748b" }}>
                      {s.phoneNumber ?? (
                        <span style={{ color: "#cbd5e1" }}>—</span>
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
                          background: s.isActive ? "#f0fdf4" : "#fef2f2",
                          color: s.isActive ? "#16a34a" : "#dc2626",
                          border: `1px solid ${s.isActive ? "#bbf7d0" : "#fecaca"}`,
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: s.isActive ? "#16a34a" : "#dc2626",
                          }}
                        />
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
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
                          background: s.emailVerified ? "#f0fdf4" : "#fffbeb",
                          color: s.emailVerified ? "#16a34a" : "#d97706",
                          border: `1px solid ${s.emailVerified ? "#bbf7d0" : "#fde68a"}`,
                        }}
                      >
                        {s.emailVerified ? "Verified" : "Pending"}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "13px 18px",
                        color: "#94a3b8",
                        fontSize: "12.5px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.createdAt.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}

              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: "4rem 2rem", textAlign: "center" }}
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#475569",
                        margin: "0 0 4px",
                      }}
                    >
                      No students found
                    </p>
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "#94a3b8",
                        margin: 0,
                      }}
                    >
                      {query
                        ? `No results for "${query}".`
                        : "No students registered from your college yet."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
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
                {skip + 1}–{Math.min(skip + PAGE_SIZE, total)}
              </span>{" "}
              of{" "}
              <span style={{ fontWeight: 600, color: "#64748b" }}>{total}</span>{" "}
              students
            </p>
            <div style={{ display: "flex", gap: "4px" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={pageUrl(p)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border:
                      p === page ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                    background: p === page ? "#eff6ff" : "#fff",
                    color: p === page ? "#1d4ed8" : "#64748b",
                    textDecoration: "none",
                    fontSize: "12.5px",
                    fontWeight: p === page ? 700 : 500,
                  }}
                >
                  {p}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
