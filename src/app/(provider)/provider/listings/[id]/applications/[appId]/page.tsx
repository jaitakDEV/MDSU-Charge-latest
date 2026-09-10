import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import Link from "next/link";
import { ApplicantDetail } from "@/features/provider/components/ApplicantDetail";

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string; appId: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "JOB_PROVIDER")
    redirect(ROUTES.login);

  const { id, appId } = await params;

  const company = await db.companyProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!company) redirect(ROUTES.providerCompany);

  const application = await db.jobApplication.findUnique({
    where: { id: appId },
    select: {
      id: true,
      status: true,
      statusNote: true,
      createdAt: true,
      coverLetter: true,
      resumeUrl: true,
      portfolioUrl: true,
      expectedSalary: true,
      noticePeriod: true,
      availableFrom: true,
      screeningAnswers: true,
      isShortlisted: true,
      isStarred: true,
      companyNotes: true,
      interviewDate: true,
      interviewMode: true,
      interviewLink: true,
      listing: {
        select: {
          id: true,
          companyId: true,
          title: true,
          screeningQuestions: { select: { id: true, question: true } },
        },
      },
      profile: {
        select: {
          headline: true,
          summary: true,
          currentCity: true,
          currentState: true,
          skills: true,
          languages: true,
          user: {
            select: { name: true, email: true, phoneNumber: true, image: true },
          },
          education: { orderBy: { displayOrder: "asc" } },
          experience: { orderBy: { displayOrder: "asc" } },
          projects: { orderBy: { displayOrder: "asc" } },
          certifications: { orderBy: { displayOrder: "asc" } },
        },
      },
    },
  });

  if (!application) notFound();
  if (application.listing.companyId !== company.id)
    redirect(ROUTES.providerListings);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "760px",
      }}
    >
      <Link
        href={ROUTES.providerListingApps(id)}
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
        ← All Applicants
      </Link>
      <ApplicantDetail application={application} listingId={id} />
    </div>
  );
}
