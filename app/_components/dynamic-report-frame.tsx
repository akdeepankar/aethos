"use client";

import { useEffect, useRef, useState } from "react";

interface DynamicReportFrameProps {
  htmlContent: string;
  minHeight?: number;
  zoom?: number;
}

export default function DynamicReportFrame({
  htmlContent,
  minHeight = 400,
  zoom = 1.0,
}: DynamicReportFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [frameHeight, setFrameHeight] = useState<number>(minHeight);

  // Prepare iframe HTML with precise auto-resizer script, robust table format, and proper padding
  const preparedHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    *, *::before, *::after {
      box-sizing: border-box !important;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      height: auto !important;
      min-height: 0 !important;
      background: #ffffff !important;
      overflow-y: hidden !important;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #172033;
      line-height: 1.65;
      zoom: ${zoom};
      transition: zoom 0.15s ease-out;
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
      .aw-report {
        padding: 18px 20px 36px 20px !important;
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

  <script>
    (function() {
      function reportHeight() {
        try {
          var wrapper = document.querySelector('.aw-report') || 
                        document.querySelector('.report-wrap') || 
                        document.querySelector('.spectraa-deep-dive') || 
                        document.body;
          var height = Math.ceil(wrapper.getBoundingClientRect().height || wrapper.scrollHeight || document.body.scrollHeight);
          if (height > 0) {
            window.parent.postMessage({ type: 'AETHOS_DYNAMIC_FRAME_RESIZE', height: height }, '*');
          }
        } catch(e) {}
      }

      window.addEventListener('load', reportHeight);
      window.addEventListener('resize', reportHeight);

      window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'AETHOS_SET_ZOOM' && typeof e.data.zoom === 'number') {
          document.body.style.zoom = e.data.zoom;
          setTimeout(reportHeight, 50);
          setTimeout(reportHeight, 200);
        }
      });
      
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(function() {
          reportHeight();
        });
        ro.observe(document.body);
      }

      var intervals = [50, 150, 300, 600, 1200, 2000];
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
        typeof event.data.height === "number" &&
        event.data.height > 0
      ) {
        setFrameHeight(event.data.height);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
          transition: "height 0.1s ease-out",
        }}
        title="Interactive Report"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
}
