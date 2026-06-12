import { Resend } from "resend";

// Initialize Resend with the API key from environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const sendOTP = async (to: string, otp: string) => {
  if (!resend) {
    console.warn("⚠️ RESEND_API_KEY not set. OTP would have been:", otp);
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not configured.");
    }
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "EduCoach <onboarding@resend.dev>", // This is Resend's default testing email
      to: [to],
      subject: "Your EduCoach Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">Welcome to EduCoach!</h2>
          <p>Your one-time verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 16px; text-align: center; border-radius: 8px; margin: 24px 0;">
            <strong style="font-size: 32px; letter-spacing: 4px; color: #111827;">${otp}</strong>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      throw error;
    }

    console.log("Email sent successfully via Resend:", data);
  } catch (error) {
    console.error("Resend API Error:", error);
    throw error;
  }
};
