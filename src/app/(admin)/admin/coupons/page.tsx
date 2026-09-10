import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { CouponManager } from "@/features/admin/components/commerce/coupon-manager";

export const metadata = { title: "Coupons — Admin" };

export default async function AdminCouponsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    redirect(ROUTES.dashboard);

  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      discountType: true,
      discountValue: true,
      validFrom: true,
      validUntil: true,
      maxUses: true,
      usedCount: true,
      isActive: true,
      minOrderValue: true,
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
          Coupons
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Create and manage discount codes
        </p>
      </div>
      <CouponManager initialCoupons={coupons} />
    </div>
  );
}
