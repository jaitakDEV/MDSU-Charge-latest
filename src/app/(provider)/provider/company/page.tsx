import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { CompanyProfileForm } from "@/features/provider/components/CompanyProfileForm";

export const metadata = { title: "Company Profile — Provider" };

export default async function ProviderCompanyPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const company = await db.companyProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!company) redirect(ROUTES.login);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "700px",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Company Profile
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Manage your company information visible to students
        </p>
      </div>
      <CompanyProfileForm
        initialData={{
          companyName: company.companyName,
          companyType: company.companyType,
          industry: company.industry,
          website: company.website ?? "",
          logoUrl: company.logoUrl ?? "",
          description: company.description ?? "",
          companySize: company.companySize,
          headquarters: company.headquarters,
          city: company.city,
          state: company.state,
          contactPerson: company.contactPerson,
          contactPhone: company.contactPhone,
          designation: company.designation,
          linkedinUrl: company.linkedinUrl ?? "",
          glassdoorUrl: company.glassdoorUrl ?? "",
        }}
        approvalStatus={company.approvalStatus}
      />
    </div>
  );
}
