import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(

    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      points: { type: Number, default: 0 },
      var1: {
        type: Boolean
       
      },
      
      diaries: [{
        title: {
          type: String,
          required: true,
        },
        mood: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        date: {
          type: String,
          required: true,
        }
      }],
    },
    { timestamps: true }
  );

const User = models.User || mongoose.model("User", userSchema);
export default User;
