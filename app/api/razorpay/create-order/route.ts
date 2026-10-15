import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Client, TablesDB, ID } from "node-appwrite";

export async function POST(req: Request) {
  try {
    const {
      amount,
      currency = "INR",
      planId,
      planName,
      customerName,
      customerEmail,
      customerPhone,
      userId,
    } = await req.json();

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TnwG9Pydx1XE0w";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "Y4TN4344KDDgNUJKlU3QT4ek";

    const instance = new Razorpay({
      key_id,
      key_secret,
    });

    // 1. Check or Create Razorpay Customer
    let customerId = "";
    if (customerEmail || customerPhone) {
      try {
        // Search if customer already exists in Razorpay
        const existingCustomers: any = await instance.customers.all({
          count: 10,
        } as any);

        const found = existingCustomers?.items?.find(
          (c: any) => c.email === customerEmail || c.contact === customerPhone
        );

        if (found) {
          customerId = found.id;
        } else {
          // Create new customer in Razorpay
          const newCustomer = await instance.customers.create({
            name: customerName || "Member",
            email: customerEmail || undefined,
            contact: customerPhone || undefined,
            notes: {
              planId: planId || "",
              userId: userId || "",
            },
          });
          customerId = newCustomer.id;
        }
      } catch (custErr) {
        console.warn("Notice: Razorpay customer fetch/create error:", custErr);
      }
    }

    // 2. Create Order in Razorpay
    const options = {
      amount: Math.round(Number(amount) * 100), // amount in paise
      currency,
      receipt: `receipt_${Date.now()}_${planId || "sub"}`,
      notes: {
        customerId,
        customerName: customerName || "",
        customerEmail: customerEmail || "",
        customerPhone: customerPhone || "",
        planId: planId || "",
        planName: planName || "",
      },
    };

    const order = await instance.orders.create(options);

    // 3. Record Order in Appwrite Database
    try {
      const endpoint = process.env.APPWRITE_ENDPOINT || "https://sgp.cloud.appwrite.io/v1";
      const projectId = process.env.APPWRITE_PROJECT_ID || "aethos-wealth";
      const databaseId = process.env.APPWRITE_DATABASE_ID || "aethos_db";
      const apiKey = process.env.APPWRITE_API_KEY;

      if (apiKey) {
        const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
        const tablesDB = new TablesDB(client);

        await tablesDB.createRow(databaseId, "payments", ID.unique(), {
          orderId: order.id,
          amount: Number(amount),
          planId: planId || "",
          planName: planName || "",
          status: "created",
          customerId: customerId || "",
          customerName: customerName || "",
          customerEmail: customerEmail || "",
          customerPhone: customerPhone || "",
          userId: userId || "",
        });
      }
    } catch (appwriteErr) {
      console.warn("Notice: Could not save payment order row to Appwrite:", appwriteErr);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: key_id,
      customerId: customerId,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
