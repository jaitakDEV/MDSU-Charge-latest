import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { RefundButton } from "@/features/admin/components/commerce/refund-button";

export const metadata = { title: "Refunds — Admin" };

export default async function AdminRefundsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  // Show completed orders eligible for refund
  const orders = await db.order.findMany({
    where: {
      status: { in: ["COMPLETED"] },
      ...(query
        ? {
            OR: [
              {
                user: {
                  email: { contains: query, mode: "insensitive" as const },
                },
              },
              {
                razorpayPaymentId: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      amountPaid: true,
      status: true,
      razorpayOrderId: true,
      razorpayPaymentId: true,
      createdAt: true,
      user: { select: { name: true, email: true } },
      course: { select: { title: true } },
    },
  });

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
          Refunds
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Initiate refunds for completed orders access revoked on refund
        </p>
      </div>

      <form method="GET" style={{ marginBottom: "1.25rem" }}>
        <input
          name="q"
          defaultValue={query}
          placeholder="Search by email or payment ID…"
          style={{
            height: "38px",
            padding: "0 12px",
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
              {[
                "Student",
                "Course",
                "Amount",
                "Payment ID",
                "Date",
                "Action",
              ].map((h) => (
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
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr
                key={o.id}
                style={{
                  borderTop: "1px solid #f1f5f9",
                  background: i % 2 === 1 ? "#fafbfc" : "#fff",
                }}
              >
                <td style={{ padding: "11px 14px" }}>
                  <p
                    style={{
                      margin: "0 0 1px",
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    {o.user.name ?? "—"}
                  </p>
                  <p style={{ margin: 0, fontSize: "11px", color: "#94a3b8" }}>
                    {o.user.email}
                  </p>
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    color: "#334155",
                    maxWidth: "180px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {o.course.title}
                  </p>
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  ₹{(o.amountPaid / 100).toLocaleString("en-IN")}
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <code
                    style={{
                      fontSize: "10.5px",
                      color: "#64748b",
                      background: "#f8fafc",
                      padding: "2px 6px",
                      borderRadius: "5px",
                    }}
                  >
                    {o.razorpayPaymentId?.slice(-10) ?? "—"}
                  </code>
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    color: "#94a3b8",
                    fontSize: "12px",
                  }}
                >
                  {o.createdAt.toLocaleDateString("en-IN")}
                </td>
                <td style={{ padding: "11px 14px" }}>
                  <RefundButton
                    orderId={o.id}
                    paymentId={o.razorpayPaymentId ?? ""}
                    amount={o.amountPaid}
                  />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#94a3b8",
                  }}
                >
                  No eligible orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
