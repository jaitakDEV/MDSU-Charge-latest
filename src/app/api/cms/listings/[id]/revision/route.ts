import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { sendListingRevisionEmail } from "@/server/email";
import { z } from "zod";

const schema = z.object({
  notes: z.string().min(10, "Revision notes must be at least 10 characters"),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });

    const listing = await db.jobListing.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        company: {
          select: { contactPerson: true, contactEmail: true },
        },
      },
    });

    if (!listing)
      return NextResponse.json(apiError("Listing not found."), { status: 404 });

    if (listing.status !== "SUBMITTED") {
      return NextResponse.json(
        apiError(
          "Only listings under review (SUBMITTED) can have revisions requested.",
        ),
        { status: 400 },
      );
    }

    // ── Revision requested — provider can edit + resubmit ────
    // Unlike REJECTED, REVISION_NEEDED allows the same listing to
    // be edited and resubmitted (Section 9.3).
    await db.jobListing.update({
      where: { id },
      data: {
        status: "DRAFT",
        approvalStatus: "REVISION_NEEDED",
        rejectedReason: parsed.data.notes, // reused field for the notes
        approvedById: null,
        approvedAt: null,
      },
    });

    try {
      await sendListingRevisionEmail({
        email: listing.company.contactEmail,
        contactPerson: listing.company.contactPerson,
        listingTitle: listing.title,
        notes: parsed.data.notes,
        listingId: listing.id,
      });
    } catch (emailError) {
      console.error("[LISTING_REVISION_EMAIL_FAILED]", emailError);
    }

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_LISTING_REVISION]", error);
    return NextResponse.json(apiError("Failed to request revision."), {
      status: 500,
    });
  }
}
