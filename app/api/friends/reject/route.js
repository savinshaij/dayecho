import { connectMongoDB } from "@/lib/mongodb";
import FriendRequest from "@/models/FriendRequest";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectMongoDB();
  const { userId, fromId } = await req.json(); // userId = receiver, fromId = sender

  try {
    // Find and reject the request
    const request = await FriendRequest.findOneAndUpdate(
      { from: fromId, to: userId, status: "pending" },
      { status: "rejected" }
    );

    if (!request) {
      return NextResponse.json({ error: "Friend request not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Friend request rejected." });
  } catch (err) {
    console.error("Error rejecting request:", err);
    return NextResponse.json({ error: "Failed to reject request" }, { status: 500 });
  }
}
