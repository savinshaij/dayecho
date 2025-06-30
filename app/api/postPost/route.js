import { connectMongoDB } from "@/lib/mongodb";
import Post from "@/models/post";
import { NextResponse } from "next/server";
import { storage, ID } from "@/lib/appwrite";
import sharp from "sharp";

// Helper to compress image buffer
async function compressImage(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const compressedBuffer = await sharp(buffer)
    .resize(800) // resize width to 800px, keep aspect ratio
    .jpeg({ quality: 10 }) // convert to jpeg, compress quality
    .toBuffer();

  return new File([compressedBuffer], file.name, { type: "image/jpeg" });
}

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
      const compressedFile = await compressImage(file);

      const uploadedFile = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET,
        ID.unique(),
        compressedFile
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
      fileId: uploadedId, // store image file ID for later deletion
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

