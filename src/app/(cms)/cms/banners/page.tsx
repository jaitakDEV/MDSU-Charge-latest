import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { BannerManager } from "@/features/cms/components/banners/banner-manager";

export const metadata = { title: "Banners — CMS" };

export default async function CmsBannersPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const banners = await db.banner.findMany({
    orderBy: { displayOrder: "asc" },
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
            letterSpacing: "-0.4px",
          }}
        >
          Banners
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Manage homepage carousel banners
        </p>
      </div>
      <BannerManager initialBanners={banners} />
    </div>
  );
}
