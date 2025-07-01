import { NextResponse } from "next/server";
import { storage, ID } from "@/lib/appwrite";
import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");
    const tag = formData.get("tag");
    const date = formData.get("date");
    const file = formData.get("image");

    let imageUrl = null;
    let uploadedId = null;

    if (file && file.name && file.size > 0) {
      const uploadedFile = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
        ID.unique(),
        file 
      );

      uploadedId = uploadedFile.$id;

      imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${uploadedId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
    }

    await connectMongoDB();

    await Post.create({
      name,
      email,
      subject,
      message,
      tag,
      date,
      image: imageUrl,
      fileId: uploadedId,
    });

    return NextResponse.json({ message: "Post created successfully." }, { status: 201 });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { message: "An error occurred while posting." },
      { status: 500 }
    );
  }
}
