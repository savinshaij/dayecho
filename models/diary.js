import mongoose, { Schema, models } from "mongoose";

const diarySchema = new Schema(
  {
   
   
    email: {
      type: String,
      required: true,
    },

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
      required: true
    }
  }
 
);

const Diary = models.Diary || mongoose.model("Diary", diarySchema);
export default Diary;
