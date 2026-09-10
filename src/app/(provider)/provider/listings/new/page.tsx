import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/app";
import { ListingForm } from "@/features/provider/components/ListingForm";

export const metadata = { title: "New Listing — Provider" };

export default async function NewListingPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "JOB_PROVIDER")
    redirect(ROUTES.login);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        maxWidth: "760px",
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
          Create Listing
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
          Fill in the details — you can save as draft and submit later
        </p>
      </div>
      <ListingForm />
    </div>
  );
}
