import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectMongoDB();
  const { userId, friendId } = await req.json();

  const user = await User.findById(userId);
  const friend = await User.findById(friendId);

  if (!user || !friend) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.friends = user.friends.filter((id) => id.toString() !== friendId);
  friend.friends = friend.friends.filter((id) => id.toString() !== userId);

  await user.save();
  await friend.save();

  return NextResponse.json({ message: "Friend removed." });
}
