import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, date } = await req.json();

   
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" });
    }

    
    if (!user.diaries || user.diaries.length === 0) {
      return NextResponse.json({ message: "User has no diaries" });
    }

   
    const diaryEntry = user.diaries.find(diary => diary.date === date);

    if (!diaryEntry) {
      return NextResponse.json({ message: "Diary entry not found for the given date" });
    }

    return NextResponse.json({ diaryEntry });
  } catch (error) {
    console.error("Error while getting post:", error);
    return NextResponse.json(
      { message: "An error occurred while getting post." },
      { status: 500 }
    );
  }
}
