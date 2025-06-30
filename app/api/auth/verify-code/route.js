import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectMongoDB();
  const { email, code, newPassword } = await req.json();

  const user = await User.findOne({ email });

  if (
    !user ||
    user.resetCode !== code ||
    user.resetCodeExpiry < Date.now()
  ) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.resetCode = undefined;
  user.resetCodeExpiry = undefined;
  await user.save();

  return NextResponse.json({ message: "Password successfully reset." });
}
