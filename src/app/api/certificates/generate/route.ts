// import { NextResponse } from "next/server";
// import { requireAuth } from "@/server/api-guard";
// import { db } from "@/server/db";
// import { apiError, apiSuccess } from "@/lib/utils";
// import { renderToBuffer } from "@react-pdf/renderer";
// import { CertificateTemplate } from "@/lib/certificate-utils";
// import { UTApi } from "uploadthing/server";
// import React from "react";
// import { Document } from "@react-pdf/renderer";

// const utapi = new UTApi();

// export async function POST(req: Request) {
//   try {
//     const guard = await requireAuth();
//     if (!guard.ok) return guard.response;

//     const { userId, courseId } = await req.json();

//     // Security — sirf apna certificate generate kar sakte ho
//     if (guard.userId !== userId && guard.role !== "ADMIN") {
//       return NextResponse.json(apiError("Forbidden."), { status: 403 });
//     }

//     const cert = await db.certificate.findUnique({
//       where: { userId_courseId: { userId, courseId } },
//       select: {
//         id: true,
//         studentName: true,
//         courseTitle: true,
//         certificateNumber: true,
//         issuedAt: true,
//         pdfUrl: true,
//       },
//     });

//     if (!cert) {
//       return NextResponse.json(apiError("Certificate not found."), {
//         status: 404,
//       });
//     }

//     // Already generated
//     if (cert.pdfUrl) {
//       return NextResponse.json(apiSuccess({ url: cert.pdfUrl }));
//     }

//     // ── Generate PDF ───────────────────────────────────────
//     const pdfBuffer = await renderToBuffer(
//       React.createElement(CertificateTemplate, {
//         studentName: cert.studentName,
//         courseTitle: cert.courseTitle,
//         issuedAt: cert.issuedAt,
//         certificateNumber: cert.certificateNumber,
//       }) as React.ReactElement<React.ComponentProps<typeof Document>>,
//     );

//     // ── Upload to UploadThing ──────────────────────────────
//     const filename = `certificate-${cert.certificateNumber}.pdf`;
//     const blob = new Blob([new Uint8Array(pdfBuffer)], {
//       type: "application/pdf",
//     });
//     const file = new File([blob], filename, { type: "application/pdf" });

//     const uploaded = await utapi.uploadFiles(file);

//     if (!uploaded.data?.url) {
//       throw new Error("UploadThing upload failed.");
//     }

//     // ── Save URL to DB ────────────────────────────────────
//     await db.certificate.update({
//       where: { id: cert.id },
//       data: { pdfUrl: uploaded.data.url },
//     });

//     return NextResponse.json(apiSuccess({ url: uploaded.data.url }));
//   } catch (error) {
//     console.error("[CERT_GENERATE]", error);
//     return NextResponse.json(apiError("Failed to generate certificate."), {
//       status: 500,
//     });
//   }
// }

import { NextResponse } from "next/server";
import { requireAuth } from "@/server/api-guard";
import { db } from "@/server/db";
import { apiError, apiSuccess } from "@/lib/utils";
import { renderToBuffer } from "@react-pdf/renderer";
import { CertificateTemplate } from "@/lib/certificate-utils";
import { UTApi } from "uploadthing/server";
import React from "react";
import { Document } from "@react-pdf/renderer";

const utapi = new UTApi();

export async function POST(req: Request) {
  try {
    const guard = await requireAuth();
    if (!guard.ok) return guard.response;

    const { userId, courseId } = await req.json();

    if (guard.userId !== userId && guard.role !== "ADMIN") {
      return NextResponse.json(apiError("Forbidden."), { status: 403 });
    }

    const cert = await db.certificate.findUnique({
      where: { userId_courseId: { userId, courseId } },
      select: {
        id: true,
        studentName: true,
        courseTitle: true,
        certificateNumber: true,
        issuedAt: true,
        pdfUrl: true,
      },
    });

    if (!cert) {
      return NextResponse.json(apiError("Certificate not found."), {
        status: 404,
      });
    }

    if (cert.pdfUrl) {
      return NextResponse.json(apiSuccess({ url: cert.pdfUrl }));
    }

    const pdfBuffer = await renderToBuffer(
      React.createElement(CertificateTemplate, {
        studentName: cert.studentName,
        courseTitle: cert.courseTitle,
        issuedAt: cert.issuedAt,
        certificateNumber: cert.certificateNumber,
      }) as React.ReactElement<React.ComponentProps<typeof Document>>,
    );

    const filename = `certificate-${cert.certificateNumber}.pdf`;
    const blob = new Blob([new Uint8Array(pdfBuffer)], {
      type: "application/pdf",
    });
    const file = new File([blob], filename, { type: "application/pdf" });

    const uploaded = await utapi.uploadFiles(file);

    console.log("[CERT_UPLOAD_RESULT]", JSON.stringify(uploaded, null, 2));

    if (uploaded.error) {
      console.error("[CERT_UPLOAD_ERROR]", uploaded.error);
      return NextResponse.json(
        apiError(`Upload failed: ${uploaded.error.message}`),
        { status: 500 },
      );
    }

    if (!uploaded.data?.url) {
      return NextResponse.json(
        apiError("Upload failed: no URL returned from UploadThing."),
        { status: 500 },
      );
    }

    await db.certificate.update({
      where: { id: cert.id },
      data: { pdfUrl: uploaded.data.url },
    });

    return NextResponse.json(apiSuccess({ url: uploaded.data.url }));
  } catch (error) {
    console.error("[CERT_GENERATE]", error);
    return NextResponse.json(apiError("Failed to generate certificate."), {
      status: 500,
    });
  }
}
