import { db } from "@/server/db";

/**
 * Find published listings matching a student's preferences,
 * created since the given date (for daily/weekly digest windows).
 */
export async function findMatchingListings(
  preferences: {
    preferredTypes: string[];
    preferredRoles: string[];
    preferredLocations: string[];
    preferredWorkMode: string | null;
    minSalary: number | null;
    preferredIndustries: string[];
  },
  since: Date,
) {
  const where: any = {
    status: "PUBLISHED",
    createdAt: { gte: since },
  };

  if (preferences.preferredTypes.length > 0) {
    where.opportunityType = { in: preferences.preferredTypes };
  }
  if (preferences.preferredWorkMode) {
    where.workMode = preferences.preferredWorkMode;
  }
  if (preferences.minSalary) {
    where.OR = [
      { salaryMin: { gte: preferences.minSalary } },
      { stipendMin: { gte: preferences.minSalary } },
    ];
  }

  const listings = await db.jobListing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      title: true,
      slug: true,
      opportunityType: true,
      location: true,
      skills: true,
      company: { select: { companyName: true, industry: true } },
    },
  });

  return listings
    .filter((l) => {
      if (preferences.preferredRoles.length > 0) {
        const titleLower = l.title.toLowerCase();
        const matchesRole = preferences.preferredRoles.some((r) =>
          titleLower.includes(r.toLowerCase()),
        );
        if (!matchesRole) return false;
      }
      if (preferences.preferredLocations.length > 0 && l.location) {
        const matchesLocation = preferences.preferredLocations.some(
          (loc) =>
            l.location!.toLowerCase().includes(loc.toLowerCase()) ||
            loc.toLowerCase() === "remote",
        );
        if (!matchesLocation) return false;
      }
      if (preferences.preferredIndustries.length > 0) {
        if (!preferences.preferredIndustries.includes(l.company.industry))
          return false;
      }
      return true;
    })
    .slice(0, 10); // cap digest size
}
