import { connectMongoDB } from "@/lib/mongodb";
import CommunityMsg from "@/models/communityMsg";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    await connectMongoDB();
    const { name, email, message,date,time } = await req.json();
    console.log(date);
    await CommunityMsg.create({name, email, message,date,time });
    return NextResponse.json({ message: "msg posted." }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while posting msg." },
      { status: 500 }
    );
  }
}
