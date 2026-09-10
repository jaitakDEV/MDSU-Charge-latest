import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { ListingForm } from "@/features/provider/components/ListingForm";

export const metadata = { title: "Edit Listing — Provider" };

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "JOB_PROVIDER")
    redirect(ROUTES.login);

  const { id } = await params;

  const company = await db.companyProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!company) redirect(ROUTES.providerCompany);

  const listing = await db.jobListing.findFirst({
    where: { id, companyId: company.id },
  });

  if (!listing) notFound();

  function toDateInput(date: Date | null): string {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  }
  function toDateTimeInput(date: Date | null): string {
    if (!date) return "";
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  const initialData = {
    title: listing.title,
    opportunityType: listing.opportunityType,
    description: listing.description,
    responsibilities: listing.responsibilities.join("\n"),
    requirements: listing.requirements.join("\n"),
    skills: listing.skills.join(", "),
    workMode: listing.workMode,
    location: listing.location ?? "",
    state: listing.state ?? "",
    compensationType: listing.compensationType,
    salaryMin: listing.salaryMin?.toString() ?? "",
    salaryMax: listing.salaryMax?.toString() ?? "",
    stipendMin: listing.stipendMin?.toString() ?? "",
    stipendMax: listing.stipendMax?.toString() ?? "",
    projectBudget: listing.projectBudget?.toString() ?? "",
    isSalaryDisclosed: listing.isSalaryDisclosed,
    durationType: listing.durationType,
    durationValue: listing.durationValue?.toString() ?? "",
    durationUnit: listing.durationUnit ?? "MONTHS",
    startDate: toDateInput(listing.startDate),
    endDate: toDateInput(listing.endDate),
    walkInDate: toDateTimeInput(listing.walkInDate),
    walkInTime: listing.walkInTime ?? "",
    walkInVenue: listing.walkInVenue ?? "",
    targetColleges: listing.targetColleges.join(", "),
    targetBatchYears: listing.targetBatchYears.join(", "),
    certificateOffered: listing.certificateOffered,
    ppoOffered: listing.ppoOffered,
    minCgpa: listing.minCgpa?.toString() ?? "",
    educationLevel: listing.educationLevel ?? "ANY",
    educationStream: listing.educationStream ?? "",
    minExperienceYears: listing.minExperienceYears.toString(),
    maxExperienceYears: listing.maxExperienceYears?.toString() ?? "",
    genderPreference: listing.genderPreference,
    openings: listing.openings.toString(),
    applicationDeadline: toDateTimeInput(listing.applicationDeadline),
    tags: listing.tags.join(", "),
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "760px",
      }}
    >
      <Link
        href={ROUTES.providerListings}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          fontSize: "12.5px",
          color: "#64748b",
          textDecoration: "none",
          marginBottom: "1rem",
        }}
      >
        ← My Listings
      </Link>

      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Edit Listing
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          {listing.title}
        </p>
      </div>

      {listing.approvalStatus === "REVISION_NEEDED" &&
        listing.rejectedReason && (
          <div
            style={{
              padding: "12px 16px",
              background: "#fff7ed",
              border: "1px solid #fed7aa",
              borderRadius: "12px",
              marginBottom: "1.5rem",
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: "#9a3412",
                margin: "0 0 4px",
              }}
            >
              Revision Requested
            </p>
            <p style={{ fontSize: "13px", color: "#c2410c", margin: 0 }}>
              {listing.rejectedReason}
            </p>
          </div>
        )}

      <ListingForm listingId={listing.id} initialData={initialData} />
    </div>
  );
}
