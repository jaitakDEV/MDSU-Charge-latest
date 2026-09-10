// "use client";

// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import { useCallback, useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import styles from "./BannerCarousel.module.css";

// type BannerItem = {
//   id: string;
//   imageUrl: string;
//   altText: string;
//   title: string | null;
//   buttonText: string | null;
//   buttonLink: string | null;
// };

// const AUTOPLAY_DELAY_MS = 5000;

// export function BannerCarouselClient({ banners }: { banners: BannerItem[] }) {
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
//     emblaApi.on("reInit", onInit).on("select", onSelect);
//     return () => {
//       emblaApi.off("reInit", onInit).off("select", onSelect);
//     };
//   }, [emblaApi, onInit, onSelect]);

//   useEffect(() => {
//     const tick = () => {
//       setProgress(
//         Math.min(
//           ((Date.now() - slideStartTime.current) / AUTOPLAY_DELAY_MS) * 100,
//           100,
//         ),
//       );
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
//     (i: number) => {
//       emblaApi?.scrollTo(i);
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

//   if (!banners.length) return null;

//   const isUploadThingUrl = (url: string) =>
//     url.startsWith("https://utfs.io") ||
//     url.startsWith("https://uploadthing.com");

//   return (
//     <section className={styles.section}>
//       <div className={styles.headerWrap}>
//         <div className={styles.headerLeft}>
//           <p className={styles.eyebrow}>Highlights</p>

//           <h2 className={styles.headerTitle}>
//             What&apos;s Happening at{" "}
//             <span className={styles.titleAccent}>MDSU-CHARGE.</span>
//           </h2>
//         </div>

//         <div className={styles.headerCounter} aria-hidden="true">
//           <span className={styles.headerCounterNum}>
//             {String(selectedIndex + 1).padStart(2, "0")}
//           </span>
//           <span className={styles.headerCounterSep}>/</span>
//           <span className={styles.headerCounterTotal}>
//             {String(banners.length).padStart(2, "0")}
//           </span>
//         </div>
//       </div>

//       {/* ── Carousel ── */}
//       <div className={styles.viewportWrap}>
//         <div
//           ref={emblaRef}
//           className={styles.carousel}
//           role="region"
//           aria-label="Banner carousel"
//           aria-roledescription="carousel"
//           tabIndex={0}
//           onKeyDown={handleKeyDown}
//         >
//           <div className={styles.track}>
//             {banners.map((banner, i) => (
//               <div
//                 key={banner.id}
//                 className={styles.slide}
//                 role="group"
//                 aria-roledescription="slide"
//                 aria-label={`Slide ${i + 1} of ${banners.length}`}
//               >
//                 <Image
//                   src={banner.imageUrl}
//                   alt={banner.altText}
//                   fill
//                   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
//                   className={styles.slideImg}
//                   priority={i === 0}
//                   draggable={false}
//                   unoptimized={isUploadThingUrl(banner.imageUrl)}
//                 />

//                 {/* Title + CTA overlay */}
//                 {(banner.title || banner.buttonText) && (
//                   <div className={styles.overlay}>
//                     {banner.title && (
//                       <p className={styles.overlayTitle}>{banner.title}</p>
//                     )}
//                     {banner.buttonText && banner.buttonLink && (
//                       <Link
//                         href={banner.buttonLink}
//                         className={styles.overlayBtn}
//                       >
//                         {banner.buttonText}
//                         <svg
//                           width="14"
//                           height="14"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2.5"
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           aria-hidden="true"
//                         >
//                           <line x1="5" y1="12" x2="19" y2="12" />
//                           <polyline points="12 5 19 12 12 19" />
//                         </svg>
//                       </Link>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>

//           <div
//             className={styles.progressBar}
//             style={{ width: `${progress}%` }}
//             aria-hidden="true"
//           />

//           <button
//             type="button"
//             className={`${styles.navBtn} ${styles.navBtnLeft}`}
//             onClick={scrollPrev}
//             aria-label="Previous slide"
//           >
//             <svg
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               aria-hidden="true"
//             >
//               <polyline points="15 18 9 12 15 6" />
//             </svg>
//           </button>

//           {/* Next */}
//           <button
//             type="button"
//             className={`${styles.navBtn} ${styles.navBtnRight}`}
//             onClick={scrollNext}
//             aria-label="Next slide"
//           >
//             <svg
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               aria-hidden="true"
//             >
//               <polyline points="9 18 15 12 9 6" />
//             </svg>
//           </button>

//           <div className={styles.slideCounter} aria-hidden="true">
//             <span className={styles.slideCounterActive}>
//               {String(selectedIndex + 1).padStart(2, "0")}
//             </span>
//             {" / "}
//             {String(banners.length).padStart(2, "0")}
//           </div>

//           <div
//             className={styles.dots}
//             role="tablist"
//             aria-label="Slide navigation"
//           >
//             {scrollSnaps.map((_, i) => (
//               <button
//                 key={i}
//                 type="button"
//                 role="tab"
//                 aria-selected={i === selectedIndex}
//                 aria-label={`Go to slide ${i + 1}`}
//                 onClick={() => scrollTo(i)}
//                 className={`${styles.dot} ${i === selectedIndex ? styles.dotActive : ""}`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./BannerCarousel.module.css";

type BannerItem = {
  id: string;
  imageUrl: string;
  altText: string;
  title: string | null;
  buttonText: string | null;
  buttonLink: string | null;
};

const AUTOPLAY_DELAY_MS = 5000;

export function BannerCarouselClient({ banners }: { banners: BannerItem[] }) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: AUTOPLAY_DELAY_MS, stopOnInteraction: false }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false, dragFree: false },
    [autoplayPlugin.current],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [progress, setProgress] = useState(0);

  const rafRef = useRef<number | null>(null);
  const slideStartTime = useRef<number>(Date.now());

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    slideStartTime.current = Date.now();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onInit();
    onSelect();
    emblaApi.on("reInit", onInit).on("select", onSelect);
    return () => {
      emblaApi.off("reInit", onInit).off("select", onSelect);
    };
  }, [emblaApi, onInit, onSelect]);

  useEffect(() => {
    const tick = () => {
      setProgress(
        Math.min(
          ((Date.now() - slideStartTime.current) / AUTOPLAY_DELAY_MS) * 100,
          100,
        ),
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    autoplayPlugin.current.reset();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    autoplayPlugin.current.reset();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (i: number) => {
      emblaApi?.scrollTo(i);
      autoplayPlugin.current.reset();
    },
    [emblaApi],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    },
    [scrollPrev, scrollNext],
  );

  if (!banners.length) return null;

  const isUploadThingUrl = (url: string) =>
    url.startsWith("https://utfs.io") ||
    url.startsWith("https://uploadthing.com");

  return (
    <section className={styles.section}>
      <div className={styles.headerWrap}>
        <div className={styles.headerLeft}>
          <p className={styles.eyebrow}>Highlights</p>

          <h2 className={styles.headerTitle}>
            What&apos;s Happening at{" "}
            <span className={styles.titleAccent}>MDSU-CHARGE.</span>
          </h2>
        </div>

        <div className={styles.headerCounter} aria-hidden="true">
          <span className={styles.headerCounterNum}>
            {String(selectedIndex + 1).padStart(2, "0")}
          </span>
          <span className={styles.headerCounterSep}>/</span>
          <span className={styles.headerCounterTotal}>
            {String(banners.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div className={styles.viewportWrap}>
        <div
          ref={emblaRef}
          className={styles.carousel}
          role="region"
          aria-label="Banner carousel"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <div className={styles.track}>
            {banners.map((banner, i) => (
              <div
                key={banner.id}
                className={styles.slide}
                role="group"
                aria-roledescription="slide"
                aria-label={`Slide ${i + 1} of ${banners.length}`}
              >
                <Image
                  src={banner.imageUrl}
                  alt={banner.altText}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                  className={styles.slideImg}
                  priority={i === 0}
                  draggable={false}
                  unoptimized={isUploadThingUrl(banner.imageUrl)}
                />

                {/* Title + CTA overlay */}
                {(banner.title || banner.buttonText) && (
                  <div className={styles.overlay}>
                    {banner.title && (
                      <p className={styles.overlayTitle}>{banner.title}</p>
                    )}
                    {banner.buttonText && banner.buttonLink && (
                      <Link
                        href={banner.buttonLink}
                        className={styles.overlayBtn}
                      >
                        {banner.buttonText}
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
            aria-hidden="true"
          />

          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnLeft}`}
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Next */}
          <button
            type="button"
            className={`${styles.navBtn} ${styles.navBtnRight}`}
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className={styles.slideCounter} aria-hidden="true">
            <span className={styles.slideCounterActive}>
              {String(selectedIndex + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(banners.length).padStart(2, "0")}
          </div>

          <div
            className={styles.dots}
            role="tablist"
            aria-label="Slide navigation"
          >
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === selectedIndex}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`${styles.dot} ${i === selectedIndex ? styles.dotActive : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
