import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import FriendRequest from "@/models/FriendRequest";
import { NextResponse } from "next/server";

export async function POST(req) {
  console.log("✅ [API] /api/friends/request HIT");

  await connectMongoDB();
  const { fromId, toId } = await req.json();

  // Check valid ObjectIds
  if (!mongoose.Types.ObjectId.isValid(fromId) || !mongoose.Types.ObjectId.isValid(toId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  if (fromId === toId) {
    return NextResponse.json({ error: "Cannot friend yourself" }, { status: 400 });
  }

  const fromUser = await User.findById(fromId);
  const toUser = await User.findById(toId);

  if (!fromUser || !toUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check if friend request already exists
  const existingRequest = await FriendRequest.findOne({
    from: fromId,
    to: toId,
    status: "pending",
  });

  if (existingRequest) {
    return NextResponse.json({ error: "Friend request already sent" }, { status: 400 });
  }

  // Also check if they are already friends
  const alreadyFriends = fromUser.friends?.includes(toId) || toUser.friends?.includes(fromId);
  if (alreadyFriends) {
    return NextResponse.json({ error: "Already friends" }, { status: 400 });
  }

  // Create the friend request document
  const newRequest = new FriendRequest({
    from: fromId,
    to: toId,
    status: "pending",
  });

  await newRequest.save();

  return NextResponse.json({ message: "Friend request sent" });
}
