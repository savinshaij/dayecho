import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectMongoDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const user = await User.findById(id).populate("friends", "name email _id");
  return NextResponse.json(user.friends);
}
