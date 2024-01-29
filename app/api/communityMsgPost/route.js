import { connectMongoDB } from "@/lib/mongodb";
import CommunityMsg from "@/models/communityMsg";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { name, email, message,date,time } = await req.json();
    await connectMongoDB();
    await CommunityMsg.create({ name, email, message,date,time}).then(
      console.log('msg added')
      )

    return NextResponse.json({ message: "message posted." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while posting message." },
      { status: 500 }
    );
  }
}
