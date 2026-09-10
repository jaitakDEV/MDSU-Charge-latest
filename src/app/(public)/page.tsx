// import HeroSection from "@/features/public/components/hero-section";
// import AboutPage from "@/features/public/components/Aboutmdssc";
// import { BannerCarousel } from "@/features/public/components/BannerCarousel";
// import { ProgrammesSection } from "@/features/public/components/ProgrammesSection";
// import { NewsEventsSection } from "@/features/public/components/NewsEventsSection";
// import CampusLife from "@/features/public/components/CampusLife";

// export default function HomePage() {
//   return (
//     <div>
//       <HeroSection />
//       <AboutPage />
//       <BannerCarousel />
//       <ProgrammesSection />
//       <NewsEventsSection />
//       <CampusLife />
//     </div>
//   );
// }

import HeroSection from "@/features/public/components/hero-section";
import AboutPage from "@/features/public/components/Aboutmdssc";
import { BannerCarousel } from "@/features/public/components/BannerCarousel";
import { ProgrammesSection } from "@/features/public/components/ProgrammesSection";
import { NewsEventsSection } from "@/features/public/components/NewsEventsSection";
import CampusLife from "@/features/public/components/CampusLife";
import { HomeCourses } from "@/features/public/components/HomeCourses";
import { HomeBlog } from "@/features/public/components/HomeBlog";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <AboutPage />
      <BannerCarousel />
      <HomeCourses />
      <ProgrammesSection />
      <NewsEventsSection />
      <CampusLife />
      <HomeBlog />
    </div>
  );
}
