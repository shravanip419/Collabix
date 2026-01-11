import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// GET tasks (by project)
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const tasks = await Task.find({ projectId });
    res.json(tasks);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// CREATE task
router.post("/", async (req, res) => {
  try {
    console.log("Incoming task:", req.body); // 🔥 DEBUG LINE

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE task
router.patch("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
