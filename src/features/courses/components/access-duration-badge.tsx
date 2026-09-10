import {
  ACCESS_DURATION_LABELS,
  ACCESS_DURATION_SHORT,
} from "@/lib/access-utils";
import type { AccessDuration } from "@prisma/client";

type Variant = "full" | "short" | "card";

const DURATION_STYLE: Record<
  AccessDuration,
  { bg: string; color: string; border: string }
> = {
  FIFTEEN_DAYS: { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
  ONE_MONTH: { bg: "#f1f5f9", color: "#475569", border: "#e2e8f0" },
  THREE_MONTHS: { bg: "#f0fdf4", color: "#166534", border: "#bbf7d0" },
  SIX_MONTHS: { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  ONE_YEAR: { bg: "#faf5ff", color: "#6b21a8", border: "#e9d5ff" },
  LIFETIME: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" },
};

export function AccessDurationBadge({
  duration,
  variant = "card",
}: {
  duration: AccessDuration;
  variant?: Variant;
}) {
  const style = DURATION_STYLE[duration];
  const label =
    variant === "short"
      ? ACCESS_DURATION_SHORT[duration]
      : ACCESS_DURATION_LABELS[duration];

  const isLifetime = duration === "LIFETIME";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: variant === "card" ? "10.5px" : "12px",
        fontWeight: 700,
        padding: variant === "card" ? "2px 8px" : "4px 10px",
        borderRadius: "20px",
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        whiteSpace: "nowrap",
      }}
    >
      {isLifetime ? "∞ " : ""}
      {label}
    </span>
  );
}
