import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET TASKS BY PROJECT (USER-SCOPED)
 * /api/tasks?projectId=xxx
 */
router.get("/", auth, async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const tasks = await Task.find({
      projectId,
      userId: req.userId,
    });

    res.json(tasks);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * CREATE TASK (AUTO USER + PROJECT)
 */
router.post("/", auth, async (req, res) => {
  try {
    const { title, status, priority, dueDate, description, projectId } = req.body;

    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "title and projectId are required" });
    }

    const task = await Task.create({
      title,
      status,
      priority,
      dueDate,
      description,
      projectId,
      userId: req.userId,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE TASK (DRAG & DROP SAFE)
 */
router.patch("/:id", auth, async (req, res) => {
  try {
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE TASK
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
