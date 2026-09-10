"use client";

import { useState, useRef, useCallback } from "react";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/server/uploadthing";

const UploadButton = generateUploadButton<OurFileRouter>();

type UploadRoute = keyof OurFileRouter;
type FileType = "image" | "video" | "document";

const MAX_SIZE_LABEL: Record<string, string> = {
  courseThumbnailUploader: "4MB · JPG, PNG, WebP",
  coursePreviewVideoUploader: "256MB · MP4, WebM",
  lectureVideoUploader: "512MB · MP4, WebM",
  lectureDocumentUploader: "32MB · PDF",
  bannerImageUploader: "8MB · JPG, PNG, WebP",
  blogCoverUploader: "4MB · JPG, PNG, WebP",
  eventCoverUploader: "8MB · JPG, PNG, WebP",
  newsCoverUploader: "8MB · JPG, PNG, WebP",
  resumeUploader: "8MB · PDF only",
  companyLogoUploader: "2MB · JPG, PNG, WebP",
  udyamCertificateUploader: "4MB · PDF or Image",
};

export function UploadField({
  label,
  hint,
  endpoint,
  fileType,
  currentUrl,
  onUploadComplete,
  required,
}: {
  label: string;
  hint?: string;
  endpoint: UploadRoute;
  fileType: FileType;
  currentUrl: string;
  onUploadComplete: (url: string, key?: string) => void;
  required?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(currentUrl);

  function handleRemove() {
    setPreviewUrl("");
    onUploadComplete("", "");
    setError("");
  }

  const isImage = fileType === "image";
  const isVideo = fileType === "video";
  const isDocument = fileType === "document";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {/* Label */}
      <label
        style={{
          fontSize: "12.5px",
          fontWeight: 600,
          color: "#374151",
          display: "flex",
          gap: "4px",
        }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}>*</span>}
      </label>
      {hint && (
        <span
          style={{ fontSize: "11.5px", color: "#94a3b8", marginTop: "-2px" }}
        >
          {hint}
        </span>
      )}

      {/* Preview — agar file already uploaded hai */}
      {previewUrl && !uploading && (
        <div>
          {isImage && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: "200px",
                height: "112px",
                objectFit: "cover",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                display: "block",
              }}
            />
          )}
          {isVideo && (
            <div
              style={{
                width: "200px",
                height: "112px",
                background: "#0f172a",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                Video uploaded ✓
              </span>
            </div>
          )}
          {isDocument && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1d4ed8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span
                style={{ fontSize: "12px", color: "#475569", fontWeight: 600 }}
              >
                Document uploaded ✓
              </span>
            </div>
          )}

          {/* Replace / Remove */}
          <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
            <div>
              <UploadButton
                endpoint={endpoint}
                onUploadBegin={() => {
                  setUploading(true);
                  setError("");
                  setProgress(0);
                }}
                onUploadProgress={(p) => setProgress(p)}
                onClientUploadComplete={(res) => {
                  setUploading(false);
                  const file = res[0];
                  if (!file) return;
                  setPreviewUrl(file.url);
                  onUploadComplete(file.ufsUrl, file.key);
                }}
                onUploadError={(err) => {
                  setUploading(false);
                  setError(err.message ?? "Upload failed.");
                }}
                appearance={{
                  button: {
                    height: "30px",
                    padding: "0 12px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "7px",
                    background: "#fff",
                    fontSize: "11.5px",
                    fontWeight: 600,
                    color: "#475569",
                    cursor: "pointer",
                    width: "auto",
                  },
                  allowedContent: { display: "none" },
                }}
                content={{ button: "Replace" }}
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                height: "30px",
                padding: "0 12px",
                border: "1px solid #fecaca",
                borderRadius: "7px",
                background: "#fef2f2",
                fontSize: "11.5px",
                fontWeight: 600,
                color: "#ef4444",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {/* Upload area — file nahi hai ya upload ho raha hai */}
      {!previewUrl && (
        <div>
          {uploading ? (
            /* Progress bar */
            <div
              style={{
                border: "2px dashed #bfdbfe",
                borderRadius: "12px",
                padding: "24px 20px",
                background: "#f0f9ff",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#1d4ed8",
                  margin: "0 0 10px",
                }}
              >
                Uploading… {progress}%
              </p>
              <div
                style={{
                  height: "4px",
                  background: "#dbeafe",
                  borderRadius: "99px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "4px",
                    background: "#1d4ed8",
                    borderRadius: "99px",
                    width: `${progress}%`,
                    transition: "width 0.2s",
                  }}
                />
              </div>
            </div>
          ) : (
            /* Upload button styled as dropzone */
            <div
              style={{
                border: `2px dashed ${error ? "#fecaca" : "#bfdbfe"}`,
                borderRadius: "12px",
                background: error ? "#fef9f9" : "#f8fbff",
                textAlign: "center",
                overflow: "hidden",
              }}
            >
              <UploadButton
                endpoint={endpoint}
                onUploadBegin={() => {
                  setUploading(true);
                  setError("");
                  setProgress(0);
                }}
                onUploadProgress={(p) => setProgress(p)}
                onClientUploadComplete={(res) => {
                  setUploading(false);
                  const file = res[0];
                  if (!file) {
                    setError("Upload completed but no file returned.");
                    return;
                  }
                  setPreviewUrl(file.ufsUrl);
                  onUploadComplete(file.ufsUrl, file.key);
                }}
                onUploadError={(err) => {
                  setUploading(false);
                  setError(err.message ?? "Upload failed. Please try again.");
                }}
                appearance={{
                  button: {
                    width: "100%",
                    height: "auto",
                    padding: "24px 20px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    color: "#1d4ed8",
                    fontSize: "13px",
                    fontWeight: 600,
                    boxShadow: "none",
                  },
                  allowedContent: {
                    fontSize: "11.5px",
                    color: "#94a3b8",
                  },
                  container: {
                    width: "100%",
                  },
                }}
                content={{
                  button: (
                    <>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "10px",
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto",
                        }}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#1d4ed8"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      </div>
                      <span>Click to upload {label.toLowerCase()}</span>
                    </>
                  ),
                  allowedContent: MAX_SIZE_LABEL[endpoint as string] ?? "",
                }}
              />
            </div>
          )}
        </div>
      )}

      {error && (
        <p style={{ fontSize: "11.5px", color: "#ef4444", margin: "2px 0 0" }}>
          {error}
        </p>
      )}
    </div>
  );
}
