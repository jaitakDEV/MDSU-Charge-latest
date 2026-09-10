import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { PreferencesForm } from "@/features/career/components/PreferencesForm";

export const metadata = { title: "Job Preferences — MDSSC" };

export default async function PreferencesPage() {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);

  const profile = await db.studentCareerProfile.findUnique({
    where: { userId: session.user.id },
    include: { jobPreferences: true },
  });

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "600px",
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
          Job Preferences
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Set your preferences and get alerted about matching jobs
        </p>
      </div>
      <PreferencesForm initial={profile?.jobPreferences} />
    </div>
  );
}
