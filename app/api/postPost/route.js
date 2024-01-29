import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email,subject, message,tag,date } = await req.json();
    await connectMongoDB();
    await Post.create({name, email,subject, message,tag,date });
    return NextResponse.json({ message: "post posted." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while posting post." },
      { status: 500 }
    );
  }
}
