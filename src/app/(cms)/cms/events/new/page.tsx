import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { db } from "@/server/db";
import { ROUTES } from "@/config/app";
import { EventForm } from "@/features/cms/components/events/event-form";

export const metadata = { title: "New Event — CMS" };

export default async function NewEventPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "CMS_EDITOR" && session.user.role !== "ADMIN")
  )
    redirect(ROUTES.login);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "760px",
      }}
    >
      <div style={{ marginBottom: "1.75rem" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0f172a",
            margin: "0 0 4px",
            letterSpacing: "-0.4px",
          }}
        >
          Create New Event
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Fill in event details. You can save as draft and publish later.
        </p>
      </div>
      <EventForm isAdmin={session.user.role === "ADMIN"} />
    </div>
  );
}
