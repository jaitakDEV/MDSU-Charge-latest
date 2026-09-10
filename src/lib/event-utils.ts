import type {
  EventStatus,
  PricingType,
  EventMode,
  RegistrationStatus,
} from "@prisma/client";

export type EventForUtils = {
  startDate: Date;
  endDate: Date | null;
  capacity: number | null;
  registeredCount: number;
  waitlistEnabled: boolean;
  waitlistCount: number;
  status: EventStatus;
  pricingType: PricingType;
  price: number;
};

export type RegistrationCTA =
  | "REGISTER_FREE"
  | "BUY_TICKET"
  | "ALREADY_REGISTERED"
  | "JOIN_WAITLIST"
  | "WAITLISTED"
  | "REGISTRATIONS_CLOSED"
  | "EVENT_PAST"
  | "EVENT_CANCELLED"
  | "EVENT_DRAFT";

export function isEventPast(startDate: Date): boolean {
  return startDate < new Date();
}

export function isEventOngoing(startDate: Date, endDate: Date | null): boolean {
  const now = new Date();
  if (startDate > now) return false;
  if (!endDate) return false;
  return endDate > now;
}

export function isEventFull(
  capacity: number | null,
  registeredCount: number,
): boolean {
  if (capacity === null) return false;
  return registeredCount >= capacity;
}

export function getSpotsRemaining(
  capacity: number | null,
  registeredCount: number,
): number | null {
  if (capacity === null) return null;
  return Math.max(0, capacity - registeredCount);
}

export function getCapacityPercent(
  capacity: number | null,
  registeredCount: number,
): number {
  if (!capacity || capacity === 0) return 0;
  return Math.min(100, Math.round((registeredCount / capacity) * 100));
}

export function getRegistrationCTA({
  event,
  isRegistered,
  isWaitlisted,
}: {
  event: EventForUtils;
  isRegistered: boolean;
  isWaitlisted: boolean;
}): RegistrationCTA {
  if (event.status === "CANCELLED") return "EVENT_CANCELLED";
  if (event.status === "DRAFT") return "EVENT_DRAFT";
  if (event.status === "ARCHIVED") return "EVENT_PAST";

  if (isEventPast(event.startDate)) return "EVENT_PAST";

  if (isRegistered) return "ALREADY_REGISTERED";

  if (isWaitlisted) return "WAITLISTED";

  if (isEventFull(event.capacity, event.registeredCount)) {
    return event.waitlistEnabled ? "JOIN_WAITLIST" : "REGISTRATIONS_CLOSED";
  }

  return event.pricingType === "FREE" ? "REGISTER_FREE" : "BUY_TICKET";
}

export function formatEventDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatEventTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatEventDateTime(
  date: Date,
  timezone = "Asia/Kolkata",
): string {
  const datePart = formatEventDate(date);
  const timePart = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone,
  });
  const tzAbbr = timezone === "Asia/Kolkata" ? "IST" : timezone;
  return `${datePart} · ${timePart} ${tzAbbr}`;
}

export function formatEventDuration(
  startDate: Date,
  endDate: Date | null,
): string | null {
  if (!endDate) return null;

  const ms = endDate.getTime() - startDate.getTime();
  const minutes = Math.floor(ms / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const remMins = minutes % 60;
  const remHrs = hours % 24;

  if (days > 0)
    return remHrs > 0
      ? `${days}d ${remHrs}h`
      : `${days} day${days > 1 ? "s" : ""}`;
  if (hours > 0)
    return remMins > 0
      ? `${hours}h ${remMins}m`
      : `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${minutes} minutes`;
}

export function getEventTimeStatus(
  startDate: Date,
  endDate: Date | null,
): string {
  const now = new Date();
  const diffStart = startDate.getTime() - now.getTime();
  const diffDays = Math.ceil(Math.abs(diffStart) / 86400000);

  if (isEventOngoing(startDate, endDate)) return "Ongoing now";

  if (diffStart > 0) {
    if (diffDays === 0) return "Starts today";
    if (diffDays === 1) return "Starts tomorrow";
    if (diffDays < 7) return `Starts in ${diffDays} days`;
    if (diffDays < 30)
      return `Starts in ${Math.ceil(diffDays / 7)} week${diffDays > 13 ? "s" : ""}`;
    return `Starts ${formatEventDate(startDate)}`;
  }

  // Past
  if (diffDays === 0) return "Ended today";
  if (diffDays === 1) return "Ended yesterday";
  if (diffDays < 7) return `Ended ${diffDays} days ago`;
  return `Ended ${formatEventDate(startDate)}`;
}

export function formatEventPrice(
  pricingType: PricingType,
  price: number,
): string {
  if (pricingType === "FREE") return "Free";
  return `₹${(price / 100).toLocaleString("en-IN")}`;
}

export const EVENT_MODE_LABELS: Record<EventMode, string> = {
  ONLINE: "Online",
  OFFLINE: "In Person",
  HYBRID: "Hybrid",
};

export const EVENT_MODE_COLORS: Record<
  EventMode,
  { bg: string; color: string }
> = {
  ONLINE: { bg: "#eff6ff", color: "#1d4ed8" },
  OFFLINE: { bg: "#f0fdf4", color: "#166534" },
  HYBRID: { bg: "#faf5ff", color: "#6b21a8" },
};

export const EVENT_STATUS_CONFIG: Record<
  EventStatus,
  {
    label: string;
    bg: string;
    color: string;
    dot: string;
  }
> = {
  DRAFT: { label: "Draft", bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  PUBLISHED: {
    label: "Published",
    bg: "#f0fdf4",
    color: "#166534",
    dot: "#16a34a",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "#fef2f2",
    color: "#991b1b",
    dot: "#ef4444",
  },
  ARCHIVED: {
    label: "Archived",
    bg: "#f8fafc",
    color: "#64748b",
    dot: "#cbd5e1",
  },
};

export const REGISTRATION_STATUS_CONFIG: Record<
  RegistrationStatus,
  {
    label: string;
    bg: string;
    color: string;
  }
> = {
  PENDING: { label: "Pending", bg: "#fefce8", color: "#854d0e" },
  CONFIRMED: { label: "Confirmed", bg: "#f0fdf4", color: "#166534" },
  CANCELLED: { label: "Cancelled", bg: "#fef2f2", color: "#991b1b" },
  REFUNDED: { label: "Refunded", bg: "#faf5ff", color: "#6b21a8" },
};
