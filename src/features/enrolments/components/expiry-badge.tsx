import {
  getAccessStatus,
  getDaysRemaining,
  formatExpiryDate,
} from "@/lib/access-utils";

type AccessStatus = "LIFETIME" | "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";

const STATUS_STYLE: Record<
  AccessStatus,
  { bg: string; color: string; border: string; dot: string }
> = {
  LIFETIME: {
    bg: "#fffbeb",
    color: "#92400e",
    border: "#fde68a",
    dot: "#f59e0b",
  },
  ACTIVE: {
    bg: "#f0fdf4",
    color: "#166534",
    border: "#bbf7d0",
    dot: "#16a34a",
  },
  EXPIRING_SOON: {
    bg: "#fefce8",
    color: "#854d0e",
    border: "#fde68a",
    dot: "#eab308",
  },
  EXPIRED: {
    bg: "#fef2f2",
    color: "#991b1b",
    border: "#fecaca",
    dot: "#ef4444",
  },
};

const STATUS_LABEL: Record<AccessStatus, string> = {
  LIFETIME: "∞ Lifetime",
  ACTIVE: "Active",
  EXPIRING_SOON: "Expiring Soon",
  EXPIRED: "Expired",
};

type Size = "sm" | "md";

export function ExpiryBadge({
  accessExpiresAt,
  size = "sm",
  showDate = false,
}: {
  accessExpiresAt: Date | null;
  size?: Size;
  showDate?: boolean;
}) {
  const status = getAccessStatus(accessExpiresAt);
  const days = getDaysRemaining(accessExpiresAt);
  const style = STATUS_STYLE[status];

  const label =
    status === "EXPIRING_SOON" && days !== null
      ? `Expires in ${days}d`
      : STATUS_LABEL[status];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          fontSize: size === "sm" ? "10.5px" : "12px",
          fontWeight: 700,
          padding: size === "sm" ? "2px 8px" : "4px 12px",
          borderRadius: "20px",
          background: style.bg,
          color: style.color,
          border: `1px solid ${style.border}`,
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: style.dot,
            flexShrink: 0,
          }}
        />
        {label}
      </span>

      {showDate && accessExpiresAt && status !== "LIFETIME" && (
        <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
          {formatExpiryDate(accessExpiresAt)}
        </span>
      )}
    </div>
  );
}
