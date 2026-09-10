import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { sendCompanyRejectedEmail } from "@/server/email";
import { z } from "zod";

const schema = z.object({
  reason: z.string().min(10, "Rejection reason must be at least 10 characters"),
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
    if (!parsed.success) {
      return NextResponse.json(apiError(parsed.error.issues[0].message), {
        status: 400,
      });
    }

    const company = await db.companyProfile.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        approvalStatus: true,
        contactPerson: true,
        contactEmail: true,
        userId: true,
      },
    });

    if (!company)
      return NextResponse.json(apiError("Company not found."), { status: 404 });

    if (company.approvalStatus === "APPROVED") {
      return NextResponse.json(
        apiError(
          "Cannot reject an already approved company. Use suspend instead.",
        ),

        { status: 400 },
      );
    }

    await db.companyProfile.update({
      where: { id },
      data: {
        approvalStatus: "REJECTED",
        rejectedReason: parsed.data.reason,
        approvedById: null,
        approvedAt: null,
      },
    });

    try {
      await sendCompanyRejectedEmail({
        email: company.contactEmail,
        contactPerson: company.contactPerson,
        companyName: company.companyName,
        reason: parsed.data.reason,
      });
    } catch (emailError) {
      console.error("[COMPANY_REJECT_EMAIL_FAILED]", emailError);
    }

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_COMPANY_REJECT]", error);
    return NextResponse.json(apiError("Failed to reject company."), {
      status: 500,
    });
  }
}
