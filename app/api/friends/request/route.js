// app/api/friends/request/route.js
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import FriendRequest from "@/models/FriendRequest";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("✅ [API] /api/friends/request HIT");

    await connectMongoDB();
    const { fromId, toId } = await req.json();

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(fromId) || !mongoose.Types.ObjectId.isValid(toId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (fromId === toId) {
      return NextResponse.json({ error: "Cannot send request to yourself" }, { status: 400 });
    }

    const [fromUser, toUser] = await Promise.all([
      User.findById(fromId),
      User.findById(toId)
    ]);

    if (!fromUser || !toUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already friends
    const alreadyFriends =
      fromUser.friends?.some(f => f.toString() === toId) ||
      toUser.friends?.some(f => f.toString() === fromId);

    if (alreadyFriends) {
      return NextResponse.json({ error: "Already friends" }, { status: 400 });
    }

    // Check if request already exists
    const existingRequest = await FriendRequest.findOne({
      from: fromId,
      to: toId,
      status: "pending"
    });

    if (existingRequest) {
      return NextResponse.json({ error: "Friend request already sent" }, { status: 400 });
    }

    // Create new request
    const newRequest = new FriendRequest({
      from: fromId,
      to: toId,
      status: "pending",
    });

    await newRequest.save();

    return NextResponse.json({ message: "Friend request sent" });
  } catch (error) {
    console.error("❌ Error in friend request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
