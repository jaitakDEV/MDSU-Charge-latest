import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { sendCompanyApprovedEmail } from "@/server/email";

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;
    if (guard.role !== "CMS_EDITOR" && guard.role !== "ADMIN")
      return NextResponse.json(apiError("Forbidden"), { status: 403 });

    const { id } = await params;

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
      return NextResponse.json(apiError("This company is already approved."), {
        status: 400,
      });
    }

    // ── Approve company + activate user account (transaction) ──
    await db.$transaction(async (tx) => {
      await tx.companyProfile.update({
        where: { id },
        data: {
          approvalStatus: "APPROVED",
          approvedById: guard.userId,
          approvedAt: new Date(),
          rejectedReason: null,
        },
      });

      await tx.user.update({
        where: { id: company.userId },
        data: { isActive: true },
      });
    });

    try {
      await sendCompanyApprovedEmail({
        email: company.contactEmail,
        contactPerson: company.contactPerson,
        companyName: company.companyName,
      });
    } catch (emailError) {
      console.error("[COMPANY_APPROVE_EMAIL_FAILED]", emailError);
    }

    return NextResponse.json(apiSuccess(null));
  } catch (error) {
    console.error("[CMS_COMPANY_APPROVE]", error);
    return NextResponse.json(apiError("Failed to approve company."), {
      status: 500,
    });
  }
}
