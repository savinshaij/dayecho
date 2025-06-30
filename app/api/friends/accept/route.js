import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectMongoDB();
  const { userId, fromId } = await req.json();

  const user = await User.findById(userId);
  const fromUser = await User.findById(fromId);

  if (!user || !fromUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.friends.push(fromId);
  fromUser.friends.push(userId);
  user.friendRequests = user.friendRequests.filter(
    (id) => id.toString() !== fromId
  );

  await user.save();
  await fromUser.save();

  return NextResponse.json({ message: "Friend request accepted." });
}
