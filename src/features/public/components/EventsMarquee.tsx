import { db } from "@/server/db";
import { EventsMarqueeClient } from "./EventsMarqueeClient";

export async function EventsMarquee() {
  const events = await db.event.findMany({
    where: {
      status: "PUBLISHED",
      eventType: "UPCOMING",
      startDate: { gte: new Date() },
    },
    orderBy: { startDate: "asc" },
    take: 8,
    select: {
      id: true,
      title: true,
      slug: true,
      startDate: true,
    },
  });

  return <EventsMarqueeClient events={events} />;
}
