// import { auth } from "@/server/auth";
// import { redirect } from "next/navigation";
// import { ROUTES } from "@/config/app";
// import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
// import { AdminTopbar } from "@/features/admin/components/admin-topbar";
// import type { SessionUser } from "@/types";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const session = await auth();

//   if (!session?.user) redirect(ROUTES.login);
//   if (session.user.role !== "ADMIN") redirect(ROUTES.dashboard);

//   const user = {
//     ...session.user,
//     email: session.user.email ?? "",
//   } satisfies SessionUser;

//   return (
//     <div style={{ display: "flex", minHeight: "100vh", background: "#F5F9FE" }}>
//       <AdminSidebar />
//       <div
//         style={{
//           flex: "1 1 0%",
//           display: "flex",
//           flexDirection: "column",
//           minWidth: 0,
//         }}
//       >
//         <AdminTopbar user={user} />
//         <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
//       </div>
//     </div>
//   );
// }

import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/app";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminTopbar } from "@/features/admin/components/admin-topbar";
import type { SessionUser } from "@/types";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) redirect(ROUTES.login);
  if (session.user.role !== "ADMIN") redirect(ROUTES.dashboard);

  const user = {
    ...session.user,
    email: session.user.email ?? "",
  } satisfies SessionUser;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F9FE" }}>
      <AdminSidebar />

      <div
        style={{
          marginLeft: "232px",
          width: "calc(100% - 232px)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0,
        }}
      >
        <AdminTopbar user={user} />
        <main style={{ flex: 1, padding: "2rem" }}>{children}</main>
      </div>
    </div>
  );
}
