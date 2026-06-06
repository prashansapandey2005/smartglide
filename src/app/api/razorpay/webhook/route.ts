import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") || "";

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "dummy_secret")
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    if (payload.event === "payment.captured") {
      const payment = payload.payload.payment.entity;
      
      // We should use notes to extract user & course id passed during order creation
      const courseId = payment.notes?.courseId;
      const userId = payment.notes?.userId; // Assumes passed from client

      if (courseId && userId) {
        // Create purchase record in Firestore
        await adminDb.collection("purchases").doc(payment.order_id).set({
          id: payment.order_id,
          userId,
          courseId,
          amount: payment.amount / 100,
          currency: payment.currency,
          status: "completed",
          razorpayPaymentId: payment.id,
          razorpayOrderId: payment.order_id,
          purchasedAt: new Date(),
        });

        // Grant access by updating user doc or progress doc
        await adminDb.collection("users").doc(userId).collection("purchasedCourses").doc(courseId).set({
          purchasedAt: new Date(),
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Razorpay Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
