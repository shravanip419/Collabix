import express from "express";
import User from "../models/User.js";
import Task from "../models/Task.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    console.log("USER ID FROM TOKEN:", req.user.id);

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const tasks = await Task.find({ createdBy: req.user.id });

    res.json({ user, tasks });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});

export default router;
