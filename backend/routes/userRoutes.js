import express from "express";
import User from "../models/User.js";
import Task from "../models/Task.js";
import auth from "../middleware/authMiddleware.js";


const router = express.Router();

/* GET logged-in user's profile */
router.get("/me", auth, async (req, res) => {
  try {
    console.log("USER ID FROM TOKEN:", req.userId);

    const user = await User.findById(req.userId);
    console.log("USER FOUND:", user);

    const tasks = await Task.find({ createdBy: req.userId });
    console.log("TASKS FOUND:", tasks.length);

    res.json({ user, tasks });
  } catch (err) {
    console.error("PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


/* UPDATE profile */
router.put("/me", auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Update failed" });
  }
});

export default router;
