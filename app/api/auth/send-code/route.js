import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import nodemailer from "nodemailer";

export async function POST(req) {
  await connectMongoDB();
  const { email } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
  const expiry = Date.now() + 60000; // 1 minute

  user.resetCode = otp;
  user.resetCodeExpiry = expiry;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Your Password Reset Code",
    html: `<p>Your reset code is <b>${otp}</b>. It will expire in 1 minute.</p>`,
  });

  return NextResponse.json({ message: "Verification code sent to your email." });
}
