import { connectMongoDB } from "@/lib/mongodb";
import FriendRequest from "@/models/FriendRequest";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectMongoDB();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  try {
    const sentRequests = await FriendRequest.find({
      from: userId,
      status: "pending",
    }).populate("to", "name email");

    const formatted = sentRequests.map(r => ({
      _id: r.to._id,
      name: r.to.name,
      email: r.to.email,
      createdAt: r.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch sent requests" }, { status: 500 });
  }
}
