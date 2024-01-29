import mongoose, { Schema, models } from "mongoose";

const postSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
   
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Post = models.Post || mongoose.model("Post", postSchema);
export default Post;
