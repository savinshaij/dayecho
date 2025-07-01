import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import FriendRequest from "@/models/FriendRequest"
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

   const requests = await FriendRequest.find({
  to: id,
  status: "pending"
}).populate("from", "name email");

const formatted = requests.map(r => ({
  _id: r.from._id,
  name: r.from.name,
  email: r.from.email,
  createdAt: r.createdAt
}));

return NextResponse.json(formatted);


    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.friendRequests);
  } catch (err) {
    console.error("Error loading incoming friend requests:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
