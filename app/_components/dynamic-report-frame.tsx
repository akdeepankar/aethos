"use client";

import { useEffect, useRef } from "react";

interface DynamicReportFrameProps {
  htmlContent: string;
  height?: string | number;
  minHeight?: string | number;
  zoom?: number;
  style?: React.CSSProperties;
}

export default function DynamicReportFrame({
  htmlContent,
  height = "calc(100vh - 130px)",
  minHeight = 600,
  zoom = 1.0,
  style,
}: DynamicReportFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isFullHtml = /<!DOCTYPE|<html/i.test(htmlContent);

  const zoomScript = `
  <script>
    (function() {
      window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'AETHOS_SET_ZOOM' && typeof e.data.zoom === 'number') {
          document.body.style.zoom = e.data.zoom;
        }
      });
    })();
  </script>`;

  const internalScrollCss = `
  <style>
    html, body {
      height: 100% !important;
      min-height: 100% !important;
      margin: 0 !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      -webkit-overflow-scrolling: touch !important;
    }
  </style>`;

  let preparedHtml = "";
  if (isFullHtml) {
    if (htmlContent.includes("</head>")) {
      preparedHtml = htmlContent.replace("</head>", `${internalScrollCss}</head>`);
    } else {
      preparedHtml = internalScrollCss + htmlContent;
    }

    if (preparedHtml.includes("</body>")) {
      preparedHtml = preparedHtml.replace("</body>", `${zoomScript}</body>`);
    } else if (preparedHtml.includes("</html>")) {
      preparedHtml = preparedHtml.replace("</html>", `${zoomScript}</html>`);
    } else {
      preparedHtml = preparedHtml + zoomScript;
    }
  } else {
    preparedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${internalScrollCss}
  <style>
    *, *::before, *::after {
      box-sizing: border-box !important;
    }
    body {
      padding: 0 !important;
      background: #ffffff !important;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #172033;
      line-height: 1.65;
      zoom: ${zoom};
      transition: zoom 0.15s ease-out;
    }
    .report-container, .report-content {
      max-width: 100% !important;
      margin: 0 auto !important;
      padding: 24px 28px !important;
    }
    .spectraa-deep-dive {
      max-width: 100% !important;
      margin: 0 auto !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }
    .aw-report {
      max-width: 100% !important;
      margin: 0 auto !important;
      padding: 32px 40px 56px 40px !important;
    }
    @media (max-width: 768px) {
      .aw-report, .report-container, .report-content {
        padding: 16px 16px 28px 16px !important;
      }
    }
    /* Proper Table Formatting */
    table, .aw-table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 20px 0 28px !important;
      font-size: 13.5px !important;
      background: #ffffff !important;
      border: 1px solid #d0d5dd !important;
      border-radius: 8px !important;
      overflow: hidden !important;
      box-shadow: 0 1px 3px rgba(16, 24, 40, 0.05) !important;
    }
    thead th, .aw-table th, th {
      padding: 12px 16px !important;
      background: #172033 !important;
      color: #ffffff !important;
      text-align: left !important;
      font-size: 11.5px !important;
      font-weight: 700 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.05em !important;
      border: none !important;
    }
    tbody td, .aw-table td, td {
      padding: 12px 16px !important;
      border-top: 1px solid #eaecf0 !important;
      border-bottom: none !important;
      border-left: none !important;
      border-right: none !important;
      color: #344054 !important;
      vertical-align: top !important;
      line-height: 1.55 !important;
    }
    tbody tr:nth-child(even), .aw-table tr:nth-child(even) td {
      background: #f8fafc !important;
    }
    tbody tr:hover td {
      background: #f2f4f7 !important;
    }
    .table-wrap {
      overflow-x: auto !important;
    }
    /* Responsive media */
    img {
      max-width: 100% !important;
      height: auto !important;
    }
  </style>
</head>
<body>
  ${htmlContent}
  ${zoomScript}
</body>
</html>`;
  }

  // Update zoom dynamically via postMessage without re-rendering the whole iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          { type: "AETHOS_SET_ZOOM", zoom: zoom },
          "*"
        );
      } catch {
        // ignore cross-origin error if any
      }
    }
  }, [zoom]);

  const resolvedHeight = typeof height === "number" ? `${height}px` : height;
  const resolvedMinHeight = typeof minHeight === "number" ? `${minHeight}px` : minHeight;

  return (
    <div
      style={{
        width: "100%",
        height: resolvedHeight,
        minHeight: resolvedMinHeight,
        position: "relative",
        background: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        ...style,
      }}
    >
      <iframe
        ref={iframeRef}
        srcDoc={preparedHtml}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
          border: "none",
          display: "block",
        }}
        title="Interactive Report"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
