import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { RevenueChart } from "@/features/admin/components/commerce/revenue-chart";

export const metadata = { title: "Revenue — Admin" };

export default async function AdminRevenuePage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const now = new Date();

  const totalResult = await db.order.aggregate({
    where: { status: "COMPLETED" },
    _sum: { amountPaid: true },
    _count: { _all: true },
  });

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthResult = await db.order.aggregate({
    where: { status: "COMPLETED", createdAt: { gte: monthStart } },
    _sum: { amountPaid: true },
    _count: { _all: true },
  });

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    return { start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 1) };
  }).reverse();

  const monthlyData = await Promise.all(
    months.map(async ({ start, end }) => {
      const result = await db.order.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: start, lt: end } },
        _sum: { amountPaid: true },
        _count: { _all: true },
      });
      return {
        month: start.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        }),
        amount: (result._sum.amountPaid ?? 0) / 100,
        orders: result._count._all,
      };
    }),
  );

  const topCourses = await db.order.groupBy({
    by: ["courseId"],
    where: { status: "COMPLETED" },
    _sum: { amountPaid: true },
    _count: { _all: true },
    orderBy: { _sum: { amountPaid: "desc" } },
    take: 5,
  });

  const topCourseDetails = await db.course.findMany({
    where: { id: { in: topCourses.map((t) => t.courseId) } },
    select: { id: true, title: true },
  });

  const topCoursesWithTitles = topCourses.map((tc) => ({
    ...tc,
    title:
      topCourseDetails.find((d) => d.id === tc.courseId)?.title ?? "Unknown",
  }));

  const totalRevenue = (totalResult._sum.amountPaid ?? 0) / 100;
  const monthRevenue = (monthResult._sum.amountPaid ?? 0) / 100;

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "900px",
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
          Revenue
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Platform earnings overview
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "1.5rem",
        }}
      >
        {[
          {
            label: "Total Revenue",
            value: `₹${totalRevenue.toLocaleString("en-IN")}`,
            sub: `${totalResult._count._all} orders total`,
          },
          {
            label: "This Month",
            value: `₹${monthRevenue.toLocaleString("en-IN")}`,
            sub: `${monthResult._count._all} orders`,
          },
          {
            label: "Avg Order Value",
            value:
              totalResult._count._all > 0
                ? `₹${Math.round(totalRevenue / totalResult._count._all).toLocaleString("en-IN")}`
                : "₹0",
            sub: "per completed order",
          },
        ].map(({ label, value, sub }) => (
          <div
            key={label}
            style={{
              background: "#fff",
              border: "1px solid #e8edf2",
              borderRadius: "14px",
              padding: "1.1rem 1.25rem",
            }}
          >
            <p
              style={{
                fontSize: "11.5px",
                color: "#94a3b8",
                margin: "0 0 4px",
                fontWeight: 600,
              }}
            >
              {label}
            </p>
            <p
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 3px",
                letterSpacing: "-0.5px",
              }}
            >
              {value}
            </p>
            <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.25rem",
          marginBottom: "1.25rem",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 1rem",
          }}
        >
          Monthly Revenue
        </p>
        <RevenueChart data={monthlyData} />
      </div>

      {/* Top courses */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e8edf2",
          borderRadius: "14px",
          padding: "1.25rem",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 1rem",
          }}
        >
          Top Courses by Revenue
        </p>
        {topCoursesWithTitles.map((tc, i) => {
          const amount = (tc._sum.amountPaid ?? 0) / 100;
          const maxAmount =
            (topCoursesWithTitles[0]?._sum.amountPaid ?? 1) / 100;
          return (
            <div
              key={tc.courseId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#94a3b8",
                  width: "16px",
                }}
              >
                {i + 1}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: "0 0 4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tc.title}
                </p>
                <div
                  style={{
                    height: "4px",
                    background: "#f1f5f9",
                    borderRadius: "99px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "4px",
                      borderRadius: "99px",
                      background: "#1d4ed8",
                      width: `${(amount / maxAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 2px",
                  }}
                >
                  ₹{amount.toLocaleString("en-IN")}
                </p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>
                  {tc._count._all} sales
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
