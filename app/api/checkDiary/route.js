import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user"; // Assuming the user model is named 'user'
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function POST(req) {
  try {
    await connectMongoDB();
    const { email, currentdate } = await req.json();

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ objectExists: false }); // User not found
    }

    // Search for diary entry by date within user's diaries
    const diaryEntry = user.diaries.find(diary => diary.date === currentdate);

    const objectExists = !!diaryEntry; // Convert to boolean

    return NextResponse.json({ objectExists });
  } catch (error) {
    console.error("Error while getting post:", error);
    return NextResponse.json(
      { message: "An error occurred while getting post." },
      { status: 500 }
    );
  }
}


