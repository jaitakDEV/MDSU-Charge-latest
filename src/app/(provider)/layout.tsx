import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { ProviderSidebar } from "@/features/provider/components/ProviderSidebar";
import { ProviderTopbar } from "@/features/provider/components/ProviderTopbar";

export default async function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect(ROUTES.login);
  if (session.user.role !== "JOB_PROVIDER") redirect(ROUTES.dashboard);
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

  if (!user) redirect(ROUTES.login);

  if (!user.isActive) redirect(ROUTES.providerPending);

  const company = await db.companyProfile.findUnique({
    where: { userId: user.id },
    select: { companyName: true, logoUrl: true, approvalStatus: true },
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <ProviderSidebar
        companyName={company?.companyName ?? "Company"}
        logoUrl={company?.logoUrl ?? null}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <ProviderTopbar
          user={user}
          companyName={company?.companyName ?? "Company"}
        />
        <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
      </div>
    </div>
  );
}
