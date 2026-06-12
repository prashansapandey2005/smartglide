import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { sendOTP } from "@/lib/mail";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email is already registered" }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP in database (upsert to overwrite any existing OTP for this email)
    await prisma.oTPVerification.upsert({
      where: { email },
      update: { otp, expiresAt },
      create: { email, otp, expiresAt },
    });

    // Send the email
    try {
      await sendOTP(email, otp);
    } catch (mailError: any) {
      console.warn("Failed to send email. Detailed error:", mailError);
      console.log(`[DEV OTP] Your OTP for ${email} is: ${otp}`);
      // In development, we don't fail if SMTP isn't set up yet, we just log it.
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error: any) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
