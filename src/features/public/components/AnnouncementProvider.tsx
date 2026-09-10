import { db } from "@/server/db";
import { AnnouncementModal } from "./AnnouncementModal";

export async function AnnouncementProvider() {
  const announcement = await db.announcement.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, content: true, type: true },
  });

  if (!announcement) return null;

  return <AnnouncementModal announcement={announcement} />;
}
