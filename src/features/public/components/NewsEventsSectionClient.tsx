// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useRef, useState, useCallback, useEffect } from "react";
// import styles from "./NewsEventsSection.module.css";

// type NewsItem = {
//   id: string;
//   image: string;
//   title: string;
//   date: string;
//   href: string;
// };
// type EventItem = { id: string; date: string; title: string; href: string };

// const AUTOPLAY_DELAY = 5000;

// export function NewsEventsSectionClient({
//   news,
//   events,
// }: {
//   news: NewsItem[];
//   events: EventItem[];
// }) {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [activeIdx, setActiveIdx] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const total = news.length;

//   const goTo = useCallback(
//     (idx: number) => {
//       if (total === 0) return;
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
//     if (isPaused || total === 0) return;
//     const timer = setInterval(() => {
//       next();
//     }, AUTOPLAY_DELAY);
//     return () => clearInterval(timer);
//   }, [isPaused, next, total]);

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
//         {/* ── News column ── */}
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

//           {news.length === 0 ? (
//             <div
//               style={{
//                 padding: "2rem",
//                 textAlign: "center",
//                 color: "#94a3b8",
//                 fontSize: "13px",
//               }}
//             >
//               No news articles yet
//             </div>
//           ) : (
//             <>
//               <div
//                 className={styles.newsSlider}
//                 onMouseEnter={() => setIsPaused(true)}
//                 onMouseLeave={() => setIsPaused(false)}
//               >
//                 <div className={styles.newsTrack} ref={trackRef}>
//                   {news.map((item) => (
//                     <Link
//                       href={item.href}
//                       key={item.id}
//                       className={styles.newsCard}
//                     >
//                       <div className={styles.newsImgWrap}>
//                         <Image
//                           src={item.image}
//                           alt={item.title}
//                           fill
//                           className={styles.newsImg}
//                           sizes="(max-width: 768px) 100vw, 600px"
//                           unoptimized={item.image.startsWith("https://utfs.io")}
//                         />
//                       </div>
//                       <span className={styles.newsDate}>{item.date}</span>
//                       <h3 className={styles.newsTitle}>{item.title}</h3>
//                     </Link>
//                   ))}
//                 </div>

//                 {news.length > 1 && (
//                   <>
//                     <button
//                       type="button"
//                       className={`${styles.navBtn} ${styles.navBtnPrev}`}
//                       onClick={prev}
//                       aria-label="Previous news item"
//                     >
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         aria-hidden="true"
//                       >
//                         <polyline points="15 18 9 12 15 6" />
//                       </svg>
//                     </button>
//                     <button
//                       type="button"
//                       className={`${styles.navBtn} ${styles.navBtnNext}`}
//                       onClick={next}
//                       aria-label="Next news item"
//                     >
//                       <svg
//                         width="16"
//                         height="16"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth="2.5"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         aria-hidden="true"
//                       >
//                         <polyline points="9 18 15 12 9 6" />
//                       </svg>
//                     </button>
//                   </>
//                 )}
//               </div>

//               {news.length > 1 && (
//                 <div className={styles.dots}>
//                   {news.map((item, i) => (
//                     <button
//                       key={item.id}
//                       type="button"
//                       className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ""}`}
//                       onClick={() => goTo(i)}
//                       aria-label={`Go to news item ${i + 1}`}
//                     />
//                   ))}
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         {/* ── Events column ── */}
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

//           {events.length === 0 ? (
//             <div
//               style={{
//                 padding: "2rem",
//                 textAlign: "center",
//                 color: "#94a3b8",
//                 fontSize: "13px",
//               }}
//             >
//               No upcoming events
//             </div>
//           ) : (
//             <div className={styles.marqueeViewport}>
//               <div className={styles.marqueeFadeTop} aria-hidden="true" />
//               <div className={styles.marqueeTrack}>
//                 <ul className={styles.marqueeList}>
//                   {events.map((event) => (
//                     <li key={event.id} className={styles.eventItem}>
//                       <Link href={event.href} className={styles.eventLink}>
//                         <span className={styles.eventDate}>{event.date}</span>
//                         <span className={styles.eventTitle}>{event.title}</span>
//                         <span className={styles.eventRule} aria-hidden="true" />
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//                 <ul className={styles.marqueeList} aria-hidden="true">
//                   {events.map((event) => (
//                     <li key={`${event.id}-dup`} className={styles.eventItem}>
//                       <Link href={event.href} className={styles.eventLink}>
//                         <span className={styles.eventDate}>{event.date}</span>
//                         <span className={styles.eventTitle}>{event.title}</span>
//                         <span className={styles.eventRule} aria-hidden="true" />
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <div className={styles.marqueeFadeBottom} aria-hidden="true" />
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useCallback, useEffect } from "react";
import styles from "./NewsEventsSection.module.css";

type NewsItem = {
  id: string;
  image: string;
  title: string;
  date: string;
  href: string;
};
type EventItem = { id: string; date: string; title: string; href: string };

const AUTOPLAY_DELAY = 5000;

function EmptyState({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <p className={styles.emptyTitle}>{label}</p>
    </div>
  );
}

export function NewsEventsSectionClient({
  news,
  events,
}: {
  news: NewsItem[];
  events: EventItem[];
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = news.length;

  const goTo = useCallback(
    (idx: number) => {
      if (total === 0) return;
      const wrapped = (idx + total) % total;
      const el = trackRef.current;
      if (!el) return;
      const card = el.children[wrapped] as HTMLElement | undefined;
      if (card) {
        el.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
      }
      setActiveIdx(wrapped);
    },
    [total],
  );

  const next = useCallback(() => goTo(activeIdx + 1), [activeIdx, goTo]);
  const prev = useCallback(() => goTo(activeIdx - 1), [activeIdx, goTo]);

  useEffect(() => {
    if (isPaused || total === 0) return;
    const timer = setInterval(() => {
      next();
    }, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [isPaused, next, total]);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    let closest = 0;
    let minDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const dist = Math.abs((child as HTMLElement).offsetLeft - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIdx(closest);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <section className={styles.section} aria-labelledby="news-events-heading">
      <div className={styles.grid}>
        {/* ── News column ── */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <h2 id="news-events-heading" className={styles.colTitle}>
              Latest <span className={styles.titleAccent}>News</span>
            </h2>
            <Link href="/news" className={styles.viewAll}>
              View All
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
          </div>
          <div className={styles.colDivider} />

          {news.length === 0 ? (
            <EmptyState
              label="No news articles yet"
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f0a868"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <line x1="6" y1="8" x2="14" y2="8" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                  <line x1="6" y1="16" x2="18" y2="16" />
                </svg>
              }
            />
          ) : (
            <>
              <div
                className={styles.newsSlider}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div className={styles.newsTrack} ref={trackRef}>
                  {news.map((item) => (
                    <Link
                      href={item.href}
                      key={item.id}
                      className={styles.newsCard}
                    >
                      <div className={styles.newsImgWrap}>
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className={styles.newsImg}
                          sizes="(max-width: 768px) 100vw, 600px"
                          unoptimized={item.image.startsWith("https://utfs.io")}
                        />
                      </div>
                      <span className={styles.newsDate}>{item.date}</span>
                      <h3 className={styles.newsTitle}>{item.title}</h3>
                    </Link>
                  ))}
                </div>

                {news.length > 1 && (
                  <>
                    <button
                      type="button"
                      className={`${styles.navBtn} ${styles.navBtnPrev}`}
                      onClick={prev}
                      aria-label="Previous news item"
                    >
                      <svg
                        width="16"
                        height="16"
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
                    <button
                      type="button"
                      className={`${styles.navBtn} ${styles.navBtnNext}`}
                      onClick={next}
                      aria-label="Next news item"
                    >
                      <svg
                        width="16"
                        height="16"
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
                  </>
                )}
              </div>

              {news.length > 1 && (
                <div className={styles.dots}>
                  {news.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ""}`}
                      onClick={() => goTo(i)}
                      aria-label={`Go to news item ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Events column ── */}
        <div className={styles.col}>
          <div className={styles.colHeader}>
            <h2 className={styles.colTitle}>
              <span className={styles.titleAccent}>Events</span>
            </h2>
            <Link href="/events" className={styles.viewAll}>
              View All
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
          </div>
          <div className={styles.colDivider} />

          {events.length === 0 ? (
            <EmptyState
              label="No upcoming events"
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f0a868"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
            />
          ) : (
            <div className={styles.marqueeViewport}>
              <div className={styles.marqueeFadeTop} aria-hidden="true" />
              <div className={styles.marqueeTrack}>
                <ul className={styles.marqueeList}>
                  {events.map((event) => (
                    <li key={event.id} className={styles.eventItem}>
                      <Link href={event.href} className={styles.eventLink}>
                        <span className={styles.eventDate}>{event.date}</span>
                        <span className={styles.eventTitle}>{event.title}</span>
                        <span className={styles.eventRule} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className={styles.marqueeList} aria-hidden="true">
                  {events.map((event) => (
                    <li key={`${event.id}-dup`} className={styles.eventItem}>
                      <Link href={event.href} className={styles.eventLink}>
                        <span className={styles.eventDate}>{event.date}</span>
                        <span className={styles.eventTitle}>{event.title}</span>
                        <span className={styles.eventRule} aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.marqueeFadeBottom} aria-hidden="true" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
