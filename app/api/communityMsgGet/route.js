import { connectMongoDB } from "@/lib/mongodb";
import CommunityMsg from "@/models/communityMsg";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export const dynamic = 'force-dynamic';
export async function GET(req) {
  try {
   
    await connectMongoDB();
    const Fetchedmessage = await CommunityMsg.find();

    return NextResponse.json({Fetchedmessage });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while getting message." },
      { status: 500 }
    );
  }
}
