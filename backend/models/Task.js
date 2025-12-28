import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: ["todo", "in-progress", "done"],
    default: "todo"
  },
  priority: String,
  dueDate: String
});

export default mongoose.model("Task", taskSchema);
