import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectMongoDB();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  const users = await User.find({
    name: { $regex: query, $options: "i" },
  }).select("_id name email");

  return NextResponse.json(users);
}
