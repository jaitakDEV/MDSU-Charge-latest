import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/server/auth";

const f = createUploadthing();

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

async function requireCmsOrAdmin() {
  const user = await requireAuth();
  if (user.role !== "CMS_EDITOR" && user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
  return user;
}

export const ourFileRouter = {
  //V1 Profile picture
  profileImageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireAuth();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  //V3 Course thumbnail
  courseThumbnailUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireCmsOrAdmin();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  //V3 Course preview video (public teaser)
  coursePreviewVideoUploader: f({
    video: { maxFileSize: "256MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const user = await requireCmsOrAdmin();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  //V3 Lecture video
  lectureVideoUploader: f({ video: { maxFileSize: "512MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireCmsOrAdmin();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key };
    }),

  //V3 Lecture document (PDF/PPT)
  lectureDocumentUploader: f({ pdf: { maxFileSize: "32MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireCmsOrAdmin();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key };
    }),

  //V3 Certificate PDF
  // Server-generated only — no role check needed
  // Direct client upload nahi hoga — server action se call hoga
  certificateUploader: f({ pdf: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireAuth();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key };
    }),

  //V3 Blog cover image
  blogCoverUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireCmsOrAdmin();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  // V3 Banner image
  bannerImageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireCmsOrAdmin();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  // ── V4 — Event cover image ────────────────────────────────────
  eventCoverUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireCmsOrAdmin();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  // ── V4 — News article cover image ────────────────────────────
  newsCoverUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireCmsOrAdmin();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  // ── V5 — Student resume upload ────────────────────────────────
  resumeUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const user = await requireAuth();
      if (user.role !== "STUDENT") throw new Error("Forbidden");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key };
    }),

  // ── V5 — Company logo upload ──────────────────────────────────
  // companyLogoUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
  //   .middleware(async () => {
  //     const user = await requireAuth();
  //     if (user.role !== "JOB_PROVIDER") throw new Error("Forbidden");
  //     return { userId: user.id };
  //   })
  //   .onUploadComplete(async ({ file }) => {
  //     return { url: file.url };
  //   }),
  companyLogoUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) {
        return { userId: "pending-registration" };
      }
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),

  udyamCertificateUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url, key: file.key };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
