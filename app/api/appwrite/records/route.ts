import { NextRequest, NextResponse } from "next/server";
import { Client, TablesDB, Databases } from "node-appwrite";

function getAppwriteClient() {
  const apiKey = process.env.APPWRITE_API_KEY;
  const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
  const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";

  if (!apiKey) {
    throw new Error("Missing APPWRITE_API_KEY in environment");
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const tablesDB = new TablesDB(client);
  const databases = new Databases(client);

  return { tablesDB, databases, databaseId: process.env.APPWRITE_DATABASE_ID || "aethos_db" };
}

// GET /api/appwrite/records?table=reports
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const { tablesDB, databaseId } = getAppwriteClient();

    if (table) {
      const res = await tablesDB.listRows(databaseId, table);
      return NextResponse.json({ success: true, table, total: res.total, rows: res.rows });
    }

    // Return overview of all tables
    const allTables = ["reports", "ideas", "ipos", "journal", "users_meta"];
    const results: Record<string, unknown> = {};

    for (const t of allTables) {
      try {
        const res = await tablesDB.listRows(databaseId, t);
        results[t] = res.rows;
      } catch (err) {
        console.warn(`Could not list rows for table ${t}:`, err);
        results[t] = [];
      }
    }

    return NextResponse.json({ success: true, databaseId, data: results });
  } catch (error: unknown) {
    console.error("Error fetching from Appwrite:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST /api/appwrite/records
// Body: { table: "reports", id: "my-slug", data: { ... } }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { table, id, data } = body;

    if (!table || !id || !data) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: table, id, data" },
        { status: 400 }
      );
    }

    const { tablesDB, databaseId } = getAppwriteClient();

    // Serialize any complex nested objects like sections if present
    const payload = { ...data };
    if (payload.sections && typeof payload.sections !== "string") {
      payload.sections = JSON.stringify(payload.sections);
    }

    try {
      // Try to update existing row first
      const updated = await tablesDB.updateRow(databaseId, table, id, payload);
      return NextResponse.json({ success: true, action: "updated", row: updated });
    } catch {
      // Create new row
      const created = await tablesDB.createRow(databaseId, table, id, payload);
      return NextResponse.json({ success: true, action: "created", row: created });
    }
  } catch (error: unknown) {
    console.error("Error saving to Appwrite DB:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE /api/appwrite/records?table=reports&id=my-slug
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const id = searchParams.get("id");

    if (!table || !id) {
      return NextResponse.json(
        { success: false, error: "Missing required query params: table, id" },
        { status: 400 }
      );
    }

    const { tablesDB, databaseId } = getAppwriteClient();
    await tablesDB.deleteRow(databaseId, table, id);

    return NextResponse.json({ success: true, action: "deleted", table, id });
  } catch (error: unknown) {
    console.error("Error deleting from Appwrite DB:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
