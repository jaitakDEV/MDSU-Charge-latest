import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/app";
import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/components/dashboard-topbar";
import type { SessionUser } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect(ROUTES.login);
  if (!session.user.emailVerified) redirect(ROUTES.login + "?error=unverified");

  const user = {
    ...session.user,
    email: session.user.email ?? "",
  } satisfies SessionUser;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F9FE" }}>
      <DashboardSidebar user={user} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <DashboardTopbar user={user} />
        <main
          style={{
            flex: 1,
            padding: "2rem",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
