import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { getOrCreateCareerProfile } from "@/lib/career-utils";
import { CareerProfileForm } from "@/features/career/components/CareerProfileForm";
import { RepeatableSection } from "@/features/career/components/RepeatableSection";

export const metadata = { title: "Edit Career Profile — MDSSC" };

export default async function CareerEditPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  await getOrCreateCareerProfile(session.user.id);

  const profile = await db.studentCareerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      education: { orderBy: { displayOrder: "asc" } },
      experience: { orderBy: { displayOrder: "asc" } },
      projects: { orderBy: { displayOrder: "asc" } },
      certifications: { orderBy: { displayOrder: "asc" } },
    },
  });

  if (!profile) redirect(ROUTES.career);

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
          Edit Career Profile
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Complete your profile to attract recruiters
        </p>
      </div>

      <CareerProfileForm initial={profile} />

      <div style={{ marginTop: "1rem" }}>
        <RepeatableSection
          title="Education"
          endpoint="education"
          type="education"
          items={profile.education}
          fields={[
            {
              key: "degree",
              label: "Degree",
              type: "text",
              placeholder: "B.Tech",
            },
            {
              key: "fieldOfStudy",
              label: "Field of Study",
              type: "text",
              placeholder: "Computer Science",
            },
            { key: "institution", label: "Institution", type: "text" },
            { key: "startYear", label: "Start Year", type: "number" },
            { key: "endYear", label: "End Year", type: "number" },
            { key: "cgpa", label: "CGPA", type: "number" },
          ]}
        />
        <RepeatableSection
          title="Experience"
          endpoint="experience"
          type="experience"
          items={profile.experience}
          fields={[
            { key: "title", label: "Job Title", type: "text" },
            { key: "company", label: "Company", type: "text" },
            {
              key: "employmentType",
              label: "Type",
              type: "text",
              placeholder: "Internship",
            },
            { key: "startDate", label: "Start Date", type: "date" },
            { key: "endDate", label: "End Date", type: "date" },
            { key: "description", label: "Description", type: "textarea" },
          ]}
        />
        <RepeatableSection
          title="Projects"
          endpoint="projects"
          type="projects"
          items={profile.projects}
          fields={[
            { key: "title", label: "Project Title", type: "text" },
            { key: "description", label: "Description", type: "textarea" },
            {
              key: "technologies",
              label: "Technologies (comma separated)",
              type: "text",
            },
            { key: "liveUrl", label: "Live URL", type: "text" },
            { key: "repoUrl", label: "Repo URL", type: "text" },
          ]}
        />
        <RepeatableSection
          title="Certifications"
          endpoint="certifications"
          type="certifications"
          items={profile.certifications}
          fields={[
            { key: "name", label: "Certificate Name", type: "text" },
            { key: "issuingOrg", label: "Issuing Organization", type: "text" },
            { key: "issueDate", label: "Issue Date", type: "date" },
            { key: "credentialUrl", label: "Credential URL", type: "text" },
          ]}
        />
      </div>
    </div>
  );
}
