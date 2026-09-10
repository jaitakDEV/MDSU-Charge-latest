import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { AnnouncementManager } from "@/features/cms/components/announcement-manager";

export const metadata = { title: "Announcements — CMS" };

export default async function CmsAnnouncementsPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const announcements = await db.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "700px",
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
          Announcements
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Top sticky bar on public website
        </p>
      </div>
      <AnnouncementManager initial={announcements} />
    </div>
  );
}
