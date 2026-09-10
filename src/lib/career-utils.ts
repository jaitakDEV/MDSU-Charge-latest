import { db } from "@/server/db";

/**
 * Recompute and save profile completion percentage.
 * Call after any career profile mutation.
 */
export async function recomputeCompletionScore(
  profileId: string,
): Promise<number> {
  const profile = await db.studentCareerProfile.findUnique({
    where: { id: profileId },
    select: {
      headline: true,
      summary: true,
      currentCity: true,
      resumeUrl: true,
      skills: true,
      jobPreferences: { select: { id: true } },
      _count: { select: { education: true, experience: true, projects: true } },
      user: { select: { image: true } },
    },
  });

  if (!profile) return 0;

  let score = 0;

  // Basic info filled: +20%
  if (profile.headline && profile.summary && profile.currentCity) score += 20;

  // At least 1 education entry: +15%
  if (profile._count.education >= 1) score += 15;

  // At least 1 skill tag: +10%
  if (profile.skills.length >= 1) score += 10;

  // Resume uploaded: +25%
  if (profile.resumeUrl) score += 25;

  // At least 1 experience or project: +15%
  if (profile._count.experience >= 1 || profile._count.projects >= 1)
    score += 15;

  // Job preferences set: +10%
  if (profile.jobPreferences) score += 10;

  // Profile photo: +5%
  if (profile.user.image) score += 5;

  await db.studentCareerProfile.update({
    where: { id: profileId },
    data: { completionPercent: score },
  });

  return score;
}

/**
 * Get or create a student's career profile — auto-created on first
 * access after V5 launch (Section 10.1).
 */
export async function getOrCreateCareerProfile(userId: string) {
  let profile = await db.studentCareerProfile.findUnique({ where: { userId } });
  if (!profile) {
    profile = await db.studentCareerProfile.create({ data: { userId } });
  }
  return profile;
}
