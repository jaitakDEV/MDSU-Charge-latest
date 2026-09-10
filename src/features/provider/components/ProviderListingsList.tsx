"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/config/app";
import { OPPORTUNITY_TYPE_LABELS } from "@/lib/job-utils";

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string; dot: string }
> = {
  DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  SUBMITTED: {
    label: "In Review",
    bg: "#fefce8",
    color: "#854d0e",
    dot: "#eab308",
  },
  PUBLISHED: {
    label: "Published",
    bg: "#f0fdf4",
    color: "#166534",
    dot: "#16a34a",
  },
  CLOSED: { label: "Closed", bg: "#fef2f2", color: "#991b1b", dot: "#ef4444" },
  ARCHIVED: {
    label: "Archived",
    bg: "#f8fafc",
    color: "#64748b",
    dot: "#cbd5e1",
  },
};

type Listing = {
  id: string;
  title: string;
  slug: string;
  opportunityType: string;
  workMode: string;
  status: string;
  approvalStatus: string;
  applicationDeadline: Date | null;
  applicationCount: number;
  openings: number;
  isFeatured: boolean;
  updatedAt: Date;
};

export function ProviderListingsList({
  listings,
  currentFilter,
  countMap,
}: {
  listings: Listing[];
  currentFilter: string;
  countMap: Record<string, number>;
}) {
  const router = useRouter();
  const [processing, setProcessing] = useState<string | null>(null);

  async function handleClose(id: string) {
    if (!confirm("Close this listing? No more applications will be accepted."))
      return;
    setProcessing(id);
    await fetch(`/api/provider/listings/${id}/close`, { method: "PATCH" });
    setProcessing(null);
    router.refresh();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete draft "${title}"? This cannot be undone.`)) return;
    setProcessing(id);
    const res = await fetch(`/api/provider/listings/${id}`, {
      method: "DELETE",
    });
    const json = await res.json();
    setProcessing(null);
    if (!json.success) {
      alert(json.error);
      return;
    }
    router.refresh();
  }

  const tabs = [
    {
      key: "ALL",
      label: "All",
      count: Object.values(countMap).reduce((a, b) => a + b, 0),
    },
    { key: "PUBLISHED", label: "Published", count: countMap.PUBLISHED ?? 0 },
    { key: "SUBMITTED", label: "In Review", count: countMap.SUBMITTED ?? 0 },
    { key: "DRAFT", label: "Drafts", count: countMap.DRAFT ?? 0 },
    { key: "CLOSED", label: "Closed", count: countMap.CLOSED ?? 0 },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.25rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
          flexWrap: "wrap",
        }}
      >
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.key;
          return (
            <Link
              key={tab.key}
              href={`${ROUTES.providerListings}?status=${tab.key}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "9px",
                fontSize: "12.5px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#1d4ed8" : "#64748b",
                background: isActive ? "#fff" : "transparent",
                textDecoration: "none",
                border: isActive
                  ? "1px solid #bfdbfe"
                  : "1px solid transparent",
              }}
            >
              {tab.label}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: "20px",
                  background: isActive ? "#dbeafe" : "#e2e8f0",
                  color: isActive ? "#1d4ed8" : "#64748b",
                }}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {listings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            background: "#fff",
            border: "1px dashed #bfdbfe",
            borderRadius: "16px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 6px",
            }}
          >
            No listings found
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              margin: "0 0 1.25rem",
            }}
          >
            Create your first job listing to start hiring
          </p>
          <Link
            href={ROUTES.providerListingsNew}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              height: "36px",
              padding: "0 16px",
              borderRadius: "9px",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            + New Listing
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {listings.map((listing) => {
            const cfg = STATUS_CONFIG[listing.status];
            return (
              <div
                key={listing.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e8edf2",
                  borderRadius: "14px",
                  padding: "1rem 1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: "20px",
                        background: cfg.bg,
                        color: cfg.color,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: cfg.dot,
                        }}
                      />
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: "10.5px", color: "#64748b" }}>
                      {OPPORTUNITY_TYPE_LABELS[listing.opportunityType]}
                    </span>
                    {listing.approvalStatus === "REVISION_NEEDED" && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: "20px",
                          background: "#fff7ed",
                          color: "#9a3412",
                        }}
                      >
                        Revision needed
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#0f172a",
                      margin: "0 0 3px",
                    }}
                  >
                    {listing.title}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      fontSize: "11.5px",
                      color: "#94a3b8",
                    }}
                  >
                    <span>{listing.applicationCount} applicants</span>
                    <span>· {listing.openings} openings</span>
                    {listing.applicationDeadline && (
                      <span>
                        · Deadline{" "}
                        {new Date(
                          listing.applicationDeadline,
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  {listing.status === "PUBLISHED" && (
                    <Link
                      href={ROUTES.providerListingApps(listing.id)}
                      style={{
                        height: "32px",
                        padding: "0 12px",
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #bfdbfe",
                        borderRadius: "8px",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Applicants
                    </Link>
                  )}
                  {(listing.status === "DRAFT" ||
                    listing.status === "PUBLISHED") && (
                    <Link
                      href={ROUTES.providerListingEdit(listing.id)}
                      style={{
                        height: "32px",
                        padding: "0 12px",
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        background: "#fff",
                        color: "#475569",
                        fontSize: "12px",
                        fontWeight: 600,
                        textDecoration: "none",
                      }}
                    >
                      Edit
                    </Link>
                  )}
                  {listing.status === "PUBLISHED" && (
                    <button
                      onClick={() => handleClose(listing.id)}
                      disabled={processing === listing.id}
                      style={{
                        height: "32px",
                        padding: "0 12px",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {processing === listing.id ? "…" : "Close"}
                    </button>
                  )}
                  {listing.status === "DRAFT" && (
                    <button
                      onClick={() => handleDelete(listing.id, listing.title)}
                      disabled={processing === listing.id}
                      style={{
                        height: "32px",
                        padding: "0 12px",
                        border: "1px solid #fecaca",
                        borderRadius: "8px",
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {processing === listing.id ? "…" : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
