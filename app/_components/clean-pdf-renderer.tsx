"use client";

import React, { useEffect, useRef, useState } from "react";

interface CleanPdfRendererProps {
  pdfUrl: string;
  zoom?: number;
}

// PDF.js types definition
interface PDFPageViewport {
  width: number;
  height: number;
}

interface PDFPageProxy {
  getViewport(params: { scale: number }): PDFPageViewport;
  render(params: {
    canvasContext: CanvasRenderingContext2D;
    viewport: PDFPageViewport;
  }): { promise: Promise<void> };
}

interface PDFDocumentProxy {
  numPages: number;
  getPage(pageNumber: number): Promise<PDFPageProxy>;
}

interface PDFJSLib {
  GlobalWorkerOptions: {
    workerSrc: string;
  };
  getDocument(src: string): { promise: Promise<PDFDocumentProxy> };
}

function loadPdfJsScript(): Promise<PDFJSLib> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return;
    const win = window as unknown as { pdfjsLib?: PDFJSLib };
    if (win.pdfjsLib) {
      return resolve(win.pdfjsLib);
    }
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="pdf.min.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => {
        if (win.pdfjsLib) resolve(win.pdfjsLib);
        else reject(new Error("pdfjsLib not available"));
      });
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;
    script.onload = () => {
      if (win.pdfjsLib) {
        win.pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve(win.pdfjsLib);
      } else {
        reject(new Error("pdfjsLib failed to initialize"));
      }
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function CleanPdfRenderer({
  pdfUrl,
  zoom = 1.0,
}: CleanPdfRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderDocument() {
      try {
        setLoading(true);
        setError(null);

        const pdfjs = await loadPdfJsScript();
        const loadingTask = pdfjs.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;

        if (isCancelled) return;

        const container = containerRef.current;
        if (!container) return;
        container.innerHTML = "";

        const baseWidth = Math.min(container.clientWidth - 32, 860);
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (isCancelled) return;

          const page = await pdf.getPage(pageNum);
          const unscaledViewport = page.getViewport({ scale: 1 });
          const scale = (baseWidth / unscaledViewport.width) * zoom;
          const viewport = page.getViewport({ scale });

          // Paper Page Card
          const pageCard = document.createElement("div");
          pageCard.style.margin = "0 auto 28px auto";
          pageCard.style.background = "#ffffff";
          pageCard.style.borderRadius = "8px";
          pageCard.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.05)";
          pageCard.style.border = "1px solid #e5e7eb";
          pageCard.style.overflow = "hidden";
          pageCard.style.width = `${viewport.width}px`;
          pageCard.style.maxWidth = "100%";
          pageCard.style.position = "relative";

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;

          canvas.width = Math.floor(viewport.width * dpr);
          canvas.height = Math.floor(viewport.height * dpr);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          canvas.style.display = "block";

          context.scale(dpr, dpr);

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;

          // Page Number Indicator
          const pageFooter = document.createElement("div");
          pageFooter.style.padding = "6px 14px";
          pageFooter.style.fontSize = "11px";
          pageFooter.style.fontWeight = "600";
          pageFooter.style.color = "#6b7280";
          pageFooter.style.textAlign = "center";
          pageFooter.style.background = "#fafafa";
          pageFooter.style.borderTop = "1px solid #f3f4f6";
          pageFooter.textContent = `Page ${pageNum} of ${pdf.numPages}`;

          pageCard.appendChild(canvas);
          pageCard.appendChild(pageFooter);
          container.appendChild(pageCard);
        }

        setLoading(false);
      } catch (err) {
        if (!isCancelled) {
          console.error("PDF render error:", err);
          setError("Unable to render PDF preview directly.");
          setLoading(false);
        }
      }
    }

    renderDocument();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl, zoom]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "600px",
        background: "#ffffff",
        padding: "32px 24px",
        position: "relative",
      }}
    >
      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px 20px",
            color: "var(--muted)",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              border: "3px solid #e5e7eb",
              borderTopColor: "var(--ink)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: "13px", fontWeight: "600" }}>Rendering PDF pages...</span>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "36px",
            textAlign: "center",
            background: "#fef2f2",
            borderRadius: "8px",
            border: "1px solid #fecaca",
            color: "#991b1b",
            fontSize: "13px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <p style={{ margin: "0 0 12px", fontWeight: "600" }}>{error}</p>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "12px",
              fontWeight: "700",
              color: "#1d4ed8",
              textDecoration: "underline",
            }}
          >
            Download PDF directly
          </a>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      />
    </div>
  );
}
