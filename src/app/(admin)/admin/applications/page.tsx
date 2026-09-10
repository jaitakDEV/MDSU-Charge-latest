import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { getApplicationStatusLabel } from "@/lib/job-utils";

export const metadata = { title: "All Applications — Admin" };

const PAGE_SIZE = 30;

export default async function AdminApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { q, status, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const filter = status ?? "ALL";
  const page = Math.max(1, Number(pageParam ?? 1));

  const where = {
    ...(filter !== "ALL" ? { status: filter as any } : {}),
    ...(query
      ? {
          OR: [
            {
              profile: {
                user: {
                  name: { contains: query, mode: "insensitive" as const },
                },
              },
            },
            {
              listing: {
                title: { contains: query, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };

  const [applications, total] = await Promise.all([
    db.jobApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        status: true,
        createdAt: true,
        profile: { select: { user: { select: { name: true, email: true } } } },
        listing: {
          select: { title: true, company: { select: { companyName: true } } },
        },
      },
    }),
    db.jobApplication.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "1100px",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          All Applications
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          {total} total applications platform-wide
        </p>
      </div>

      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        <input
          name="q"
          defaultValue={query}
          placeholder="Search by student or job title…"
          style={{
            height: "38px",
            padding: "0 14px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            fontSize: "13px",
            width: "300px",
          }}
        />
      </form>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          overflow: "hidden",
          marginBottom: "1rem",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12.5px",
          }}
        >
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Applicant", "Listing", "Company", "Status", "Applied"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 14px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#64748b",
                      borderBottom: "1px solid #e8edf2",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {applications.map((a, i) => (
              <tr
                key={a.id}
                style={{
                  borderTop: "1px solid #f1f5f9",
                  background: i % 2 === 1 ? "#fafbfc" : "#fff",
                }}
              >
                <td style={{ padding: "11px 14px" }}>
                  <p style={{ margin: "0 0 1px", fontWeight: 600 }}>
                    {a.profile.user.name}
                  </p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                    {a.profile.user.email}
                  </p>
                </td>
                <td style={{ padding: "11px 14px" }}>{a.listing.title}</td>
                <td style={{ padding: "11px 14px", color: "#64748b" }}>
                  {a.listing.company.companyName}
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <span
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "20px",
                      background: "#f8fafc",
                      color: "#475569",
                    }}
                  >
                    {getApplicationStatusLabel(a.status)}
                  </span>
                </td>
                <td style={{ padding: "11px 14px", color: "#94a3b8" }}>
                  {a.createdAt.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div
          style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}
        >
          {Array.from(
            { length: Math.min(totalPages, 10) },
            (_, i) => i + 1,
          ).map((p) => (
            <a
              key={p}
              href={`?page=${p}${query ? `&q=${query}` : ""}`}
              style={{
                fontSize: "12.5px",
                padding: "5px 12px",
                borderRadius: "8px",
                border: "0.5px solid #e2e8f0",
                textDecoration: "none",
                background: p === page ? "#eff6ff" : "#fff",
                color: p === page ? "#1d4ed8" : "#475569",
              }}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
