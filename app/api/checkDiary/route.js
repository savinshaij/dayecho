import { connectMongoDB } from "@/lib/mongodb";
import Diary from "@/models/diary";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, currentdate } = await req.json();
    console.log(email + currentdate);
    const Fetchedmessage = await Diary.find({
      email: email,
      date: currentdate
    });

    // Check if Fetchedmessage array has any entries
    const objectExists = Fetchedmessage.length > 0;

    return NextResponse.json({ objectExists });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while getting post." },
      { status: 500 }
    );
  }
}

