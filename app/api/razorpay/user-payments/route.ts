import { NextResponse } from "next/server";
import { Client, TablesDB, Query } from "node-appwrite";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
    const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
    const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";
    const apiKey = process.env.APPWRITE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ success: true, payments: [] });
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const tablesDB = new TablesDB(client);

    const queries: string[] = [];

    if (userId) {
      queries.push(Query.equal("userId", userId));
    } else if (email) {
      queries.push(Query.equal("customerEmail", email));
    }

    // Sort by newest
    queries.push(Query.orderDesc("$createdAt"));

    const result = await tablesDB.listRows(databaseId, "payments", queries);

    const payments = (result.rows || []).map((row: any) => ({
      id: row.$id,
      paymentId: row.paymentId || "Pending",
      orderId: row.orderId || "",
      planName: row.planName || row.planId || "Membership Plan",
      amount: row.amount || 0,
      status: row.status || "created",
      customerName: row.customerName || "",
      customerEmail: row.customerEmail || "",
      createdAt: row.$createdAt || row.paidAt || new Date().toISOString(),
      paidAt: row.paidAt || "",
      expiresAt: row.expiresAt || "",
    }));

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error: any) {
    console.error("Fetch past payments error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch payments" },
      { status: 500 }
    );
  }
}
