import { connectMongoDB } from "@/lib/mongodb";
import FriendRequest from "@/models/FriendRequest";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectMongoDB();

  const { fromId, toId } = await req.json();

  if (!fromId || !toId) {
    return NextResponse.json({ error: "Missing fromId or toId" }, { status: 400 });
  }

  try {
    const request = await FriendRequest.findOneAndUpdate(
      { from: fromId, to: toId, status: "pending" },
      { status: "cancelled" },
      { new: true }
    );

    if (!request) {
      return NextResponse.json({ error: "Pending request not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Friend request cancelled", request });
  } catch (error) {
    console.error("Cancel error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
