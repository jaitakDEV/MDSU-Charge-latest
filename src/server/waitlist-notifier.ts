import { db } from "@/server/db";
import { sendWaitlistSpotAvailableEmail } from "@/server/email";

/**
 * Registration cancel hone ke baad call karo.
 * Registered count decrement karta hai aur agla waitlist person notify karta hai.
 */
export async function notifyNextWaitlistPerson(eventId: string) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, slug: true },
  });

  if (!event) return;

  // Sabse pehla non-notified waitlist entry (lowest position)
  const nextInLine = await db.eventWaitlist.findFirst({
    where: {
      eventId,
      notified: false,
    },
    orderBy: { position: "asc" },
    select: {
      id: true,
      userId: true,
      guestName: true,
      guestEmail: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!nextInLine) return; // koi waitlist entry nahi

  const email = nextInLine.user?.email ?? nextInLine.guestEmail;
  const name = nextInLine.user?.name ?? nextInLine.guestName ?? "there";

  if (!email) return;

  // 24 hours expiry
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  try {
    await sendWaitlistSpotAvailableEmail({
      email,
      name,
      eventTitle: event.title,
      eventSlug: event.slug,
      expiresAt,
    });

    // Mark notified
    await db.eventWaitlist.update({
      where: { id: nextInLine.id },
      data: { notified: true },
    });
  } catch (error) {
    console.error("[WAITLIST_NOTIFY_FAILED]", error);
  }
}
