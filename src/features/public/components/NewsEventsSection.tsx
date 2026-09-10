// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useRef, useState, useCallback, useEffect } from "react";
// import styles from "./NewsEventsSection.module.css";

// const NEWS = [
//   {
//     id: "n1",
//     image: "/images/newsevents/latest1.webp",
//     title:
//       "Incubated Startup Successfully Conducts Static Fire Test; Initiates Design Enhancements for Next Phase",
//     date: "May 12, 2026",
//     href: "/news/static-fire-test",
//   },
//   {
//     id: "n2",
//     image: "/images/newsevents/latest2.webp",
//     title: "Campus Engagement Session by XEBIA Draws Record Student Turnout",
//     date: "May 09, 2026",
//     href: "/news/xebia-session",
//   },
//   {
//     id: "n3",
//     image: "/images/newsevents/latest1.webp",
//     title: "Ballers & Spikers Cup 2026 Concludes with Thrilling Finals",
//     date: "May 03, 2026",
//     href: "/news/ballers-spikers-cup",
//   },
//   {
//     id: "n4",
//     image: "/images/newsevents/latest2.webp",
//     title:
//       "CCCT Workshop on Locating Ecology in Tradition: Learning from the Field",
//     date: "Apr 26, 2026",
//     href: "/news/ccct-workshop",
//   },
// ];

// const EVENTS = [
//   {
//     id: "e1",
//     date: "May 09, 2026",
//     title: "Campus Engagement Session by XEBIA",
//     href: "/events/xebia-session",
//   },
//   {
//     id: "e2",
//     date: "May 03, 2026",
//     title: "Ballers & Spikers Cup 2026",
//     href: "/events/ballers-spikers-cup",
//   },
//   {
//     id: "e3",
//     date: "Apr 26, 2026",
//     title:
//       "CCCT Workshop on Locating Ecology in Tradition: Learning from the Field",
//     href: "/events/ccct-workshop",
//   },
//   {
//     id: "e4",
//     date: "Apr 24, 2026",
//     title: "SANKALP 2027: A Strategic Conclave",
//     href: "/events/sankalp-2027",
//   },
//   {
//     id: "e5",
//     date: "Apr 18, 2026",
//     title: "Alumni Meet & Industry Mixer",
//     href: "/events/alumni-meet",
//   },
//   {
//     id: "e6",
//     date: "Apr 10, 2026",
//     title: "National Hackathon on Sustainable Tech",
//     href: "/events/national-hackathon",
//   },
// ];

// const AUTOPLAY_DELAY = 5000;

// export function NewsEventsSection() {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [activeIdx, setActiveIdx] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const total = NEWS.length;

//   const goTo = useCallback(
//     (idx: number) => {
//       const wrapped = (idx + total) % total;
//       const el = trackRef.current;
//       if (!el) return;
//       const card = el.children[wrapped] as HTMLElement | undefined;
//       if (card) {
//         el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
//       }
//       setActiveIdx(wrapped);
//     },
//     [total],
//   );

//   const next = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo]);
//   const prev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo]);

//   useEffect(() => {
//     if (isPaused) return;
//     const timer = setInterval(() => {
//       next();
//     }, AUTOPLAY_DELAY);
//     return () => clearInterval(timer);
//   }, [isPaused, next]);

//   const onScroll = useCallback(() => {
//     const el = trackRef.current;
//     if (!el) return;
//     let closest = 0;
//     let minDist = Infinity;
//     Array.from(el.children).forEach((child, i) => {
//       const dist = Math.abs((child as HTMLElement).offsetLeft - el.scrollLeft);
//       if (dist < minDist) {
//         minDist = dist;
//         closest = i;
//       }
//     });
//     setActiveIdx(closest);
//   }, []);

//   useEffect(() => {
//     const el = trackRef.current;
//     if (!el) return;
//     el.addEventListener("scroll", onScroll, { passive: true });
//     return () => el.removeEventListener("scroll", onScroll);
//   }, [onScroll]);

//   return (
//     <section className={styles.section} aria-labelledby="news-events-heading">
//       <div className={styles.grid}>
//         <div className={styles.col}>
//           <div className={styles.colHeader}>
//             <h2 id="news-events-heading" className={styles.colTitle}>
//               Latest <span className={styles.titleAccent}>News</span>
//             </h2>
//             <Link href="/news" className={styles.viewAll}>
//               View All
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 aria-hidden="true"
//               >
//                 <line x1="5" y1="12" x2="19" y2="12" />
//                 <polyline points="12 5 19 12 12 19" />
//               </svg>
//             </Link>
//           </div>
//           <div className={styles.colDivider} />

//           <div
//             className={styles.newsSlider}
//             onMouseEnter={() => setIsPaused(true)}
//             onMouseLeave={() => setIsPaused(false)}
//           >
//             <div className={styles.newsTrack} ref={trackRef}>
//               {NEWS.map((item) => (
//                 <Link
//                   href={item.href}
//                   key={item.id}
//                   className={styles.newsCard}
//                 >
//                   <div className={styles.newsImgWrap}>
//                     <Image
//                       src={item.image}
//                       alt={item.title}
//                       fill
//                       className={styles.newsImg}
//                       sizes="(max-width: 768px) 100vw, 600px"
//                     />
//                   </div>
//                   <span className={styles.newsDate}>{item.date}</span>
//                   <h3 className={styles.newsTitle}>{item.title}</h3>
//                 </Link>
//               ))}
//             </div>

//             <button
//               type="button"
//               className={`${styles.navBtn} ${styles.navBtnPrev}`}
//               onClick={prev}
//               aria-label="Previous news item"
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 aria-hidden="true"
//               >
//                 <polyline points="15 18 9 12 15 6" />
//               </svg>
//             </button>
//             <button
//               type="button"
//               className={`${styles.navBtn} ${styles.navBtnNext}`}
//               onClick={next}
//               aria-label="Next news item"
//             >
//               <svg
//                 width="16"
//                 height="16"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 aria-hidden="true"
//               >
//                 <polyline points="9 18 15 12 9 6" />
//               </svg>
//             </button>
//           </div>

//           <div className={styles.dots}>
//             {NEWS.map((item, i) => (
//               <button
//                 key={item.id}
//                 type="button"
//                 className={`${styles.dot} ${
//                   i === activeIdx ? styles.dotActive : ""
//                 }`}
//                 onClick={() => goTo(i)}
//                 aria-label={`Go to news item ${i + 1}`}
//               />
//             ))}
//           </div>
//         </div>

//         <div className={styles.col}>
//           <div className={styles.colHeader}>
//             <h2 className={styles.colTitle}>
//               <span className={styles.titleAccent}>Events</span>
//             </h2>
//             <Link href="/events" className={styles.viewAll}>
//               View All
//               <svg
//                 width="14"
//                 height="14"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 aria-hidden="true"
//               >
//                 <line x1="5" y1="12" x2="19" y2="12" />
//                 <polyline points="12 5 19 12 12 19" />
//               </svg>
//             </Link>
//           </div>
//           <div className={styles.colDivider} />

//           <div className={styles.marqueeViewport}>
//             <div className={styles.marqueeFadeTop} aria-hidden="true" />
//             <div className={styles.marqueeTrack}>
//               <ul className={styles.marqueeList}>
//                 {EVENTS.map((event) => (
//                   <li key={event.id} className={styles.eventItem}>
//                     <Link href={event.href} className={styles.eventLink}>
//                       <span className={styles.eventDate}>{event.date}</span>
//                       <span className={styles.eventTitle}>{event.title}</span>
//                       <span className={styles.eventRule} aria-hidden="true" />
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//               <ul className={styles.marqueeList} aria-hidden="true">
//                 {EVENTS.map((event) => (
//                   <li key={`${event.id}-dup`} className={styles.eventItem}>
//                     <Link href={event.href} className={styles.eventLink}>
//                       <span className={styles.eventDate}>{event.date}</span>
//                       <span className={styles.eventTitle}>{event.title}</span>
//                       <span className={styles.eventRule} aria-hidden="true" />
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//             <div className={styles.marqueeFadeBottom} aria-hidden="true" />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

import { db } from "@/server/db";
import { NewsEventsSectionClient } from "./NewsEventsSectionClient";

export async function NewsEventsSection() {
  const [newsArticles, upcomingEvents] = await Promise.all([
    db.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: 6,
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        publishedAt: true,
      },
    }),
    db.event.findMany({
      where: {
        status: "PUBLISHED",
        eventType: "UPCOMING",
        startDate: { gte: new Date() },
      },
      orderBy: { startDate: "asc" },
      take: 8,
      select: {
        id: true,
        title: true,
        slug: true,
        startDate: true,
      },
    }),
  ]);

  const news = newsArticles.map((n) => ({
    id: n.id,
    image: n.coverImage ?? "/images/newsevents/latest1.webp",
    title: n.title,
    date: n.publishedAt
      ? n.publishedAt.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
    href: `/news/${n.slug}`,
  }));

  const events = upcomingEvents.map((e) => ({
    id: e.id,
    date: e.startDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    title: e.title,
    href: `/events/${e.slug}`,
  }));

  if (news.length === 0 && events.length === 0) return null;

  return <NewsEventsSectionClient news={news} events={events} />;
}
