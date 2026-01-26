import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },   // stays as "name"
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    jobTitle: { type: String, default: "" },
    department: { type: String, default: "" },
    organization: { type: String, default: "" },
    location: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
