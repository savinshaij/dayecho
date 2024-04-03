import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function POST(req) {
  try {
    await connectMongoDB();
    const { email } = await req.json();
    const Fetchedmessage = await Post.find({email});
    return NextResponse.json({Fetchedmessage });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while getting post." },
      { status: 500 }
    );
  }
}
