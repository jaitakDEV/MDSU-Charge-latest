import { NextResponse } from "next/server";
import { db } from "@/server/db";
import {
  sendDeadlineApproachingEmail,
  sendListingAutoClosedEmail,
} from "@/server/email";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  try {
    const approaching = await db.jobListing.findMany({
      where: {
        status: "PUBLISHED",
        applicationDeadline: { gte: now, lte: in3Days },
      },
      select: {
        id: true,
        title: true,
        applicationDeadline: true,
        company: { select: { contactPerson: true, contactEmail: true } },
      },
    });

    for (const listing of approaching) {
      try {
        await sendDeadlineApproachingEmail({
          email: listing.company.contactEmail,
          contactPerson: listing.company.contactPerson,
          listingTitle: listing.title,
          deadline: listing.applicationDeadline!,
          listingId: listing.id,
        });
      } catch (e) {
        console.error("[DEADLINE_REMINDER_FAILED]", e);
      }
    }

    // ── Auto-close — deadline has passed ──────────────────────
    const expired = await db.jobListing.findMany({
      where: {
        status: "PUBLISHED",
        applicationDeadline: { lt: now },
      },
      select: {
        id: true,
        title: true,
        company: { select: { contactPerson: true, contactEmail: true } },
      },
    });

    for (const listing of expired) {
      await db.jobListing.update({
        where: { id: listing.id },
        data: { status: "CLOSED" },
      });
      try {
        await sendListingAutoClosedEmail({
          email: listing.company.contactEmail,
          contactPerson: listing.company.contactPerson,
          listingTitle: listing.title,
          listingId: listing.id,
        });
      } catch (e) {
        console.error("[AUTO_CLOSE_EMAIL_FAILED]", e);
      }
    }

    return NextResponse.json({
      success: true,
      remindersSent: approaching.length,
      autoClosed: expired.length,
    });
  } catch (error) {
    console.error("[LISTING_MAINTENANCE_CRON]", error);
    return NextResponse.json({ error: "Failed." }, { status: 500 });
  }
}
