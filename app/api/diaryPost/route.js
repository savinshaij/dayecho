import { connectMongoDB } from "@/lib/mongodb";
import Diary from "@/models/diary";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    await connectMongoDB();
    const { email,title, mood,content,date } = await req.json();
    await Diary.create({email,title, mood,content,date });
    return NextResponse.json({ message: "poted diary." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while posting diary." },
      { status: 500 }
    );
  }
}
