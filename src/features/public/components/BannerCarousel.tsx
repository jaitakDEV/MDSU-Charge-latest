// "use client";

// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import { useCallback, useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface Banner {
//   id: string;
//   src: string;
//   alt: string;
// }

// const BANNERS: Banner[] = [
//   {
//     id: "1",
//     src: "/images/banners/banner1.webp",
//     alt: "MDSU-CHARGE highlight 1",
//   },
//   {
//     id: "2",
//     src: "/images/banners/banner2.webp",
//     alt: "MDSU-CHARGE highlight 2",
//   },
//   {
//     id: "3",
//     src: "/images/banners/banner3.webp",
//     alt: "MDSU-CHARGE highlight 3",
//   },
//   {
//     id: "4",
//     src: "/images/banners/banner4.webp",
//     alt: "MDSU-CHARGE highlight 4",
//   },
//   {
//     id: "5",
//     src: "/images/banners/banner5.webp",
//     alt: "MDSU-CHARGE highlight 5",
//   },
// ];

// const AUTOPLAY_DELAY_MS = 5000;

// export function BannerCarousel() {
//   const autoplayPlugin = useRef(
//     Autoplay({ delay: AUTOPLAY_DELAY_MS, stopOnInteraction: false }),
//   );

//   const [emblaRef, emblaApi] = useEmblaCarousel(
//     { loop: true, align: "center", skipSnaps: false, dragFree: false },
//     [autoplayPlugin.current],
//   );

//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
//   const [progress, setProgress] = useState(0);

//   const rafRef = useRef<number | null>(null);
//   const slideStartTime = useRef<number>(Date.now());

//   const onInit = useCallback(() => {
//     if (!emblaApi) return;
//     setScrollSnaps(emblaApi.scrollSnapList());
//   }, [emblaApi]);

//   const onSelect = useCallback(() => {
//     if (!emblaApi) return;
//     setSelectedIndex(emblaApi.selectedScrollSnap());
//     slideStartTime.current = Date.now();
//   }, [emblaApi]);

//   useEffect(() => {
//     if (!emblaApi) return;
//     onInit();
//     onSelect();
//     emblaApi.on("reInit", onInit);
//     emblaApi.on("select", onSelect);
//     return () => {
//       emblaApi.off("reInit", onInit);
//       emblaApi.off("select", onSelect);
//     };
//   }, [emblaApi, onInit, onSelect]);

//   useEffect(() => {
//     const tick = () => {
//       const elapsed = Date.now() - slideStartTime.current;
//       setProgress(Math.min((elapsed / AUTOPLAY_DELAY_MS) * 100, 100));
//       rafRef.current = requestAnimationFrame(tick);
//     };
//     rafRef.current = requestAnimationFrame(tick);
//     return () => {
//       if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
//     };
//   }, []);

//   const scrollPrev = useCallback(() => {
//     emblaApi?.scrollPrev();
//     autoplayPlugin.current.reset();
//   }, [emblaApi]);

//   const scrollNext = useCallback(() => {
//     emblaApi?.scrollNext();
//     autoplayPlugin.current.reset();
//   }, [emblaApi]);

//   const scrollTo = useCallback(
//     (index: number) => {
//       emblaApi?.scrollTo(index);
//       autoplayPlugin.current.reset();
//     },
//     [emblaApi],
//   );

//   const handleKeyDown = useCallback(
//     (e: React.KeyboardEvent) => {
//       if (e.key === "ArrowLeft") scrollPrev();
//       if (e.key === "ArrowRight") scrollNext();
//     },
//     [scrollPrev, scrollNext],
//   );

//   return (
//     <section className="w-full bg-[#eef4fc] py-10 sm:py-14">
//       <div className="mx-auto mb-6 flex max-w-[1200px] items-end justify-between gap-4 px-4 sm:px-8 lg:px-[6vw]">
//         <div>
//           <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0951a5] before:block before:h-0.5 before:w-6 before:rounded before:bg-[#0951a5] before:content-['']">
//             Highlights
//           </p>
//           <h2 className="m-0 font-sans text-[clamp(1.25rem,2.4vw,2rem)] font-extrabold leading-tight tracking-tight text-[#1a3a6b]">
//             What&apos;s Happening at MDSU-CHARGE
//           </h2>
//         </div>
//       </div>

//       <div className="mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-[6vw]">
//         <div
//           ref={emblaRef}
//           className={cn(
//             "relative w-full overflow-hidden",
//             "rounded-2xl shadow-xl ring-1 ring-black/5",
//             // height via aspect-ratio — never clips the image content
//             "aspect-[16/7] min-h-[180px] max-h-[500px]",
//             "cursor-grab bg-[#063080] active:cursor-grabbing",
//             "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0951a5] focus-visible:ring-offset-2",
//           )}
//           role="region"
//           aria-label="Banner carousel"
//           aria-roledescription="carousel"
//           tabIndex={0}
//           onKeyDown={handleKeyDown}
//         >
//           <div className="flex h-full touch-pan-y select-none">
//             {BANNERS.map((banner, i) => (
//               <div
//                 key={banner.id}
//                 className="relative h-full min-w-0 flex-[0_0_100%]"
//                 role="group"
//                 aria-roledescription="slide"
//                 aria-label={`Slide ${i + 1} of ${BANNERS.length}`}
//               >
//                 <Image
//                   src={banner.src}
//                   alt={banner.alt}
//                   fill
//                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
//                   className="object-contain object-center"
//                   priority={i === 0}
//                   draggable={false}
//                 />
//               </div>
//             ))}
//           </div>

//           <div
//             className="absolute bottom-0 left-0 z-10 h-[3px] bg-white/90 transition-none"
//             style={{ width: `${progress}%` }}
//             aria-hidden="true"
//           />

//           <Button
//             variant="ghost"
//             size="icon"
//             className={cn(
//               "absolute left-3 top-1/2 z-10 -translate-y-1/2",
//               "h-9 w-9 sm:h-11 sm:w-11",
//               "rounded-full border border-white/20 bg-black/20 text-white",
//               "backdrop-blur-sm transition-colors",
//               "hover:border-white/50 hover:bg-black/40 hover:text-white",
//               "focus-visible:ring-white",
//             )}
//             onClick={scrollPrev}
//             aria-label="Previous slide"
//           >
//             <ChevronLeft
//               className="h-4 w-4 sm:h-5 sm:w-5"
//               strokeWidth={2.5}
//               aria-hidden
//             />
//           </Button>

//           <Button
//             variant="ghost"
//             size="icon"
//             className={cn(
//               "absolute right-3 top-1/2 z-10 -translate-y-1/2",
//               "h-9 w-9 sm:h-11 sm:w-11",
//               "rounded-full border border-white/20 bg-black/20 text-white",
//               "backdrop-blur-sm transition-colors",
//               "hover:border-white/50 hover:bg-black/40 hover:text-white",
//               "focus-visible:ring-white",
//             )}
//             onClick={scrollNext}
//             aria-label="Next slide"
//           >
//             <ChevronRight
//               className="h-4 w-4 sm:h-5 sm:w-5"
//               strokeWidth={2.5}
//               aria-hidden
//             />
//           </Button>

//           <div
//             className="absolute right-4 top-3 z-10 hidden text-xs font-semibold tracking-[0.06em] text-white/60 sm:block"
//             aria-hidden="true"
//           >
//             <span className="text-sm font-bold text-white">
//               {String(selectedIndex + 1).padStart(2, "0")}
//             </span>
//             {" / "}
//             {String(BANNERS.length).padStart(2, "0")}
//           </div>

//           <div
//             className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5"
//             role="tablist"
//             aria-label="Slide navigation"
//           >
//             {scrollSnaps.map((_, i) => (
//               <button
//                 key={i}
//                 role="tab"
//                 aria-selected={i === selectedIndex}
//                 aria-label={`Go to slide ${i + 1}`}
//                 onClick={() => scrollTo(i)}
//                 className={cn(
//                   "h-[6px] cursor-pointer rounded-full border-none p-0 transition-all duration-300",
//                   i === selectedIndex
//                     ? "w-6 bg-white shadow-sm"
//                     : "w-[6px] bg-white/40 hover:bg-white/70",
//                 )}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { db } from "@/server/db";
import { BannerCarouselClient } from "./BannerCarouselClient";

export async function BannerCarousel() {
  const banners = await db.banner.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true,
      imageUrl: true,
      altText: true,
      title: true,
      buttonText: true,
      buttonLink: true,
    },
  });

  if (banners.length === 0) return null;

  return <BannerCarouselClient banners={banners} />;
}
