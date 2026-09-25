"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export function DocumentViewer({
  documentUrl,
  onFullyRead,
}: {
  documentUrl: string;
  onFullyRead: () => void;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageWidth, setPageWidth] = useState<number>(700);
  const [loadError, setLoadError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setPageWidth(Math.min(containerRef.current.clientWidth - 32, 800));
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Scroll-to-bottom detect karo — tabhi complete mark karo
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || hasCompletedRef.current) return;

    const scrolledToBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 40; // 40px tolerance

    if (scrolledToBottom) {
      hasCompletedRef.current = true;
      onFullyRead();
    }
  }, [onFullyRead]);

  // Right-click disable — "Save image as" / context menu se bachne ke liye
  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
  }

  return (
    <div>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onContextMenu={handleContextMenu}
        style={{
          height: "600px",
          overflowY: "auto",
          background: "#f1f5f9",
          borderRadius: "14px",
          border: "1px solid #e2e8f0",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          userSelect: "none", // text copy-paste ke via bhi thoda friction
        }}
      >
        {loadError ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "#dc2626" }}>
              Document load nahi ho paaya. Please refresh karke try karo.
            </p>
          </div>
        ) : (
          <Document
            file={documentUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={() => setLoadError(true)}
            loading={
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ fontSize: "13px", color: "#64748b" }}>
                  Document load ho raha hai…
                </p>
              </div>
            }
          >
            {Array.from({ length: numPages }, (_, i) => (
              <div
                key={i}
                style={{
                  marginBottom: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Page
                  pageNumber={i + 1}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={true}
                />
              </div>
            ))}
          </Document>
        )}
      </div>

      <div
        style={{
          marginTop: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
          {numPages > 0 ? `${numPages} page${numPages > 1 ? "s" : ""}` : ""}
        </p>
        <p style={{ fontSize: "11.5px", color: "#94a3b8", margin: 0 }}>
          Scroll to the end to mark this lecture complete
        </p>
      </div>
    </div>
  );
}
