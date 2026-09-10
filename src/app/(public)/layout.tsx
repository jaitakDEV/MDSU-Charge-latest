// import { Navbar } from "@/features/public/components/navbar";
// import { MarqueeBar } from "@/features/public/components/MarqueeBar";

// export default function PublicLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       <MarqueeBar />
//       {/* <Navbar /> */}
//       <main style={{ paddingTop: "80px" }}>{children}</main>
//     </>
//   );
// }

import { Navbar } from "@/features/public/components/navbar";
import { MarqueeBar } from "@/features/public/components/MarqueeBar";
import { Footer } from "@/features/public/components/Footer";
import { AnnouncementProvider } from "@/features/public/components/AnnouncementProvider";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementProvider />
      <MarqueeBar />
      <Navbar />
      <main style={{ paddingTop: "110px" }}>{children}</main>
      <Footer />
    </>
  );
}
