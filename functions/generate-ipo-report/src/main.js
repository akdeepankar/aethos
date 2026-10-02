const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const { Client, Storage, InputFile } = require("node-appwrite");

const EXACT_PROMPT_TEXT = `I'm uploading a DRHP/RHP for [COMPANY NAME]. Do a Fundamental + forensic IPO deep-dive covering business, financials, governance/red flags, offer structure and litigation. Use the RHP/DRHP as primary source, page-reference material claims, and separate document facts from inference/web research.

PART 1 — BUSINESS & INDUSTRY

1. Industry & Opportunity

* Explain industry, product/service, problem solved, end-use sectors and place in the value chain.
* Market size, CAGR, growth drivers and source report cited in the RHP.
* Identify structural tailwinds (import substitution, regulation, technology shift, customer capex etc.) and sense-check them against document data.

2. Competitive Moat

* Identify real barriers: certifications/approvals, patents/licences, qualification cycles, backward integration, exclusive agreements, scale/cost advantage, network effects or technical capability.
* Separate verifiable moats from generic claims such as brand, quality or experienced management.
* Cross-check moat/pricing-power claims against margins and market position.
* Mention domestic/global competitors and product/technology differentiation.

3. Segments / Products / Services

* Table all products/segments with revenue share and 3-year trend.
* State what is manufactured vs traded/distributed/job-work.
* Mention customer type, end-use industry, TAM and technology.
* State the customer names if available

4. Manufacturing & Capacity
   Table by plant/product:

* Location, ownership/lease, size and product.
* Installed capacity and utilization for all disclosed periods.
* Planned capacity, commissioning timeline, machinery/capability added, optimal utilization timeline and management commentary.
* Estimate peak revenue potential from new capacity where reasonably possible; clearly label assumptions.

5. Strategy & Forward Plans

* Summarize “Our Strategy” and grade items as concrete/funded vs generic.
* Cover new products, facilities, geographies, JVs, subsidiaries and ventures; distinguish committed projects from feasibility-stage plans.
* Highlight targeted approvals/certifications.

PART 2 — FINANCIAL ANALYSIS

6. Financial Trends
   Table 3 years + latest stub:

* Revenue, EBITDA, EBITDA margin, PAT, PAT margin, RoE/RoNW, RoCE.
Check if the PAT is inflated because of any one-off gains, or other income
* Explain whether growth/margin change is capacity-, utilization-, volume-, price- or operating-leverage-driven.
* Explain RoE/RoCE decline, including impact of bonus/pre-IPO equity/conversions.

Customer concentration:

* Top 1/5/10 customer % trend, geography trend, named clients, key wins/losses and RHP commentary.
* Customer added/lost metric over past years

Supplier concentration:

* Top 1/5/10 supplier % trend, geography trend, major dependencies and commentary.
* Which raw material is being imported and from which country, what is its total share of raw material, any risk highlighted by management

Employee/management:

* Employee-cost growth, headcount/attrition if disclosed, ESOP policy and promoter/KMP compensation trend.
* Recent key hires and notable independent directors.
* Recent resignation of Independent directors or any other KMP to be highlighted

7. Cash Flow Quality — Highest Priority
   Table:

* CFO vs EBITDA by year and CFO/EBITDA conversion.
* Net debt and Net Debt/EBITDA.
  Explain major profit/cash-flow divergence and stated reason.
  Flag rising receivables/inventory, falling payables or debt rising without utilization/demand support.
* EBITDA Margin trend vs Free cashflow and CFO trend over past 3 years - Priority table


* Receivable, inventory, payable days and working-capital cycle.
Highlight Receivable day spikes and comment on the ageing schedule (Debtors outstanding as % of revenue also)

Performance metrics:

* Table important RHP KPIs: retention/attrition, client additions, CAC, marketing spend, geography/customer wins, order book or other operating metrics.

8. Capacity vs Capex

* Cross-check capex timing against utilization/demand.
* State whether expansion appears demand-led/capacity-constrained or ahead of demonstrated demand.

9. Valuation
   Using upper price band - web search for price band

* Pre/post-issue P/E and Price/Book.
* Compare with RHP peer set; explain comparability limits.
* If no listed peers exist, say so.
* List pre-IPO placements/fundraises in last 12 months: date, investor, price and implied valuation.

PART 3 — OFFER STRUCTURE

10. Issue Structure & Use of Proceeds

* Fresh Issue vs OFS and % split.
* Table Fresh Issue use: capex, debt repayment, working capital, acquisition, GCP etc., with ₹ and % of gross fresh proceeds.
* Flag high-OFS/low-fresh-issue/full-valuation structures.

* Notable Anchor Investors names to be mentioned post web search

11. Shareholding & Lock-in

* Promoter holding pre/post issue; quantify dilution.
* Promoter lock-in: % for 18 months vs 6 months and likely sell-down flexibility.

PART 4 — GOVERNANCE / RELATED-PARTY FORENSICS (Key or important redflags needs to dig deeper and details reported

12. Promoter-Entity Acquisitions
    Search for businesses/subsidiaries acquired from promoters/promoter entities in prior 1-2 years:

* Date, consideration, valuation basis/valuer and funding method.
* Compute implied purchase multiple where possible and compare with IPO valuation.

13. Competing Promoter Entities / Non-compete

* List promoter-group entities in similar businesses.
* Identify which are/aren’t covered by non-compete.
* Check wider related-party disclosures, not only formally classified “Group Companies.”

14. Property / Title Issues

* List operating land/buildings not in company name, value if disclosed, owner, related-party connection and operational importance.

15. Unrelated Subsidiaries

* Flag non-core subsidiaries; explain purpose, financial health and loans/guarantees.

16. Auditor / CARO

* Pull every negative CARO clause, qualification and emphasis-of-matter across all disclosed years.
* Highlight recurring issues such as stock-statement mismatches, fund diversion, statutory delays or Sections 185/186 issues.

17. Promoter / KMP Background

* Director disqualifications, struck-off links, qualification issues, unusual remuneration or other material issues.

18. Promoter-Group Disclosure Issues

* Check for estranged/untraceable promoter-group members, SEBI exemption requests/rejections or disclosure gaps.

19. Pre-IPO Timing Patterns

    Flag transactions close to filing: trademarks, leases, non-competes, bonus issues, allotments, acquisitions, restructurings or related-party cleanup.

PART 5 — LITIGATION

20. Litigation

    Table by company/promoter/director/subsidiary and criminal/civil/tax/regulatory:

* Case count, aggregate amount, nature/status.
* Separate cases filed BY the company from cases AGAINST it.
* Highlight fraud, regulatory, criminal or continuity risk.

PART 6 — OTHER REQUIRED CHECKS

* Recent fundraising/QIB/pre-IPO investor details.
* Web-search the IPO Anchor Book and mention key institutional investors; label web-sourced information.

OUTPUT — WORD DOCUMENT

Style:

* Navy/copper theme; navy section headers, copper sub-headings.


Use actual tables for:

* Financial trends
* Product/segment mix
* Capacity/utilization
* Working-capital days/cash conversion
* Customer/supplier concentration
* Use of proceeds
* Litigation
* Performance metrics

Close with:

1. “What Looks Genuinely Strong” — specific positives, not a one-sided bear case.
2. “Consolidated Question List” — direct skeptical management-call questions grouped by business, financials, cash flow, capex, governance, valuation and litigation.

Rules:

* Page-reference every material RHP/DRHP fact.
* Never invent missing data; state “not disclosed.”
* Show calculations/assumptions clearly.
* Prefer tables and concise analysis over long prose.
* Challenge management/RHP claims using internal document evidence.
* Use web research only where requested/materially useful and label it separately.`;

module.exports = async ({ req, res, log, error }) => {
  const endpoint = process.env.APPWRITE_FUNCTION_ENDPOINT || process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID || process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
  const apiKey = process.env.APPWRITE_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const bucketId = process.env.APPWRITE_BUCKET_ID || "aethos_pdfs";

  let bodyData = {};
  try {
    if (req.bodyRaw) {
      bodyData = JSON.parse(req.bodyRaw);
    } else if (req.body) {
      bodyData = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    }
  } catch {}

  const company = bodyData.company || bodyData.name || "Active IPO Focus Company";
  const symbol = bodyData.symbol || bodyData.ticker || "IPO";
  const slug = (bodyData.slug || symbol || company)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const sector = bodyData.sector || "Mainboard & SME Capital Markets";
  const price = bodyData.price || bodyData.issue_price || "Market Band";
  const period = bodyData.period || bodyData.bidding_start_date || "Current Bidding Schedule";

  log(`[Generate Deep Dive Report] Executing OpenAI GPT using exact prompt from IPO Deep dive prompt.txt for: ${company} (${slug})`);

  let generatedHtml = "";

  if (!openaiApiKey) {
    error("OPENAI_API_KEY environment variable is not configured.");
    return res.json({
      success: false,
      error: "OPENAI_API_KEY environment variable is not configured.",
    });
  }

  // Use uploaded VANS PDF reference file ID from OpenAI Files API
  let referenceFileId = process.env.OPENAI_VANS_FILE_ID || global.cachedVansFileId || "file-1D7Lccr3m5yHWx1Jr2brRB";
  const pdfFilePath = path.join(process.cwd(), "public", "VANS_Electroengineerings_IPO_Deep_Dive.pdf");

  if (!referenceFileId && fs.existsSync(pdfFilePath)) {
    try {
      log(`Uploading reference PDF asset ${pdfFilePath} to OpenAI Files API...`);
      const form = new FormData();
      form.append("purpose", "user_data");
      form.append("file", fs.createReadStream(pdfFilePath), "VANS_Electroengineerings_IPO_Deep_Dive.pdf");

      const fileUploadRes = await fetch("https://api.openai.com/v1/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          ...form.getHeaders(),
        },
        body: form,
      });

      if (fileUploadRes.ok) {
        const fileJson = await fileUploadRes.json();
        referenceFileId = fileJson.id;
        global.cachedVansFileId = referenceFileId;
        log(`Successfully uploaded & cached OpenAI File reference ID: ${referenceFileId}`);
      } else {
        const fileErrText = await fileUploadRes.text();
        log(`Notice: OpenAI Files API response (${fileUploadRes.status}): ${fileErrText}`);
      }
    } catch (fileErr) {
      log(`Notice: Could not attach reference PDF via Files API: ${fileErr.message}`);
    }
  }

  const systemInstruction = EXACT_PROMPT_TEXT.replace("[COMPANY NAME]", company).replace("[NAME]", company);

  const userPromptText = `Company: "${company}"
Ticker Symbol: "${symbol}"
Sector: "${sector}"
Price Band: "${price}"
Bidding Period: "${period}"
Reference Benchmark File ID: ${referenceFileId || "file-1D7Lccr3m5yHWx1Jr2brRB"}

CRITICAL REQUIREMENT - EXHAUSTIVE DEEP DIVE REPORT:
Generate an exhaustive, highly detailed institutional IPO research report matching the 20+ page depth and granular analytical framework of the reference benchmark document (VANS Electroengineerings IPO Deep Dive).

Cover every single section (Parts 1 through 6) in maximum depth:
- Include full multi-year financial tables, segment breakdowns, manufacturing facility details, customer/supplier concentration, cash flow conversion metrics, related-party forensic audits, CARO qualification analysis, litigation breakdown, and a comprehensive 20+ skeptical management Q&A list.
- Do NOT abbreviate, truncate, or summarize any part. Provide full institutional prose and detailed tabular data.`;

  try {
    const userMessageContent = referenceFileId
      ? [
          { type: "text", text: userPromptText },
          { type: "file", file: { file_id: referenceFileId } }
        ]
      : userPromptText;

    const gptRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-6-sol",
        reasoning_effort: "high",
        messages: [
          { role: "developer", content: systemInstruction },
          { role: "user", content: userMessageContent },
        ],
        max_completion_tokens: 16384,
      }),
    });

    if (gptRes.ok) {
      const gptJson = await gptRes.json();
      generatedHtml = gptJson.choices?.[0]?.message?.content || "";
      generatedHtml = generatedHtml.replace(/^```html\s*/i, "").replace(/```\s*$/i, "").trim();
    } else {
      const errText = await gptRes.text();
      error(`OpenAI API error (${gptRes.status}): ${errText}`);
      return res.json({
        success: false,
        error: `OpenAI API error (${gptRes.status}): ${errText}`,
      });
    }
  } catch (openAiErr) {
    error(`OpenAI request exception: ${openAiErr.message}`);
    return res.json({
      success: false,
      error: `OpenAI request exception: ${openAiErr.message}`,
    });
  }

  // Generate institutional PDF document using pdf-lib from OpenAI generated content
  let pdfUrl = `/${slug}.pdf`;
  let pdfBuffer = null;

  try {
    const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
    const pdfDoc = await PDFDocument.create();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
    const { width, height } = page.getSize();
    let y = height - 40;

    // Helper to sanitize non-WinAnsi characters (e.g. ₹ rupee symbol -> Rs.)
    const cleanText = (str) => {
      if (!str) return "";
      return String(str)
        .replace(/₹/g, "Rs. ")
        .replace(/–|—/g, "-")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/[^\x00-\x7F]/g, "");
    };

    const checkNewPage = (neededSpace = 25) => {
      if (y < 45 + neededSpace) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - 45;
      }
    };

    // Helper for section headers (Navy background)
    const drawHeader = (text) => {
      checkNewPage(35);
      page.drawRectangle({
        x: 35,
        y: y - 22,
        width: width - 70,
        height: 26,
        color: rgb(0.06, 0.09, 0.16), // Navy #0f172a
      });
      page.drawText(cleanText(text).toUpperCase(), {
        x: 45,
        y: y - 15,
        size: 11.5,
        font: fontBold,
        color: rgb(1, 1, 1),
      });
      y -= 36;
    };

    // Helper for sub-headers (Copper text)
    const drawSubHeader = (text) => {
      checkNewPage(24);
      page.drawText(cleanText(text), {
        x: 40,
        y,
        size: 11,
        font: fontBold,
        color: rgb(0.7, 0.32, 0.04), // Copper #b45309
      });
      y -= 18;
    };

    // Helper for paragraphs with text wrapping
    const drawParagraph = (rawText, isBold = false, fontSize = 9.5, color = rgb(0.1, 0.1, 0.15)) => {
      const font = isBold ? fontBold : fontRegular;
      const margin = 40;
      const maxWidth = width - margin * 2;
      const text = cleanText(rawText);
      if (!text) return;

      const words = text.split(" ");
      let currentLine = "";

      for (let word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > maxWidth) {
          checkNewPage(fontSize + 6);
          page.drawText(currentLine, { x: margin, y, size: fontSize, font, color });
          y -= fontSize + 5;
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        checkNewPage(fontSize + 6);
        page.drawText(currentLine, { x: margin, y, size: fontSize, font, color });
        y -= fontSize + 6;
      }
    };

    // Header Title Banner
    drawHeader(`INSTITUTIONAL IPO DEEP DIVE REPORT: ${company}`);
    drawParagraph(`Ticker Symbol: ${symbol}  |  Sector: ${sector}`, true, 10, rgb(0.7, 0.32, 0.04));
    drawParagraph(`Price Band: ${price}  |  Bidding Period: ${period}`, false, 9.5, rgb(0.3, 0.3, 0.35));
    y -= 10;

    // Convert generated HTML/markdown into clean structured blocks for PDF rendering
    const cleanBlocks = generatedHtml
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n# $1\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n## $1\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n\n### $1\n")
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n\n#### $1\n")
      .replace(/<tr[^>]*>/gi, "\nTR:")
      .replace(/<\/td>|<\/th>/gi, " | ")
      .replace(/<li[^>]*>(.*?)<\/li>/gi, "\n• $1")
      .replace(/<p[^>]*>(.*?)<\/p>/gi, "\n$1\n")
      .replace(/<[^>]+>/g, "")
      .split("\n");

    for (let line of cleanBlocks) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith("# ") || trimmed.startsWith("## ")) {
        drawHeader(trimmed.replace(/^#+\s*/, ""));
      } else if (trimmed.startsWith("### ") || trimmed.startsWith("#### ")) {
        drawSubHeader(trimmed.replace(/^#+\s*/, ""));
      } else if (trimmed.startsWith("TR:")) {
        const rowText = trimmed.replace(/^TR:\s*/, "").replace(/\|\s*$/, "");
        drawParagraph(rowText, false, 8.5, rgb(0.2, 0.25, 0.35));
      } else if (trimmed.startsWith("•")) {
        drawParagraph(trimmed, false, 9, rgb(0.1, 0.1, 0.15));
      } else {
        drawParagraph(trimmed, false, 9.5, rgb(0.1, 0.1, 0.15));
      }
    }

    pdfBuffer = Buffer.from(await pdfDoc.save());
    log(`Successfully generated institutional PDF report (${pdfBuffer.length} bytes) for ${company}`);
  } catch (pdfErr) {
    error(`Error generating PDF with pdf-lib: ${pdfErr.message}`);
  }

  // Upload PDF to Appwrite Storage Bucket
  if (apiKey) {
    try {
      const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
      const storage = new Storage(client);

      // Upload PDF file with cache-busting unique ID
      if (pdfBuffer) {
        const timestampToken = Date.now().toString(36);
        const pdfFileId = `${slug}-${timestampToken}`.slice(0, 36);

        await storage.createFile(
          bucketId,
          pdfFileId,
          InputFile.fromBuffer(pdfBuffer, `${slug}.pdf`)
        );
        pdfUrl = `${endpoint}/storage/buckets/${bucketId}/files/${pdfFileId}/view?project=${projectId}`;
        log(`Successfully uploaded generated PDF report to Appwrite Storage: ${pdfUrl}`);
      }
    } catch (uploadErr) {
      error(`Error uploading report PDF file to Appwrite Storage: ${uploadErr.message}`);
    }
  }

  return res.json({
    success: true,
    slug,
    company,
    pdfUrl,
  });
};

