import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { SeoSettingsForm } from "@/features/cms/components/seo-settings-form";

export const metadata = { title: "SEO Settings — CMS" };

export default async function CmsSeoPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const settings = (await db.seoSettings.findUnique({
    where: { id: "global" },
  })) ?? {
    siteTitleSuffix: "— MDSSC",
    metaDescription: "",
    ogImage: null,
    googleAnalyticsId: null,
    searchConsoleVerify: null,
    robotsIndex: true,
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "680px",
      }}
    >
      <div style={{ marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
            letterSpacing: "-0.4px",
          }}
        >
          Global SEO
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Site-wide SEO, analytics and social sharing settings
        </p>
      </div>
      <SeoSettingsForm initial={settings} />
    </div>
  );
}
