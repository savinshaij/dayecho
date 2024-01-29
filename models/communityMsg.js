import mongoose, { Schema, models } from "mongoose";

const communityMsgSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    date:{
      type : String ,
      required: true
    },
    time:{
      type : String ,
      required: true
    }
  },
  { timestamps: true }
);

const CommunityMsg = models.CommunityMsg || mongoose.model("CommunityMsg", communityMsgSchema);
export default CommunityMsg;
