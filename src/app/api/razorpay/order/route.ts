import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "dummy_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "dummy_key_secret",
});

export async function POST(request: Request) {
  try {
    const { courseId, amount } = await request.json();

    // Verify course & amount in Firestore here ideally
    // ...

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      notes: {
        courseId,
      },
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ order }, { status: 200 });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
