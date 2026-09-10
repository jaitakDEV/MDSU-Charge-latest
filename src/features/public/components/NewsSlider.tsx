import { db } from "@/server/db";
import { NewsSliderClient } from "./NewsSliderClient";

export async function NewsSlider() {
  const articles = await db.newsArticle.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    take: 6,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      publishedAt: true,
    },
  });

  // Koi article nahi hai — section hide karo
  if (articles.length === 0) return null;

  return <NewsSliderClient articles={articles} />;
}
