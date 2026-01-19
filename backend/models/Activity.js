import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["created", "assigned", "updated", "completed"],
      required: true
    },

    message: {
      type: String,
      required: true
    },

    taskTitle: String,

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },

    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task"
    },

    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      name: String,
      avatar: String
    }
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
