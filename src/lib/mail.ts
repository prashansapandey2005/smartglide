import nodemailer from "nodemailer";

// Initialize the Nodemailer transporter
// You should configure these environment variables in your .env file
// Example for Gmail: 
// SMTP_HOST="smtp.gmail.com"
// SMTP_PORT="587"
// SMTP_USER="your-email@gmail.com"
// SMTP_PASS="your-app-password"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (to: string, otp: string) => {
  if (!process.env.SMTP_USER) {
    console.warn("⚠️ SMTP environment variables not set. OTP would have been:", otp);
    // In local development, if SMTP is not configured, we'll just log it.
    // In production, this should throw an error.
    if (process.env.NODE_ENV === "production") {
      throw new Error("SMTP is not configured.");
    }
    return;
  }

  const mailOptions = {
    from: `"EduCoach" <${process.env.SMTP_USER}>`,
    to,
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
  };

  await transporter.sendMail(mailOptions);
};
