// import styles from "./MarqueeBar.module.css";

// const items = [
//   { pill: "✦ New", text: "Applications open for all" },
//   { pill: "✦ New", text: "Applications open for all" },
//   { pill: "✦ New", text: "Applications open for all" },
//   { pill: "✦ New", text: "Applications open for all" },
// ];

// export function MarqueeBar() {
//   return (
//     <div className={styles.bar} role="marquee" aria-label="Announcements">
//       <div className={styles.fadeLeft} aria-hidden="true" />
//       <div className={styles.fadeRight} aria-hidden="true" />

//       <div className={styles.track}>
//         {[...Array(2)].flatMap((_, copy) =>
//           items.flatMap((item, i) => [
//             <span key={`item-${copy}-${i}`} className={styles.item}>
//               <span className={styles.pill}>{item.pill}</span>
//               {item.text}
//             </span>,
//             <span key={`dot-${copy}-${i}`} aria-hidden="true" />,
//           ]),
//         )}
//       </div>
//     </div>
//   );
// }

import styles from "./MarqueeBar.module.css";

const items = [
  { pill: "✦ New", text: "Applications open for all" },
  { pill: "✦ New", text: "Applications open for all" },
  { pill: "✦ New", text: "Applications open for all" },
  { pill: "✦ New", text: "Applications open for all" },
];

export function MarqueeBar() {
  return (
    <div className={styles.bar} role="marquee" aria-label="Announcements">
      <div className={styles.fadeLeft} aria-hidden="true" />
      <div className={styles.fadeRight} aria-hidden="true" />

      <div className={styles.track}>
        {[...Array(2)].flatMap((_, copy) =>
          items.flatMap((item, i) => [
            <span key={`item-${copy}-${i}`} className={styles.item}>
              <span className={styles.pill}>{item.pill}</span>
              {item.text}
            </span>,
            <span key={`dot-${copy}-${i}`} aria-hidden="true" />,
          ]),
        )}
      </div>
    </div>
  );
}
