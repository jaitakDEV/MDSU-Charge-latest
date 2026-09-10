import { auth } from "@/server/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { CheckinScanner } from "@/features/cms/components/events/checkin-scanner";

export const metadata = { title: "Check-in Scanner — CMS" };

export default async function CheckinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  const { id } = await params;

  const event = await db.event.findUnique({
    where: { id },
    select: { id: true, title: true, authorId: true },
  });

  if (!event) notFound();
  if (
    session.user.role === "CMS_EDITOR" &&
    event.authorId !== session.user.id
  ) {
    redirect(ROUTES.cmsEvents);
  }

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
          }}
        >
          Check-in Scanner
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          {event.title}
        </p>
      </div>
      <CheckinScanner />
    </div>
  );
}
