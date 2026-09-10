import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { FacultySidebar } from "@/features/faculty/components/faculty-sidebar";
import { FacultyTopbar } from "@/features/faculty/components/faculty-topbar";

export default async function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect(ROUTES.login);
  if (session.user.role !== "FACULTY") redirect(ROUTES.dashboard);
  if (!session.user.emailVerified) redirect(ROUTES.login + "?error=unverified");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      isActive: true,
      college: { select: { name: true, city: true } },
    },
  });

  if (!user || !user.isActive) {
    redirect(ROUTES.login + "?error=deactivated");
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-background-tertiary)",
      }}
    >
      <FacultySidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <FacultyTopbar user={user} />
        <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
      </div>
    </div>
  );
}
