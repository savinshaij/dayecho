import { connectMongoDB } from "@/lib/mongodb";
import Diary from "@/models/diary";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function POST(req) {
  try {
    await connectMongoDB();
    const { email,date } = await req.json();
    console.log(req.email);
    const Fetchedmessage = await Diary.find({
      email: email,
      date: date
    });
    return NextResponse.json({Fetchedmessage });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while getting post." },
      { status: 500 }
    );
  }
}
