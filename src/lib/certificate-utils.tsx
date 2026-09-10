// // import {
// //   Document,
// //   Page,
// //   Text,
// //   View,
// //   StyleSheet,
// //   Font,
// // } from "@react-pdf/renderer";

// // const styles = StyleSheet.create({
// //   page: {
// //     padding: 60,
// //     backgroundColor: "#ffffff",
// //     fontFamily: "Helvetica",
// //   },
// //   border: {
// //     border: "3px solid #1d4ed8",
// //     borderRadius: 8,
// //     padding: 40,
// //     height: "100%",
// //     display: "flex",
// //     flexDirection: "column",
// //     alignItems: "center",
// //     justifyContent: "center",
// //   },
// //   topAccent: {
// //     width: 80,
// //     height: 4,
// //     backgroundColor: "#1d4ed8",
// //     marginBottom: 24,
// //     borderRadius: 2,
// //   },
// //   issuer: {
// //     fontSize: 11,
// //     color: "#64748b",
// //     letterSpacing: 2,
// //     textTransform: "uppercase",
// //     marginBottom: 8,
// //   },
// //   title: {
// //     fontSize: 28,
// //     fontFamily: "Helvetica-Bold",
// //     color: "#0f172a",
// //     marginBottom: 6,
// //     textAlign: "center",
// //   },
// //   subtitle: {
// //     fontSize: 13,
// //     color: "#64748b",
// //     marginBottom: 32,
// //   },
// //   ofLabel: {
// //     fontSize: 11,
// //     color: "#94a3b8",
// //     marginBottom: 10,
// //     letterSpacing: 1,
// //     textTransform: "uppercase",
// //   },
// //   studentName: {
// //     fontSize: 32,
// //     fontFamily: "Helvetica-Bold",
// //     color: "#1d4ed8",
// //     marginBottom: 8,
// //     textAlign: "center",
// //   },
// //   divider: {
// //     width: 200,
// //     height: 1,
// //     backgroundColor: "#e2e8f0",
// //     marginBottom: 28,
// //   },
// //   completedLabel: {
// //     fontSize: 11,
// //     color: "#94a3b8",
// //     marginBottom: 10,
// //     letterSpacing: 1,
// //     textTransform: "uppercase",
// //   },
// //   courseTitle: {
// //     fontSize: 18,
// //     fontFamily: "Helvetica-Bold",
// //     color: "#0f172a",
// //     textAlign: "center",
// //     marginBottom: 32,
// //   },
// //   footer: {
// //     display: "flex",
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     width: "100%",
// //     marginTop: 20,
// //   },
// //   footerItem: {
// //     alignItems: "center",
// //     width: "45%",
// //   },
// //   footerLine: {
// //     width: "100%",
// //     height: 1,
// //     backgroundColor: "#e2e8f0",
// //     marginBottom: 6,
// //   },
// //   footerLabel: {
// //     fontSize: 10,
// //     color: "#94a3b8",
// //   },
// //   footerValue: {
// //     fontSize: 11,
// //     color: "#475569",
// //     fontFamily: "Helvetica-Bold",
// //   },
// //   certNumber: {
// //     fontSize: 9,
// //     color: "#cbd5e1",
// //     marginTop: 24,
// //   },
// // });

// // export function CertificateTemplate({
// //   studentName,
// //   courseTitle,
// //   issuedAt,
// //   certificateNumber,
// // }: {
// //   studentName: string;
// //   courseTitle: string;
// //   issuedAt: Date;
// //   certificateNumber: string;
// // }) {
// //   const dateStr = issuedAt.toLocaleDateString("en-IN", {
// //     day: "numeric",
// //     month: "long",
// //     year: "numeric",
// //   });

// //   return (
// //     <Document>
// //       <Page size="A4" orientation="landscape" style={styles.page}>
// //         <View style={styles.border}>
// //           <View style={styles.topAccent} />

// //           <Text style={styles.issuer}>MDSU - Charge Platform</Text>
// //           <Text style={styles.title}>Certificate of Completion</Text>
// //           <Text style={styles.subtitle}>This is to certify that</Text>

// //           <Text style={styles.ofLabel}>Awarded to</Text>
// //           <Text style={styles.studentName}>{studentName}</Text>
// //           <View style={styles.divider} />

// //           <Text style={styles.completedLabel}>Has successfully completed</Text>
// //           <Text style={styles.courseTitle}>{courseTitle}</Text>

// //           <View style={styles.footer}>
// //             <View style={styles.footerItem}>
// //               <View style={styles.footerLine} />
// //               <Text style={styles.footerLabel}>Date of Issue</Text>
// //               <Text style={styles.footerValue}>{dateStr}</Text>
// //             </View>
// //             <View style={styles.footerItem}>
// //               <View style={styles.footerLine} />
// //               <Text style={styles.footerLabel}>Issued by</Text>
// //               <Text style={styles.footerValue}>MDSSU - Charge</Text>
// //             </View>
// //           </View>

// //           <Text style={styles.certNumber}>
// //             Certificate No: {certificateNumber}
// //           </Text>
// //         </View>
// //       </Page>
// //     </Document>
// //   );
// // }

// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";
// import path from "path";
// import fs from "fs";

// // ── Load logos from public folder ─────────────────────────────
// function getImage(filename: string): string | null {
//   try {
//     const filePath = path.join(process.cwd(), "public", filename);
//     const buffer = fs.readFileSync(filePath);
//     const ext = filename.endsWith(".png") ? "png" : "jpeg";
//     return `data:image/${ext};base64,${buffer.toString("base64")}`;
//   } catch {
//     return null;
//   }
// }

// // ── Styles ────────────────────────────────────────────────────
// const S = StyleSheet.create({
//   page: {
//     backgroundColor: "#faf8f2",
//     fontFamily: "Helvetica",
//     padding: 0,
//     width: "100%",
//     height: "100%",
//   },

//   // Outer gold border
//   outerBorder: {
//     position: "absolute",
//     top: 18,
//     left: 18,
//     right: 18,
//     bottom: 18,
//     border: "2.5px solid #c8a535",
//   },

//   // Inner gold border
//   innerBorder: {
//     position: "absolute",
//     top: 26,
//     left: 26,
//     right: 26,
//     bottom: 26,
//     border: "1px solid #c8a535",
//   },

//   // Main content wrapper
//   content: {
//     position: "absolute",
//     top: 34,
//     left: 34,
//     right: 34,
//     bottom: 34,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     paddingHorizontal: 40,
//     paddingVertical: 24,
//   },

//   // ── Corner ornaments ──
//   cornerTL: { position: "absolute", top: 14, left: 14, width: 24, height: 24 },
//   cornerTR: { position: "absolute", top: 14, right: 14, width: 24, height: 24 },
//   cornerBL: {
//     position: "absolute",
//     bottom: 14,
//     left: 14,
//     width: 24,
//     height: 24,
//   },
//   cornerBR: {
//     position: "absolute",
//     bottom: 14,
//     right: 14,
//     width: 24,
//     height: 24,
//   },

//   // ── Logos row ──
//   logosRow: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     width: "100%",
//     marginBottom: 10,
//   },

//   logo: {
//     width: 70,
//     height: 40,
//     objectFit: "contain",
//   },

//   orgNameCenter: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },

//   orgName: {
//     fontSize: 8,
//     color: "#6b4e0a",
//     letterSpacing: 1.5,
//     textTransform: "uppercase",
//     textAlign: "center",
//     fontFamily: "Helvetica-Bold",
//   },

//   orgSub: {
//     fontSize: 7,
//     color: "#94763a",
//     textAlign: "center",
//     marginTop: 2,
//   },

//   // ── Gold top divider ──
//   goldBar: {
//     width: "100%",
//     height: 1.5,
//     backgroundColor: "#c8a535",
//     marginVertical: 8,
//   },

//   thinBar: {
//     width: "100%",
//     height: 0.5,
//     backgroundColor: "#d4b84a",
//     marginVertical: 4,
//   },

//   // ── Star / Laurel ornament ──
//   ornamentRow: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginVertical: 6,
//     gap: 6,
//   },

//   ornamentLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: "#c8a535",
//   },

//   ornamentStar: {
//     fontSize: 14,
//     color: "#c8a535",
//     textAlign: "center",
//   },

//   // ── CERTIFICATE heading ──
//   certTitle: {
//     fontSize: 30,
//     fontFamily: "Helvetica-Bold",
//     color: "#1a1a2e",
//     letterSpacing: 6,
//     textTransform: "uppercase",
//     textAlign: "center",
//     marginBottom: 4,
//   },

//   certSubtitle: {
//     fontSize: 11,
//     color: "#c8a535",
//     letterSpacing: 4,
//     textTransform: "uppercase",
//     textAlign: "center",
//     fontFamily: "Helvetica-Bold",
//     marginBottom: 2,
//   },

//   // ── Decorative swirl line ──
//   swirlText: {
//     fontSize: 10,
//     color: "#c8a535",
//     textAlign: "center",
//   },

//   // ── Presented to ──
//   presentedTo: {
//     fontSize: 8,
//     color: "#6b7280",
//     letterSpacing: 2,
//     textTransform: "uppercase",
//     textAlign: "center",
//     marginTop: 10,
//     marginBottom: 6,
//   },

//   // ── Student name ──
//   studentName: {
//     fontSize: 32,
//     fontFamily: "Helvetica-Bold",
//     color: "#1a1a2e",
//     textAlign: "center",
//     marginBottom: 2,
//     letterSpacing: 1,
//   },

//   nameUnderline: {
//     width: 220,
//     height: 1.5,
//     backgroundColor: "#c8a535",
//     marginBottom: 2,
//   },

//   nameDot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: "#c8a535",
//     marginBottom: 10,
//   },

//   // ── Body text ──
//   bodyText: {
//     fontSize: 9.5,
//     color: "#374151",
//     textAlign: "center",
//     lineHeight: 1.7,
//     marginBottom: 2,
//     letterSpacing: 0.3,
//   },

//   // ── Course title ──
//   courseTitle: {
//     fontSize: 14,
//     fontFamily: "Helvetica-Bold",
//     color: "#1a1a2e",
//     textAlign: "center",
//     marginTop: 4,
//     marginBottom: 10,
//     letterSpacing: 0.5,
//   },

//   // ── Seal + signatures row ──
//   bottomRow: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "flex-end",
//     justifyContent: "space-between",
//     width: "100%",
//     marginTop: "auto",
//     paddingTop: 8,
//   },

//   signatureItem: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     width: "35%",
//   },

//   signatureLine: {
//     width: "100%",
//     height: 1,
//     backgroundColor: "#1a1a2e",
//     marginBottom: 5,
//   },

//   signatureName: {
//     fontSize: 8.5,
//     fontFamily: "Helvetica-Bold",
//     color: "#1a1a2e",
//     textAlign: "center",
//     marginBottom: 2,
//   },

//   signatureTitle: {
//     fontSize: 7,
//     color: "#6b7280",
//     textAlign: "center",
//     lineHeight: 1.6,
//   },

//   // ── Gold seal (center) ──
//   sealWrapper: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     width: "28%",
//   },

//   sealOuter: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: "#c8a535",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 6,
//   },

//   sealMiddle: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: "#f0c040",
//     border: "1.5px solid #a87d10",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   sealInner: {
//     width: 38,
//     height: 38,
//     borderRadius: 19,
//     backgroundColor: "#c8a535",
//     border: "1px solid #f0c040",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   sealStar: {
//     fontSize: 16,
//     color: "#ffffff",
//     textAlign: "center",
//   },

//   sealRibbon: {
//     fontSize: 7,
//     color: "#6b4e0a",
//     textAlign: "center",
//     fontFamily: "Helvetica-Bold",
//     letterSpacing: 1,
//   },

//   // ── Cert number bottom ──
//   certNumRow: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 8,
//     gap: 6,
//   },

//   certNumText: {
//     fontSize: 7,
//     color: "#9ca3af",
//     textAlign: "center",
//     letterSpacing: 1,
//   },

//   certNumValue: {
//     fontSize: 7,
//     color: "#c8a535",
//     fontFamily: "Helvetica-Bold",
//     letterSpacing: 1,
//   },
// });

// // ── Corner SVG as text ornament ───────────────────────────────
// function CornerMark({ style }: { style: object }) {
//   return (
//     <View style={style as any}>
//       <Text style={{ fontSize: 14, color: "#c8a535", lineHeight: 1 }}>✦</Text>
//     </View>
//   );
// }

// // ── Template ──────────────────────────────────────────────────
// export function CertificateTemplate({
//   studentName,
//   courseTitle,
//   issuedAt,
//   certificateNumber,
// }: {
//   studentName: string;
//   courseTitle: string;
//   issuedAt: Date;
//   certificateNumber: string;
// }) {
//   const logo1 = getImage("mdssc-logo.png");
//   const logo2 = getImage("charge-logo.png") ?? getImage("mdssc-logo.png");

//   const dateStr = issuedAt.toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   return (
//     <Document>
//       <Page size="A4" orientation="portrait" style={S.page}>
//         {/* ── Gold borders ── */}
//         <View style={S.outerBorder} />
//         <View style={S.innerBorder} />

//         {/* ── Corner marks ── */}
//         <CornerMark style={S.cornerTL} />
//         <CornerMark style={S.cornerTR} />
//         <CornerMark style={S.cornerBL} />
//         <CornerMark style={S.cornerBR} />

//         {/* ── Main content ── */}
//         <View style={S.content}>
//           {/* Logos row */}
//           <View style={S.logosRow}>
//             {logo1 && <Image src={logo1} style={S.logo} />}
//             <View style={S.orgNameCenter}>
//               <Text style={S.orgName}>
//                 Maharshi Dayanand Saraswati University
//               </Text>
//               <Text style={S.orgSub}>MDSU Skill & Career Hub — CHARGE</Text>
//             </View>
//             {logo2 && <Image src={logo2} style={S.logo} />}
//           </View>

//           {/* Gold bars */}
//           <View style={S.goldBar} />
//           <View style={S.thinBar} />

//           {/* Laurel / star ornament */}
//           <View style={S.ornamentRow}>
//             <View style={S.ornamentLine} />
//             <Text style={S.ornamentStar}>★</Text>
//             <View style={S.ornamentLine} />
//           </View>

//           {/* CERTIFICATE heading */}
//           <Text style={S.certTitle}>Certificate</Text>
//           <Text style={S.certSubtitle}>— of Completion —</Text>
//           <Text style={S.swirlText}>~ · ~</Text>

//           {/* Presented to */}
//           <Text style={S.presentedTo}>
//             This certificate is proudly presented to
//           </Text>

//           {/* Student name */}
//           <Text style={S.studentName}>{studentName}</Text>
//           <View style={S.nameUnderline} />
//           <View style={S.nameDot} />

//           {/* Body */}
//           <Text style={S.bodyText}>
//             For successfully completing the following course with dedication and
//             commitment
//           </Text>

//           {/* Course title */}
//           <Text style={S.courseTitle}>{courseTitle}</Text>

//           <Text style={S.bodyText}>
//             Completed on {dateStr} · MDSU Charge Platform
//           </Text>

//           <View style={S.thinBar} />
//           <View style={S.goldBar} />

//           {/* Seal + Signatures */}
//           <View style={S.bottomRow}>
//             {/* Signature 1 */}
//             <View style={S.signatureItem}>
//               <View style={S.signatureLine} />
//               <Text style={S.signatureName}>Prof. Suresh Kumar Agarwal</Text>
//               <Text style={S.signatureTitle}>
//                 {"Hon. Vice Chancellor\nMDSU Ajmer"}
//               </Text>
//             </View>

//             {/* Gold Seal (center) */}
//             <View style={S.sealWrapper}>
//               <View style={S.sealOuter}>
//                 <View style={S.sealMiddle}>
//                   <View style={S.sealInner}>
//                     <Text style={S.sealStar}>★</Text>
//                   </View>
//                 </View>
//               </View>
//               <Text style={S.sealRibbon}>OFFICIAL SEAL</Text>
//             </View>

//             {/* Signature 2 */}
//             <View style={S.signatureItem}>
//               <View style={S.signatureLine} />
//               <Text style={S.signatureName}>Prof. R.S. Choyal</Text>
//               <Text style={S.signatureTitle}>
//                 {"CMD, RS Choyal Group\nDirector — MDSSC"}
//               </Text>
//             </View>
//           </View>

//           {/* Certificate number */}
//           <View style={S.certNumRow}>
//             <Text style={S.certNumText}>Certificate No:</Text>
//             <Text style={S.certNumValue}>{certificateNumber}</Text>
//             <Text style={S.certNumText}>· Verified by MDSU Charge</Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// }

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import path from "path";
import fs from "fs";

function getImage(filename: string): string | null {
  try {
    const filePath = path.join(process.cwd(), "public", filename);
    const buffer = fs.readFileSync(filePath);
    const ext = filename.endsWith(".png") ? "png" : "jpeg";
    return `data:image/${ext};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

const S = StyleSheet.create({
  page: {
    backgroundColor: "#faf8f2",
    fontFamily: "Helvetica",
    padding: 0,
  },

  outerBorder: {
    position: "absolute",
    top: 18,
    left: 18,
    right: 18,
    bottom: 18,
    border: "2.5px solid #c8a535",
  },

  innerBorder: {
    position: "absolute",
    top: 26,
    left: 26,
    right: 26,
    bottom: 26,
    border: "1px solid #c8a535",
  },

  cornerTL: { position: "absolute", top: 12, left: 12 },
  cornerTR: { position: "absolute", top: 12, right: 12 },
  cornerBL: { position: "absolute", bottom: 12, left: 12 },
  cornerBR: { position: "absolute", bottom: 12, right: 12 },
  cornerText: { fontSize: 14, color: "#c8a535" },

  content: {
    position: "absolute",
    top: 34,
    left: 34,
    right: 34,
    bottom: 34,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 36,
    paddingVertical: 20,
  },

  // Logos
  logosRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  logo: { width: 65, height: 38, objectFit: "contain" },
  orgNameCenter: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  orgName: {
    fontSize: 8,
    color: "#6b4e0a",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  orgSub: {
    fontSize: 7,
    color: "#94763a",
    textAlign: "center",
    marginTop: 2,
  },

  // Dividers
  goldBar: {
    width: "100%",
    height: 1.5,
    backgroundColor: "#c8a535",
    marginVertical: 6,
  },
  thinBar: {
    width: "100%",
    height: 0.5,
    backgroundColor: "#d4b84a",
    marginVertical: 3,
  },

  // Ornament
  ornamentRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  ornamentLine: { flex: 1, height: 1, backgroundColor: "#c8a535" },
  ornamentStar: { fontSize: 13, color: "#c8a535", marginHorizontal: 6 },

  // Heading
  certTitle: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    letterSpacing: 5,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 3,
  },
  certSubtitle: {
    fontSize: 10,
    color: "#c8a535",
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  swirlText: { fontSize: 9, color: "#c8a535", textAlign: "center" },

  // Presented to
  presentedTo: {
    fontSize: 8,
    color: "#6b7280",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 5,
  },

  // Student name
  studentName: {
    fontSize: 30,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: 2,
    letterSpacing: 1,
  },
  nameUnderline: {
    width: 200,
    height: 1.5,
    backgroundColor: "#c8a535",
    marginBottom: 2,
  },
  nameDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#c8a535",
    marginBottom: 8,
  },

  // Body
  bodyText: {
    fontSize: 9,
    color: "#374151",
    textAlign: "center",
    lineHeight: 1.6,
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  courseTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 4,
    letterSpacing: 0.5,
  },

  // Bottom signatures + seal
  bottomRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 14,
  },
  signatureItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "35%",
  },
  signatureLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#1a1a2e",
    marginBottom: 4,
  },
  signatureName: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: 2,
  },
  signatureTitle: {
    fontSize: 7,
    color: "#6b7280",
    textAlign: "center",
    lineHeight: 1.5,
  },

  // Seal
  sealWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "28%",
  },
  sealOuter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#c8a535",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  sealMiddle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f0c040",
    border: "1.5px solid #a87d10",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sealInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#c8a535",
    border: "1px solid #f0c040",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sealStar: { fontSize: 14, color: "#ffffff", textAlign: "center" },
  sealRibbon: {
    fontSize: 7,
    color: "#6b4e0a",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },

  // Cert number
  certNumRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 4,
  },
  certNumText: { fontSize: 7, color: "#9ca3af", letterSpacing: 0.8 },
  certNumValue: {
    fontSize: 7,
    color: "#c8a535",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
});

export function CertificateTemplate({
  studentName,
  courseTitle,
  issuedAt,
  certificateNumber,
}: {
  studentName: string;
  courseTitle: string;
  issuedAt: Date;
  certificateNumber: string;
}) {
  const logo1 = getImage("mdssc-logo.png");
  const logo2 = getImage("charge-logo.png") ?? getImage("mdssc-logo.png");

  const dateStr = issuedAt.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={S.page}>
        {/* Borders */}
        <View style={S.outerBorder} />
        <View style={S.innerBorder} />

        {/* Corners */}
        <View style={S.cornerTL}>
          <Text style={S.cornerText}>✦</Text>
        </View>
        <View style={S.cornerTR}>
          <Text style={S.cornerText}>✦</Text>
        </View>
        <View style={S.cornerBL}>
          <Text style={S.cornerText}>✦</Text>
        </View>
        <View style={S.cornerBR}>
          <Text style={S.cornerText}>✦</Text>
        </View>

        {/* Content */}
        <View style={S.content}>
          {/* Logos */}
          <View style={S.logosRow}>
            {logo1 && <Image src={logo1} style={S.logo} />}
            <View style={S.orgNameCenter}>
              <Text style={S.orgName}>
                Maharshi Dayanand Saraswati University
              </Text>
              <Text style={S.orgSub}>MDSU Skill & Career Hub — CHARGE</Text>
            </View>
            {logo2 && <Image src={logo2} style={S.logo} />}
          </View>

          {/* Dividers */}
          <View style={S.goldBar} />
          <View style={S.thinBar} />

          {/* Star ornament */}
          <View style={S.ornamentRow}>
            <View style={S.ornamentLine} />
            <Text style={S.ornamentStar}>★</Text>
            <View style={S.ornamentLine} />
          </View>

          {/* Heading */}
          <Text style={S.certTitle}>Certificate</Text>
          <Text style={S.certSubtitle}>— of Completion —</Text>
          <Text style={S.swirlText}>~ · ~</Text>

          {/* Presented to */}
          <Text style={S.presentedTo}>
            This certificate is proudly presented to
          </Text>

          {/* Student name */}
          <Text style={S.studentName}>{studentName}</Text>
          <View style={S.nameUnderline} />
          <View style={S.nameDot} />

          {/* Body */}
          <Text style={S.bodyText}>
            For successfully completing the following course with dedication and
            commitment
          </Text>
          <Text style={S.courseTitle}>{courseTitle}</Text>
          <Text style={S.bodyText}>
            Completed on {dateStr} · MDSU Charge Platform
          </Text>

          {/* Dividers */}
          <View style={S.thinBar} />
          <View style={S.goldBar} />

          {/* Signatures + Seal — no auto margin, fixed marginTop */}
          <View style={S.bottomRow}>
            <View style={S.signatureItem}>
              <View style={S.signatureLine} />
              <Text style={S.signatureName}>Prof. Suresh Kumar Agarwal</Text>
              <Text style={S.signatureTitle}>
                {"Hon. Vice Chancellor\nMDSU Ajmer"}
              </Text>
            </View>

            <View style={S.sealWrapper}>
              <View style={S.sealOuter}>
                <View style={S.sealMiddle}>
                  <View style={S.sealInner}>
                    <Text style={S.sealStar}>★</Text>
                  </View>
                </View>
              </View>
              <Text style={S.sealRibbon}>OFFICIAL SEAL</Text>
            </View>

            <View style={S.signatureItem}>
              <View style={S.signatureLine} />
              <Text style={S.signatureName}>Prof. R.S. Choyal</Text>
              <Text style={S.signatureTitle}>
                {"CMD, RS Choyal Group\nDirector — MDSSC"}
              </Text>
            </View>
          </View>

          {/* Certificate number */}
          <View style={S.certNumRow}>
            <Text style={S.certNumText}>Certificate No:</Text>
            <Text style={S.certNumValue}>{certificateNumber}</Text>
            <Text style={S.certNumText}>· Verified by MDSU Charge</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
