import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Post from "@/models/post";
import Diary from "@/models/diary";
import { NextResponse } from "next/server";
import { storage, ID } from "@/lib/appwrite";

export const dynamic = 'force-dynamic';

// ✅ GET: For testing
export async function GET() {
  return NextResponse.json({ message: "✅ Profile route working" });
}

// ✅ POST: Fetch profile data including total posts & diaries
export async function POST(req) {
  try {
    await connectMongoDB();
    
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const posts = await Post.find({ email });
    const diaries = await Diary.find({ email });

    return NextResponse.json({
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      points: user.points,
      var1: user.var1,
      posts,          // optional: remove if not needed
      totalPosts: posts.length,
      totalDiaries: diaries.length,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectMongoDB();
    const { postId } = await req.json();

    const deleted = await Post.findByIdAndDelete(postId);

    if (!deleted) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // If image file was uploaded, delete it from Appwrite
    if (deleted.fileId) {
      try {
        await storage.deleteFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
          deleted.fileId
        );
      } catch (err) {
        console.warn("Failed to delete file from Appwrite:", err.message);
      }
    }

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
