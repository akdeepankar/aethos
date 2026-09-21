"use client";

import { useEffect, useRef, useState } from "react";

interface DynamicReportFrameProps {
  htmlContent: string;
  minHeight?: number;
}

export default function DynamicReportFrame({
  htmlContent,
  minHeight = 1000,
}: DynamicReportFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState<number>(minHeight);

  // Prepare iframe HTML with an embedded auto-resizer script and layout harmony styles
  const preparedHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* Ensure clean embed within dashboard cards */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      overflow-y: hidden !important;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .spectraa-deep-dive {
      max-width: 100% !important;
      margin: 0 auto !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }
    /* Responsive media & tables */
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    .table-wrap {
      overflow-x: auto !important;
    }
  </style>
</head>
<body>
  ${htmlContent}

  <script>
    (function() {
      function reportHeight() {
        try {
          var body = document.body;
          var html = document.documentElement;
          var height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
          );
          if (height > 0) {
            window.parent.postMessage({ type: 'AETHOS_DYNAMIC_FRAME_RESIZE', height: height }, '*');
          }
        } catch(e) {}
      }

      window.addEventListener('load', reportHeight);
      window.addEventListener('resize', reportHeight);
      
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function() {
          reportHeight();
        });
        ro.observe(document.body);
        ro.observe(document.documentElement);
      }

      // Check on periodic intervals as base64 images finish rendering
      var intervals = [50, 150, 300, 600, 1200, 2500, 5000];
      intervals.forEach(function(delay) {
        setTimeout(reportHeight, delay);
      });
    })();
  </script>
</body>
</html>
`;

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data &&
        event.data.type === "AETHOS_DYNAMIC_FRAME_RESIZE" &&
        typeof event.data.height === "number"
      ) {
        setFrameHeight(Math.max(event.data.height + 24, minHeight));
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [minHeight]);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        background: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={iframeRef}
        srcDoc={preparedHtml}
        style={{
          width: "100%",
          height: `${frameHeight}px`,
          border: "none",
          overflow: "hidden",
          display: "block",
          transition: "height 0.15s ease-out",
        }}
        title="Interactive Report"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
