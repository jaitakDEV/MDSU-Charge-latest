// import { Quote } from "lucide-react";
// import styles from "./VisionMission.module.css";

// const missionPoints = [
//   {
//     num: "01",
//     text: "Promote indigenous research, innovation, and technology development",
//   },
//   {
//     num: "02",
//     text: "Foster entrepreneurship, startups, and employment generation",
//   },
//   {
//     num: "03",
//     text: "Integrate Indian Knowledge Systems with modern academic and industrial practices",
//   },
//   {
//     num: "04",
//     text: "Create sustainable university–industry collaboration",
//   },
//   {
//     num: "05",
//     text: "Empower youth, rural communities, artisans, and local enterprises",
//   },
//   {
//     num: "06",
//     text: "Strengthen intellectual property generation and knowledge sovereignty",
//   },
//   {
//     num: "07",
//     text: "Contribute meaningfully towards the vision of Atmanirbhar Bharat",
//   },
// ];

// const pillars = [
//   {
//     title: "Atmanirbhar Bharat",
//     desc: "Self-reliance through indigenous innovation and technology",
//   },
//   {
//     title: "Knowledge Sovereignty",
//     desc: "Protecting and promoting Bharatiya wisdom traditions",
//   },
//   {
//     title: "Sustainable Development",
//     desc: "Research and enterprise rooted in long-term national impact",
//   },
// ];

// export default function VisionMission() {
//   return (
//     <section className={styles.section} aria-label="Vision and Mission">
//       <div className={styles.hero}>
//         <div className={styles.heroGrid} aria-hidden="true" />
//         <span className={styles.ghostText} aria-hidden="true">
//           VISION
//         </span>

//         <div className={styles.heroContent}>
//           <div className={styles.badge}>
//             <span className={styles.badgeLine} aria-hidden="true" />
//             MDSSC
//           </div>

//           <h1 className={styles.heroTitle}>
//             Vision &amp;
//             <br />
//             <span className={styles.heroTitleUnderline}>Mission</span>
//           </h1>

//           <p className={styles.heroDesc}>
//             Rooted in Bharatiya knowledge traditions and driven by modern
//             innovation, the Consortium&apos;s vision and mission chart a clear
//             path towards self-reliance, indigenous research, and sustainable
//             national development.
//           </p>
//         </div>
//       </div>

//       <div className={styles.body}>
//         <div className={styles.visionCol}>
//           <span className={styles.sectionLabel}>Our Vision</span>
//           <Quote className={styles.quoteIcon} size={32} aria-hidden="true" />
//           <p className={styles.visionStatement}>
//             To establish a globally relevant yet culturally rooted ecosystem for
//             indigenous innovation, self-reliance, entrepreneurship, research
//             excellence, and sustainable national development.
//           </p>
//           <span className={styles.visionFootnote}>
//             Inspired by Bharatiya knowledge traditions and contemporary
//             technological advancement.
//           </span>
//         </div>

//         <div className={styles.divider} aria-hidden="true" />

//         <div className={styles.missionCol}>
//           <span className={styles.sectionLabel}>Our Mission</span>
//           <h3 className={styles.missionHeading}>What we strive for</h3>

//           <ol className={styles.missionList}>
//             {missionPoints.map((item) => (
//               <li key={item.num} className={styles.missionItem}>
//                 <span className={styles.missionNum}>{item.num}</span>
//                 <p className={styles.missionText}>{item.text}</p>
//               </li>
//             ))}
//           </ol>
//         </div>
//       </div>

//       <div className={styles.pillarsWrap}>
//         <div className={styles.pillarsGrid}>
//           {pillars.map((p, i) => (
//             <div key={p.title} className={styles.pillarItem}>
//               <span className={styles.pillarIndex}>{`0${i + 1}`}</span>
//               <h4 className={styles.pillarTitle}>{p.title}</h4>
//               <p className={styles.pillarDesc}>{p.desc}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import styles from "./VisionMission.module.css";

const missionPoints = [
  {
    num: "01",
    text: "Promote indigenous research, innovation, and technology development",
  },
  {
    num: "02",
    text: "Foster entrepreneurship, startups, and employment generation",
  },
  {
    num: "03",
    text: "Integrate Indian Knowledge Systems with modern academic and industrial practices",
  },
  {
    num: "04",
    text: "Create sustainable university–industry collaboration",
  },
  {
    num: "05",
    text: "Empower youth, rural communities, artisans, and local enterprises",
  },
  {
    num: "06",
    text: "Strengthen intellectual property generation and knowledge sovereignty",
  },
  {
    num: "07",
    text: "Contribute meaningfully towards the vision of Atmanirbhar Bharat",
  },
];

const pillars = [
  {
    title: "Atmanirbhar Bharat",
    desc: "Self-reliance through indigenous innovation and technology",
  },
  {
    title: "Knowledge Sovereignty",
    desc: "Protecting and promoting Bharatiya wisdom traditions",
  },
  {
    title: "Sustainable Development",
    desc: "Research and enterprise rooted in long-term national impact",
  },
];

export default function VisionMission() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className={styles.section} aria-label="Vision and Mission">
      <div className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <span className={styles.ghostText} aria-hidden="true">
          VISION
        </span>

        <div
          className={`${styles.heroContent} ${visible ? styles.heroContentVisible : ""}`}
        >
          <div className={styles.badge}>
            <span className={styles.badgeLine} aria-hidden="true" />
            MDSSC
          </div>

          <h1 className={styles.heroTitle}>
            Vision &amp;
            <br />
            <span className={styles.heroTitleUnderline}>Mission</span>
          </h1>

          <p className={styles.heroDesc}>
            Rooted in Bharatiya knowledge traditions and driven by modern
            innovation, the Consortium&apos;s vision and mission chart a clear
            path towards self-reliance, indigenous research, and sustainable
            national development.
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.visionCol}>
          <span className={styles.sectionLabel}>Our Vision</span>
          <Quote className={styles.quoteIcon} size={32} aria-hidden="true" />
          <p className={styles.visionStatement}>
            To establish a globally relevant yet culturally rooted ecosystem for
            indigenous innovation, self-reliance, entrepreneurship, research
            excellence, and sustainable national development.
          </p>
          <span className={styles.visionFootnote}>
            Inspired by Bharatiya knowledge traditions and contemporary
            technological advancement.
          </span>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <div className={styles.missionCol}>
          <span className={styles.sectionLabel}>Our Mission</span>
          <h3 className={styles.missionHeading}>What we strive for</h3>

          <ol className={styles.missionList}>
            {missionPoints.map((item) => (
              <li key={item.num} className={styles.missionItem}>
                <span className={styles.missionNum}>{item.num}</span>
                <p className={styles.missionText}>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className={styles.pillarsWrap}>
        <div className={styles.pillarsGrid}>
          {pillars.map((p, i) => (
            <div key={p.title} className={styles.pillarItem}>
              <span className={styles.pillarIndex}>{`0${i + 1}`}</span>
              <h4 className={styles.pillarTitle}>{p.title}</h4>
              <p className={styles.pillarDesc}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
