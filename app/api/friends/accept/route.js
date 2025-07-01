// app/api/friends/accept/route.js
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import FriendRequest from "@/models/FriendRequest";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectMongoDB();
  const { userId, fromId } = await req.json();

  const request = await FriendRequest.findOneAndUpdate(
    { from: fromId, to: userId, status: "pending" },
    { status: "accepted" }
  );

  if (!request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  const [user, fromUser] = await Promise.all([
    User.findById(userId),
    User.findById(fromId)
  ]);

  if (!user || !fromUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Add friends both ways
  if (!user.friends.includes(fromId)) user.friends.push(fromId);
  if (!fromUser.friends.includes(userId)) fromUser.friends.push(userId);

  await user.save();
  await fromUser.save();

  return NextResponse.json({ message: "Friend request accepted" });
}
