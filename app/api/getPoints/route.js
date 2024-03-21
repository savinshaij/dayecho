import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function POST(req) {
  try {
    await connectMongoDB();
    console.log("Connected to MongoDB");

    const { email } = await req.json();
    console.log("Received email:", email);

    const user = await User.findOne({ email: email });
    console.log("User found:", user);

    if (!user) {
      console.log("User not found, returning 404 error");
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Ensure echoPoints attribute exists in the user document
    if (!user.hasOwnProperty('points')) {
      user.points = 0;
    }

    console.log("User echoPoints:", user.points);

    let streak = 0;
    let echoPoints = 0;

    for (let i = 0; i < user.diaries.length; i++) {
      const diaryDate = user.diaries[i].date;
      const diaryDateParts = diaryDate.split('-');
      const currentDate = new Date(diaryDateParts[2], diaryDateParts[1] - 1, diaryDateParts[0]); // Parse date from string

      // Check if current date is consecutive to the previous date
      if (i > 0) {
        const prevDiaryDate = user.diaries[i - 1].date;
        const prevDiaryDateParts = prevDiaryDate.split('-');
        const prevDate = new Date(prevDiaryDateParts[2], prevDiaryDateParts[1] - 1, prevDiaryDateParts[0]); // Parse date from string

        if (currentDate - prevDate === 86400000) { // 86400000 milliseconds = 1 day
          streak++;
        } else {
          streak = 1; // Reset streak if current date is not consecutive
        }
      } else {
        streak = 1; // First diary entry in the list, streak starts from 1
      }

      // Increment echo points if streak is a multiple of 3
      if (streak % 3 === 0) {
        echoPoints++;
      }
    }

    console.log("Streak:", streak);
    console.log("Echo points to be added:", echoPoints);

    // Update user's echoPoints in the database
    user.points += echoPoints;
    await user.save();

    console.log("Updated user:", user);

    return NextResponse.json(
      { echoPoints: user.points },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}
