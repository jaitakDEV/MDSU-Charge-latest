import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { CmsSidebar } from "@/features/cms/components/cms-sidebar";
import { CmsTopbar } from "@/features/cms/components/cms-topbar";

export default async function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect(ROUTES.login);
  if (session.user.role !== "CMS_EDITOR") redirect(ROUTES.dashboard);
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
      <CmsSidebar />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <CmsTopbar user={user} />
        <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
      </div>
    </div>
  );
}
