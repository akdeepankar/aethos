import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const UPSTOX_BASE = "https://api.upstox.com/v2/ipos";
const STATUSES = ["open", "upcoming", "closed", "listed"] as const;

type UpstoxListItem = {
  id?: string;
  symbol?: string | null;
  name?: string | null;
};

type UpstoxListResponse = {
  status?: string;
  data?: UpstoxListItem[];
  meta_data?: { page?: { total_pages?: number } };
};

type UpstoxDetailResponse = {
  status?: string;
  data?: Record<string, unknown> & { id?: string };
};

class UpstoxAuthError extends Error {}

function normalize(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

async function getJson<T>(url: string, token: string): Promise<T | null> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as T | null;
  if (res.status === 401 || res.status === 403) {
    throw new UpstoxAuthError(
      `Upstox rejected the access token (${res.status}). Set a valid UPSTOX_ACCESS_TOKEN in this environment.`
    );
  }
  if (!res.ok) {
    console.error(
      `[upstox/ipo] Upstox request failed (${res.status}) for ${url.replace(UPSTOX_BASE, "")}`
    );
    return null;
  }
  return json;
}

async function fetchDetail(id: string, token: string) {
  const json = await getJson<UpstoxDetailResponse>(
    `${UPSTOX_BASE}/${encodeURIComponent(id)}`,
    token
  );
  if (json?.status !== "success" || !json.data) return null;
  return json.data;
}

async function findIpoId(
  token: string,
  params: { id?: string | null; slug?: string | null; symbol?: string | null; name?: string | null }
) {
  const directCandidates = [params.id, params.slug].filter(Boolean) as string[];
  for (const candidate of directCandidates) {
    const detail = await fetchDetail(candidate, token);
    if (detail?.id) return detail.id;
  }

  const needles = [params.id, params.slug, params.symbol, params.name]
    .filter(Boolean)
    .map(normalize)
    .filter(Boolean);

  if (needles.length === 0) return null;

  const lists = await Promise.all(
    STATUSES.map(async (status) => {
      const pages = status === "listed" ? 2 : 1;
      const items: UpstoxListItem[] = [];
      for (let page = 1; page <= pages; page++) {
        const json = await getJson<UpstoxListResponse>(
          `${UPSTOX_BASE}?status=${status}&page_number=${page}`,
          token
        );
        const data = Array.isArray(json?.data) ? json.data : [];
        items.push(...data);
        const totalPages = json?.meta_data?.page?.total_pages ?? 0;
        if (page >= totalPages || data.length === 0) break;
      }
      return items;
    })
  );

  const match = lists.flat().find((item) => {
    const values = [item.id, item.symbol, item.name].map(normalize).filter(Boolean);
    return needles.some((needle) =>
      values.some((value) => value === needle || value.includes(needle) || needle.includes(value))
    );
  });

  return match?.id ?? null;
}

export async function GET(req: NextRequest) {
  const token = process.env.UPSTOX_ACCESS_TOKEN;
  if (!token) {
    console.error("[upstox/ipo] UPSTOX_ACCESS_TOKEN is not configured in this environment");
    return NextResponse.json(
      { success: false, error: "UPSTOX_ACCESS_TOKEN is not configured in this environment" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const slug = searchParams.get("slug");
  const symbol = searchParams.get("symbol");
  const name = searchParams.get("name");

  if (!id && !slug && !symbol && !name) {
    return NextResponse.json(
      { success: false, error: "Provide an id, slug, symbol, or name" },
      { status: 400 }
    );
  }

  try {
    const resolvedId = await findIpoId(token, { id, slug, symbol, name });
    if (!resolvedId) {
      return NextResponse.json(
        { success: false, error: "IPO not found on Upstox" },
        { status: 404 }
      );
    }

    const detail = await fetchDetail(resolvedId, token);
    if (!detail) {
      return NextResponse.json(
        { success: false, error: "Could not load IPO details from Upstox" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, data: detail });
  } catch (err) {
    if (err instanceof UpstoxAuthError) {
      console.error("[upstox/ipo]", err.message);
      return NextResponse.json({ success: false, error: err.message }, { status: 502 });
    }
    console.error("[upstox/ipo] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected error loading IPO details from Upstox" },
      { status: 500 }
    );
  }
}
