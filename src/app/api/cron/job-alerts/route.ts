import { NextResponse } from "next/server";
import { db } from "@/server/db";
import { findMatchingListings } from "@/lib/job-matching";
import { sendJobAlertDigestEmail } from "@/server/email";

export async function GET(req: Request) {
  // ── Protect the cron endpoint with a secret ──────────────────
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const frequency = (searchParams.get("frequency") ?? "DAILY") as
    | "DAILY"
    | "WEEKLY";

  const since =
    frequency === "DAILY"
      ? new Date(Date.now() - 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  try {
    // ── Fetch all students with alerts enabled for this frequency ──
    const preferences = await db.jobPreference.findMany({
      where: {
        isAlertEnabled: true,
        alertFrequency: frequency,
      },
      select: {
        id: true,
        preferredTypes: true,
        preferredRoles: true,
        preferredLocations: true,
        preferredWorkMode: true,
        minSalary: true,
        preferredIndustries: true,
        profile: {
          select: {
            user: { select: { name: true, email: true } },
          },
        },
      },
    });

    let sentCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const pref of preferences) {
      try {
        const matches = await findMatchingListings(
          {
            preferredTypes: pref.preferredTypes,
            preferredRoles: pref.preferredRoles,
            preferredLocations: pref.preferredLocations,
            preferredWorkMode: pref.preferredWorkMode,
            minSalary: pref.minSalary,
            preferredIndustries: pref.preferredIndustries,
          },
          since,
        );

        if (matches.length === 0) {
          skippedCount++;
          continue;
        }

        await sendJobAlertDigestEmail({
          email: pref.profile.user.email,
          studentName: pref.profile.user.name ?? "Student",
          listings: matches.map((m) => ({
            title: m.title,
            companyName: m.company.companyName,
            slug: m.slug,
            location: m.location,
            opportunityType: m.opportunityType,
          })),
          frequency,
        });

        sentCount++;
      } catch (err) {
        console.error(
          `[JOB_ALERT_FAILED] student=${pref.profile.user.email}`,
          err,
        );
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      frequency,
      totalStudents: preferences.length,
      sent: sentCount,
      skipped: skippedCount,
      errors: errorCount,
    });
  } catch (error) {
    console.error("[JOB_ALERTS_CRON]", error);
    return NextResponse.json(
      { error: "Failed to run job alerts." },
      { status: 500 },
    );
  }
}
