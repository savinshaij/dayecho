// models/FriendRequest.js
import mongoose, { Schema, models } from "mongoose";

const friendRequestSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true }, // sender
    to: { type: Schema.Types.ObjectId, ref: "User", required: true },   // receiver
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const FriendRequest = models.FriendRequest || mongoose.model("FriendRequest", friendRequestSchema);
export default FriendRequest;
