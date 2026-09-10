"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/config/app";
import { UploadField } from "@/features/cms/components/upload-field";

type EventFormData = {
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage: string;
  eventType: "UPCOMING" | "PAST";
  mode: "ONLINE" | "OFFLINE" | "HYBRID";
  status: "DRAFT" | "PUBLISHED" | "CANCELLED" | "ARCHIVED";
  isFeatured: boolean;
  venue: string;
  joinLink: string;
  startDate: string;
  endDate: string;
  timezone: string;
  capacity: string;
  waitlistEnabled: boolean;
  pricingType: "FREE" | "PAID";
  price: string;
  refundPolicy: string;
  cancellationDeadline: string;
  tags: string;
  metaTitle: string;
  metaDescription: string;
};

const INITIAL: EventFormData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  coverImage: "",
  eventType: "UPCOMING",
  mode: "OFFLINE",
  status: "DRAFT",
  isFeatured: false,
  venue: "",
  joinLink: "",
  startDate: "",
  endDate: "",
  timezone: "Asia/Kolkata",
  capacity: "",
  waitlistEnabled: false,
  pricingType: "FREE",
  price: "",
  refundPolicy: "",
  cancellationDeadline: "",
  tags: "",
  metaTitle: "",
  metaDescription: "",
};

const STATUS_BADGE: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#64748b" },
  PUBLISHED: { label: "Published", bg: "#f0fdf4", color: "#166534" },
  CANCELLED: { label: "Cancelled", bg: "#fef2f2", color: "#991b1b" },
  ARCHIVED: { label: "Archived", bg: "#f8fafc", color: "#64748b" },
};
function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Shared field wrapper ──────────────────────────────────────
function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
      <label
        style={{
          fontSize: "12.5px",
          fontWeight: 600,
          color: "#374151",
          display: "flex",
          gap: "4px",
        }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {hint && (
        <span
          style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "-2px" }}
        >
          {hint}
        </span>
      )}
      {children}
    </div>
  );
}

const inp: React.CSSProperties = {
  height: "40px",
  width: "100%",
  padding: "0 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13.5px",
  color: "#0f172a",
  background: "#fff",
  outline: "none",
};

const textarea: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e2e8f0",
  borderRadius: "10px",
  fontSize: "13.5px",
  color: "#0f172a",
  background: "#fff",
  outline: "none",
  resize: "vertical",
  lineHeight: 1.6,
};

const sectionCard: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e8edf2",
  borderRadius: "16px",
  padding: "1.5rem",
  marginBottom: "1rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

function SectionTitle({ text, desc }: { text: string; desc?: string }) {
  return (
    <div style={{ marginBottom: "1.1rem" }}>
      <p
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 3px",
          letterSpacing: "-0.2px",
        }}
      >
        {text}
      </p>
      {desc && (
        <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>{desc}</p>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
export function EventForm({
  eventId,
  initialData,
  isAdmin,
}: {
  eventId?: string;
  initialData?: Partial<EventFormData>;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const isEdit = !!eventId;

  const [form, setForm] = useState<EventFormData>({
    ...INITIAL,
    ...initialData,
  });
  const [tab, setTab] = useState<"details" | "seo">("details");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [statusActionLoading, setStatusActionLoading] = useState(false);

  // Auto-generate slug from title (create only)
  useEffect(() => {
    if (!isEdit && form.title) {
      setForm((p) => ({ ...p, slug: slugify(form.title) }));
    }
  }, [form.title, isEdit]);

  function update(key: keyof EventFormData, value: string | boolean) {
    setForm((p) => ({ ...p, [key]: value }));
    setError("");
    setSuccess("");
  }

  // ── Validation ────────────────────────────────────────────
  function validate(): string | null {
    if (!form.title.trim()) return "Title is required.";
    if (!form.startDate) return "Start date is required.";
    if (!form.eventType) return "Event type is required.";
    if (!form.mode) return "Event mode is required.";
    if (form.pricingType === "PAID" && (!form.price || Number(form.price) <= 0))
      return "Price is required for paid events.";
    if (
      (form.mode === "OFFLINE" || form.mode === "HYBRID") &&
      !form.venue.trim()
    )
      return "Venue is required for offline and hybrid events.";
    if (
      (form.mode === "ONLINE" || form.mode === "HYBRID") &&
      !form.joinLink.trim()
    )
      return "Join link is required for online and hybrid events.";
    return null;
  }

  // ── Save ──────────────────────────────────────────────────
  async function save(publishStatus?: "DRAFT" | "PUBLISHED") {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const body = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      description: form.description || undefined,
      content: form.content || undefined,
      coverImage: form.coverImage || undefined,
      eventType: form.eventType,
      mode: form.mode,
      status: publishStatus ?? form.status,
      isFeatured: form.isFeatured,
      venue: form.venue || undefined,
      joinLink: form.joinLink || undefined,
      startDate: new Date(form.startDate).toISOString(),
      endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      timezone: form.timezone,
      capacity: form.capacity ? Number(form.capacity) : undefined,
      waitlistEnabled: form.capacity ? form.waitlistEnabled : false,
      pricingType: form.pricingType,
      price:
        form.pricingType === "FREE" ? 0 : Math.round(Number(form.price) * 100),
      refundPolicy: form.refundPolicy || undefined,
      cancellationDeadline: form.cancellationDeadline
        ? new Date(form.cancellationDeadline).toISOString()
        : undefined,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
    };

    const res = await fetch(
      isEdit ? `/api/cms/events/${eventId}` : "/api/cms/events",
      {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const json = await res.json();
    setSaving(false);

    if (!json.success) {
      setError(json.error ?? "Failed to save.");
      return;
    }

    if (!isEdit) {
      router.push(ROUTES.cmsEvents + "?created=1");
      return;
    }
    setSuccess(
      publishStatus === "PUBLISHED" ? "Event published!" : "Changes saved.",
    );
    setTimeout(() => setSuccess(""), 3000);
    router.refresh();
  }

  async function handleCancelEvent() {
    setStatusActionLoading(true);
    setError("");
    const res = await fetch(`/api/cms/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    const json = await res.json();
    setStatusActionLoading(false);
    setShowCancelConfirm(false);
    if (!json.success) {
      setError(json.error ?? "Failed to cancel event.");
      return;
    }
    update("status", "CANCELLED");
    setSuccess("Event cancelled. Registrants have been notified via email.");
    setTimeout(() => setSuccess(""), 4000);
    router.refresh();
  }

  async function handleArchiveEvent() {
    setStatusActionLoading(true);
    setError("");
    const res = await fetch(`/api/cms/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "ARCHIVED" }),
    });
    const json = await res.json();
    setStatusActionLoading(false);
    if (!json.success) {
      setError(json.error ?? "Failed to archive event.");
      return;
    }
    update("status", "ARCHIVED");
    setSuccess("Event archived — hidden from public listings.");
    setTimeout(() => setSuccess(""), 3000);
    router.refresh();
  }

  async function handleRestoreDraft() {
    setStatusActionLoading(true);
    setError("");
    const res = await fetch(`/api/cms/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DRAFT" }),
    });
    const json = await res.json();
    setStatusActionLoading(false);
    if (!json.success) {
      setError(json.error ?? "Failed to restore event.");
      return;
    }
    update("status", "DRAFT");
    setSuccess("Event restored to draft.");
    setTimeout(() => setSuccess(""), 3000);
    router.refresh();
  }
  return (
    <div>
      {/* Tab switcher */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          marginBottom: "1.25rem",
          background: "#f8fafc",
          padding: "4px",
          borderRadius: "10px",
          border: "1px solid #e2e8f0",
          width: "fit-content",
        }}
      >
        {(["details", "seo"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              height: "30px",
              padding: "0 16px",
              border: tab === t ? "1px solid #bfdbfe" : "1px solid transparent",
              borderRadius: "8px",
              background: tab === t ? "#fff" : "transparent",
              color: tab === t ? "#1d4ed8" : "#64748b",
              fontSize: "12.5px",
              fontWeight: tab === t ? 600 : 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t === "details" ? "Event Details" : "SEO & Meta"}
          </button>
        ))}
      </div>

      {tab === "details" && (
        <>
          {/* ── Section 1: Basic Info ── */}
          <div style={sectionCard}>
            <SectionTitle text="Basic Information" />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Field label="Event Title" required>
                <input
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="e.g. Annual Tech Fest 2025"
                  style={{
                    ...inp,
                    fontSize: "16px",
                    height: "46px",
                    fontWeight: 600,
                  }}
                />
              </Field>

              <Field
                label="URL Slug"
                hint={`/events/${form.slug || "url-will-appear-here"}`}
              >
                <input
                  value={form.slug}
                  onChange={(e) => update("slug", slugify(e.target.value))}
                  style={inp}
                />
              </Field>

              <Field
                label="Cover Image"
                hint="Shown on event card and detail page — max 8MB"
              >
                <UploadField
                  label="Cover Image"
                  endpoint="eventCoverUploader"
                  fileType="image"
                  currentUrl={form.coverImage}
                  onUploadComplete={(url) => update("coverImage", url)}
                />
              </Field>

              <Field
                label="Short Description"
                hint="Shown on event cards — max 300 characters"
              >
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    update("description", e.target.value.slice(0, 300))
                  }
                  placeholder="Brief summary of the event"
                  style={{ ...textarea, minHeight: "80px" }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color:
                      form.description.length > 260 ? "#ef4444" : "#94a3b8",
                  }}
                >
                  {form.description.length}/300
                </span>
              </Field>

              <Field
                label="Full Content"
                hint="Full event details — agenda, speakers, schedule (HTML supported)"
              >
                <textarea
                  value={form.content}
                  onChange={(e) => update("content", e.target.value)}
                  placeholder="Write full event description, agenda, speaker information..."
                  style={{ ...textarea, minHeight: "180px" }}
                />
              </Field>
            </div>
          </div>

          {/* ── Section 2: Classification ── */}
          <div style={sectionCard}>
            <SectionTitle text="Event Classification" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1rem",
              }}
            >
              {/* <Field label="Event Type" required>
                <select
                  value={form.eventType}
                  onChange={(e) => update("eventType", e.target.value)}
                  style={inp}
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="PAST">Past</option>
                </select>
              </Field> */}

              <Field label="Mode" required>
                <select
                  value={form.mode}
                  onChange={(e) => update("mode", e.target.value)}
                  style={inp}
                >
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">In Person (Offline)</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </Field>

              {/* Venue — OFFLINE or HYBRID */}
              {(form.mode === "OFFLINE" || form.mode === "HYBRID") && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field
                    label="Venue / Address"
                    required
                    hint="Physical location where event will be held"
                  >
                    <input
                      value={form.venue}
                      onChange={(e) => update("venue", e.target.value)}
                      placeholder="e.g. MDSU Main Auditorium, Ajmer"
                      style={inp}
                    />
                  </Field>
                </div>
              )}

              {/* Join link — ONLINE or HYBRID */}
              {(form.mode === "ONLINE" || form.mode === "HYBRID") && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <Field
                    label="Join Link"
                    required
                    hint="Meeting URL — shown only to confirmed registrants"
                  >
                    <input
                      value={form.joinLink}
                      onChange={(e) => update("joinLink", e.target.value)}
                      placeholder="https://meet.google.com/..."
                      style={inp}
                    />
                    <div
                      style={{
                        padding: "8px 10px",
                        background: "#fefce8",
                        border: "1px solid #fde68a",
                        borderRadius: "8px",
                        fontSize: "11.5px",
                        color: "#92400e",
                      }}
                    >
                      🔒 This link is hidden from public — only shown after
                      confirmed registration
                    </div>
                  </Field>
                </div>
              )}

              <Field
                label="Tags"
                hint="Comma separated — e.g. tech, seminar, workshop"
              >
                <input
                  value={form.tags}
                  onChange={(e) => update("tags", e.target.value)}
                  placeholder="tech, seminar, 2025"
                  style={inp}
                />
              </Field>

              {isAdmin && (
                <Field
                  label="Featured Event"
                  hint="Pin to top of homepage events section"
                >
                  <div
                    onClick={() => update("isFeatured", !form.isFeatured)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      background: form.isFeatured ? "#fffbeb" : "#f8fafc",
                      border: `1.5px solid ${form.isFeatured ? "#fde68a" : "#e2e8f0"}`,
                      borderRadius: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "22px",
                        borderRadius: "11px",
                        background: form.isFeatured ? "#f59e0b" : "#e2e8f0",
                        position: "relative",
                        transition: "background 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "3px",
                          left: form.isFeatured ? "21px" : "3px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: "#fff",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                          transition: "left 0.2s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: form.isFeatured ? "#92400e" : "#64748b",
                      }}
                    >
                      {form.isFeatured
                        ? "★ Featured — appears on homepage"
                        : "Not featured"}
                    </span>
                  </div>
                </Field>
              )}
            </div>
          </div>

          {/* ── Section 3: Date & Time ── */}
          <div style={sectionCard}>
            <SectionTitle text="Date & Time" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "1rem",
              }}
            >
              <Field label="Start Date & Time" required>
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                  style={inp}
                />
              </Field>
              <Field label="End Date & Time" hint="Optional">
                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => update("endDate", e.target.value)}
                  style={inp}
                />
              </Field>
              <Field label="Timezone">
                <select
                  value={form.timezone}
                  onChange={(e) => update("timezone", e.target.value)}
                  style={inp}
                >
                  <option value="Asia/Kolkata">IST — Asia/Kolkata</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">EST — New York</option>
                  <option value="Europe/London">GMT — London</option>
                </select>
              </Field>
            </div>
          </div>

          {/* ── Section 4: Capacity ── */}
          <div style={sectionCard}>
            <SectionTitle text="Capacity & Registration" />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <Field
                label="Capacity"
                hint="Leave blank for unlimited registrations"
              >
                <input
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={(e) => update("capacity", e.target.value)}
                  placeholder="e.g. 100 (blank = unlimited)"
                  style={{ ...inp, width: "200px" }}
                />
              </Field>

              {/* Waitlist — only if capacity is set */}
              {form.capacity && (
                <Field
                  label="Enable Waitlist"
                  hint="When event is full, users can join a waitlist"
                >
                  <div
                    onClick={() =>
                      update("waitlistEnabled", !form.waitlistEnabled)
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      background: form.waitlistEnabled ? "#f0fdf4" : "#f8fafc",
                      border: `1.5px solid ${form.waitlistEnabled ? "#86efac" : "#e2e8f0"}`,
                      borderRadius: "10px",
                      cursor: "pointer",
                      width: "fit-content",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "22px",
                        borderRadius: "11px",
                        background: form.waitlistEnabled
                          ? "#16a34a"
                          : "#e2e8f0",
                        position: "relative",
                        transition: "background 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: "3px",
                          left: form.waitlistEnabled ? "21px" : "3px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: "#fff",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                          transition: "left 0.2s",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: form.waitlistEnabled ? "#166534" : "#64748b",
                      }}
                    >
                      {form.waitlistEnabled
                        ? "Waitlist enabled"
                        : "No waitlist"}
                    </span>
                  </div>
                </Field>
              )}
            </div>
          </div>

          {/* ── Section 5: Pricing ── */}
          <div style={sectionCard}>
            <SectionTitle text="Pricing" />
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Free / Paid toggle */}
              <Field label="Pricing Type" required>
                <div style={{ display: "flex", gap: "10px" }}>
                  {(["FREE", "PAID"] as const).map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => update("pricingType", pt)}
                      style={{
                        flex: 1,
                        padding: "12px 16px",
                        border: `2px solid ${form.pricingType === pt ? (pt === "FREE" ? "#86efac" : "#bfdbfe") : "#e2e8f0"}`,
                        borderRadius: "12px",
                        background:
                          form.pricingType === pt
                            ? pt === "FREE"
                              ? "#f0fdf4"
                              : "#eff6ff"
                            : "#fff",
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "16px",
                          fontWeight: 800,
                          color:
                            form.pricingType === pt
                              ? pt === "FREE"
                                ? "#16a34a"
                                : "#1d4ed8"
                              : "#94a3b8",
                          margin: "0 0 3px",
                        }}
                      >
                        {pt === "FREE" ? "Free" : "Paid"}
                      </p>
                      <p
                        style={{
                          fontSize: "11.5px",
                          color:
                            form.pricingType === pt
                              ? pt === "FREE"
                                ? "#16a34a"
                                : "#3b82f6"
                              : "#94a3b8",
                          margin: 0,
                        }}
                      >
                        {pt === "FREE"
                          ? "No payment required"
                          : "Razorpay checkout"}
                      </p>
                    </button>
                  ))}
                </div>
              </Field>

              {/* Price — only for PAID */}
              {form.pricingType === "PAID" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <Field label="Ticket Price (₹)" required>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: "13.5px",
                          color: "#64748b",
                          fontWeight: 600,
                        }}
                      >
                        ₹
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={form.price}
                        onChange={(e) => update("price", e.target.value)}
                        placeholder="499"
                        style={{ ...inp, paddingLeft: "28px" }}
                      />
                    </div>
                  </Field>

                  <Field
                    label="Cancellation Deadline"
                    hint="Last date for refund eligibility"
                  >
                    <input
                      type="datetime-local"
                      value={form.cancellationDeadline}
                      onChange={(e) =>
                        update("cancellationDeadline", e.target.value)
                      }
                      style={inp}
                    />
                  </Field>

                  <div style={{ gridColumn: "1 / -1" }}>
                    <Field
                      label="Refund Policy"
                      hint="Plain text — displayed on event detail page"
                    >
                      <textarea
                        value={form.refundPolicy}
                        onChange={(e) => update("refundPolicy", e.target.value)}
                        placeholder="e.g. Full refund if cancelled 48 hours before event. No refund after that."
                        style={{ ...textarea, minHeight: "80px" }}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 6: Status ── */}
          {/* <div style={sectionCard}>
            <SectionTitle text="Publishing" />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "8px",
              }}
            >
              {(["DRAFT", "PUBLISHED", "CANCELLED", "ARCHIVED"] as const).map(
                (s) => {
                  const labels: Record<string, string> = {
                    DRAFT: "Save as Draft",
                    PUBLISHED: "Publish Now",
                    CANCELLED: "Cancelled",
                    ARCHIVED: "Archive",
                  };
                  const colors: Record<
                    string,
                    { border: string; bg: string; color: string }
                  > = {
                    DRAFT: {
                      border: "#e2e8f0",
                      bg: "#f8fafc",
                      color: "#475569",
                    },
                    PUBLISHED: {
                      border: "#86efac",
                      bg: "#f0fdf4",
                      color: "#166534",
                    },
                    CANCELLED: {
                      border: "#fecaca",
                      bg: "#fef2f2",
                      color: "#991b1b",
                    },
                    ARCHIVED: {
                      border: "#e2e8f0",
                      bg: "#f8fafc",
                      color: "#64748b",
                    },
                  };
                  const c = colors[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => update("status", s)}
                      style={{
                        padding: "10px 12px",
                        border: `1.5px solid ${form.status === s ? c.border : "#e2e8f0"}`,
                        borderRadius: "10px",
                        background: form.status === s ? c.bg : "#fff",
                        color: form.status === s ? c.color : "#94a3b8",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      {labels[s]}
                    </button>
                  );
                },
              )}
            </div>
          </div> */}
          {/* ── Section 6: Status (read-only info) ── */}
          <div style={sectionCard}>
            <SectionTitle
              text="Publishing"
              desc="Use Save Draft or Save & Publish below to control visibility"
            />
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>
                Current status:
              </span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "20px",
                  background: STATUS_BADGE[form.status].bg,
                  color: STATUS_BADGE[form.status].color,
                }}
              >
                {STATUS_BADGE[form.status].label}
              </span>
            </div>
          </div>

          {/* ── Danger Zone — Cancel / Archive — immediate action, no Save needed ── */}
          {isEdit &&
            (form.status === "DRAFT" || form.status === "PUBLISHED") && (
              <div
                style={{
                  ...sectionCard,
                  border: "1px solid #fecaca",
                  background: "#fffbfb",
                }}
              >
                <SectionTitle
                  text="Cancel or Archive"
                  desc="These actions apply immediately and are separate from Save"
                />
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  {!showCancelConfirm ? (
                    <button
                      type="button"
                      onClick={() => setShowCancelConfirm(true)}
                      style={{
                        height: "38px",
                        padding: "0 16px",
                        border: "1px solid #fecaca",
                        borderRadius: "10px",
                        background: "#fef2f2",
                        color: "#dc2626",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Cancel Event
                    </button>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: "12.5px", color: "#dc2626" }}>
                        Registrants will be emailed that this event is
                        cancelled. Continue?
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelEvent}
                        disabled={statusActionLoading}
                        style={{
                          height: "34px",
                          padding: "0 14px",
                          border: "none",
                          borderRadius: "9px",
                          background: "#dc2626",
                          color: "#fff",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {statusActionLoading
                          ? "Cancelling…"
                          : "Yes, Cancel Event"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCancelConfirm(false)}
                        style={{
                          height: "34px",
                          padding: "0 14px",
                          border: "1px solid #e2e8f0",
                          borderRadius: "9px",
                          background: "#fff",
                          color: "#64748b",
                          fontSize: "12.5px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {!showCancelConfirm && (
                    <button
                      type="button"
                      onClick={handleArchiveEvent}
                      disabled={statusActionLoading}
                      style={{
                        height: "38px",
                        padding: "0 16px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "10px",
                        background: "#f8fafc",
                        color: "#64748b",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {statusActionLoading ? "…" : "Archive Event"}
                    </button>
                  )}
                </div>
              </div>
            )}


          {isEdit &&
            (form.status === "CANCELLED" || form.status === "ARCHIVED") && (
              <div style={sectionCard}>
                <SectionTitle
                  text="Restore Event"
                  desc="Bring this event back as a draft to edit and republish"
                />
                <button
                  type="button"
                  onClick={handleRestoreDraft}
                  disabled={statusActionLoading}
                  style={{
                    height: "38px",
                    padding: "0 16px",
                    border: "1px solid #bfdbfe",
                    borderRadius: "10px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {statusActionLoading ? "…" : "Restore to Draft"}
                </button>
              </div>
            )}
        </>
      )}

      {/* ── SEO Tab ── */}
      {tab === "seo" && (
        <div style={sectionCard}>
          <SectionTitle
            text="SEO & Meta"
            desc="Shown in search results and social sharing"
          />
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field label="Meta Title" hint="Defaults to event title if empty">
              <input
                value={form.metaTitle}
                onChange={(e) => update("metaTitle", e.target.value)}
                placeholder={form.title || "Event title"}
                style={inp}
              />
            </Field>
            <Field label="Meta Description" hint="Max 160 characters">
              <textarea
                value={form.metaDescription}
                onChange={(e) =>
                  update("metaDescription", e.target.value.slice(0, 160))
                }
                placeholder="Short description for search engines"
                style={{ ...textarea, minHeight: "80px" }}
              />
              <span
                style={{
                  fontSize: "11px",
                  color:
                    form.metaDescription.length > 140 ? "#ef4444" : "#94a3b8",
                }}
              >
                {form.metaDescription.length}/160
              </span>
            </Field>
          </div>
        </div>
      )}

      {/* Error / Success */}
      {error && (
        <div
          style={{
            padding: "10px 14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#dc2626",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            padding: "10px 14px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "10px",
            fontSize: "13px",
            color: "#166534",
            marginBottom: "1rem",
          }}
        >
          {success}
        </div>
      )}

      {/* Action buttons */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "flex-end",
          paddingBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => router.push(ROUTES.cmsEvents)}
          style={{
            height: "38px",
            padding: "0 16px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            background: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => save("DRAFT")}
          disabled={saving}
          style={{
            height: "38px",
            padding: "0 18px",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            background: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
          }}
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>
        <button
          onClick={() => save("PUBLISHED")}
          disabled={saving}
          style={{
            height: "38px",
            padding: "0 20px",
            border: "none",
            borderRadius: "10px",
            background: saving
              ? "#93c5fd"
              : "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(29,78,216,0.25)",
          }}
        >
          {saving
            ? "Publishing…"
            : isEdit
              ? "Save & Publish"
              : "Create & Publish"}
        </button>
      </div>
    </div>
  );
}
