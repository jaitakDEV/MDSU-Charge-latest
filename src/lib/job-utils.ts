import type {
  OpportunityType,
  WorkMode,
  CompensationType,
} from "@prisma/client";

export function isEventExpired(deadline: Date | null): boolean {
  if (!deadline) return false;
  return deadline < new Date();
}

export function formatSalary(min: number | null, max: number | null): string {
  if (!min && !max) return "Not disclosed";
  const fmt = (n: number) => `₹${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

export function getApplicationStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    APPLIED: "Applied",
    UNDER_REVIEW: "Under Review",
    SHORTLISTED: "Shortlisted",
    INTERVIEW_SCHEDULED: "Interview Scheduled",
    INTERVIEWED: "Interviewed",
    OFFERED: "Offered",
    OFFER_ACCEPTED: "Offer Accepted",
    OFFER_REJECTED: "Offer Declined",
    REJECTED: "Not Selected",
    WITHDRAWN: "Withdrawn",
  };
  return labels[status] ?? status;
}

export function validateListingFields(d: {
  title: string;
  description: string;
  skills: string[];
  openings: number;
  opportunityType: OpportunityType;
  workMode: WorkMode;
  compensationType: CompensationType;
  salaryMin?: number | null;
  salaryMax?: number | null;
  stipendMin?: number | null;
  stipendMax?: number | null;
  venue?: string | null;
  applicationDeadline?: Date | null;
  startDate?: Date | null;
  endDate?: Date | null;
  walkInDate?: Date | null;
  targetColleges?: string[];
}): string | null {
  if (d.title.trim().length < 5) return "Title must be at least 5 characters.";
  if (d.title.length > 100) return "Title must be under 100 characters.";
  if (d.description.trim().length < 100)
    return "Description must be at least 100 characters.";
  if (d.description.length > 5000)
    return "Description must be under 5000 characters.";
  if (d.skills.length < 1) return "Add at least 1 skill.";
  if (d.skills.length > 20) return "Maximum 20 skills allowed.";
  if (d.openings < 1 || d.openings > 500)
    return "Openings must be between 1 and 500.";

  if (d.salaryMin && d.salaryMax && d.salaryMin > d.salaryMax)
    return "Minimum salary cannot exceed maximum salary.";
  if (d.stipendMin && d.stipendMax && d.stipendMin > d.stipendMax)
    return "Minimum stipend cannot exceed maximum stipend.";

  if (d.applicationDeadline && d.applicationDeadline < new Date())
    return "Application deadline must be in the future.";

  if (d.startDate && d.endDate && d.endDate < d.startDate)
    return "End date must be on or after start date.";

  if (d.opportunityType === "WALK_IN_DRIVE") {
    if (!d.walkInDate) return "Walk-in date is required for walk-in drives.";
    if (d.walkInDate < new Date()) return "Walk-in date must be in the future.";
  }

  if ((d.workMode === "ONSITE" || d.workMode === "HYBRID") && !d.venue)
    return "Venue is required for onsite and hybrid opportunities.";

  if (
    d.opportunityType === "CAMPUS_HIRING" &&
    (!d.targetColleges || d.targetColleges.length === 0)
  )
    return "Target colleges are required for campus hiring.";

  if (d.compensationType === "PAID") {
    const hasComp = d.salaryMin || d.salaryMax || d.stipendMin || d.stipendMax;
    if (!hasComp)
      return "Salary or stipend is required when compensation type is Paid.";
  }

  return null;
}

export const OPPORTUNITY_TYPE_LABELS: Record<string, string> = {
  FULL_TIME_JOB: "Full-time Job",
  INTERNSHIP: "Internship",
  APPRENTICESHIP: "Apprenticeship",
  FREELANCE: "Freelance",
  WALK_IN_DRIVE: "Walk-in Drive",
  CAMPUS_HIRING: "Campus Hiring",
  PART_TIME: "Part-time",
};

export const LISTING_STATUS_CONFIG: Record<
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

export const APPROVAL_STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  PENDING_REVIEW: { label: "Pending Review", bg: "#fefce8", color: "#854d0e" },
  APPROVED: { label: "Approved", bg: "#f0fdf4", color: "#166534" },
  REJECTED: { label: "Rejected", bg: "#fef2f2", color: "#991b1b" },
  REVISION_NEEDED: {
    label: "Revision Needed",
    bg: "#fff7ed",
    color: "#9a3412",
  },
};
