import { NextResponse } from "next/server";
import crypto from "crypto";
import { Client, TablesDB, Query } from "node-appwrite";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
      planName,
      amount,
      customerName,
      customerEmail,
      customerPhone,
      userId,
    } = await req.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET || "Y4TN4344KDDgNUJKlU3QT4ek";

    // 1. Verify Razorpay Payment Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // 2. Calculate Expiry Date based on plan duration
    const now = new Date();
    const expiresDate = new Date(now);

    if (planId === "3_months") {
      expiresDate.setMonth(expiresDate.getMonth() + 3);
    } else if (planId === "6_months") {
      expiresDate.setMonth(expiresDate.getMonth() + 6);
    } else if (planId === "1_year") {
      expiresDate.setFullYear(expiresDate.getFullYear() + 1);
    } else {
      expiresDate.setMonth(expiresDate.getMonth() + 1);
    }

    const expiresAtISO = expiresDate.toISOString();

    // 3. Update or Create Record in Appwrite `payments` Collection
    try {
      const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
      const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
      const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";
      const apiKey = process.env.APPWRITE_API_KEY;

      if (apiKey) {
        const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
        const tablesDB = new TablesDB(client);

        // Find existing order row
        const existingRows = await tablesDB.listRows(databaseId, "payments", [
          Query.equal("orderId", razorpay_order_id),
        ]);

        if (existingRows.total > 0) {
          const row = existingRows.rows[0];
          await tablesDB.updateRow(databaseId, "payments", row.$id, {
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            status: "paid",
            paidAt: now.toISOString(),
            expiresAt: expiresAtISO,
          });
        } else {
          await tablesDB.createRow(databaseId, "payments", "unique()", {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
            planId: planId || "",
            planName: planName || "",
            amount: Number(amount) || 0,
            status: "paid",
            customerName: customerName || "",
            customerEmail: customerEmail || "",
            customerPhone: customerPhone || "",
            userId: userId || "",
            paidAt: now.toISOString(),
            expiresAt: expiresAtISO,
          });
        }
      }
    } catch (appwriteErr) {
      console.warn("Notice: Could not update Appwrite payment row:", appwriteErr);
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
