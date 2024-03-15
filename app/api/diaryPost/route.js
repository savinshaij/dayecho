import { connectMongoDB } from "@/lib/mongodb";
// import Diary from "@/models/diary";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function POST(req) {
  // try {
  //   await connectMongoDB();
  //   const { email,title, mood,content,date } = await req.json();
  //   await Diary.create({email,title, mood,content,date });
  //   return NextResponse.json({ message: "poted diary." }, { status: 201 });
  // } catch (error) {
  //   return NextResponse.json(
  //     { message: "An error occurred while posting diary." },
  //     { status: 500 }
  //   );
  // }






  try {
    await connectMongoDB();

    const { email,title, mood,content,date } = await req.json();
    console.log(email);
    // Find user by email
    const user = await User.findOne({ email });
    console.log(user);

    if (!user) {
      
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
      // return res.status(404).json({ message: 'User not found' });
    }

    // If user doesn't have a diary attribute, add it
    if (!user.diaries) {
      console.log("adding");
      user.diaries = [];
    }
    console.log(user.diaries);
    // Push diary element
    user.diaries.push({ title, mood, content, date });

    // Save updated user
    await user.save();
    return NextResponse.json(
      { message: 'Diary added successfully' },
      { status: 200 }
    );
    //return res.status(200).json({ message: 'Diary added successfully', user });
  } catch (error) {
    console.error('Error adding diary:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );

    // return res.status(500).json({ message: 'Internal Server Error' });
  }
}

