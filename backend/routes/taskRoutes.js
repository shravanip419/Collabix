import express from "express";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * GET ALL TASKS FOR DASHBOARD (ALL USER TASKS)
 */
router.get("/dashboard", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET TASKS BY PROJECT
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
    res.status(500).json({ error: err.message });
  }
});

/**
 * CREATE TASK
 */
router.post("/", auth, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      status: req.body.status || "todo",
      priority: req.body.priority || "medium",
      description: req.body.description,
      dueDate: req.body.dueDate,
      assignee: req.body.assignee,

      projectId: req.body.projectId, // ✅ FIXED
      userId: req.userId,            // ✅ FIXED
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("TASK CREATE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE TASK
 */
router.patch("/:id", auth, async (req, res) => {
  try {
    const oldTask = await Task.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!oldTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );

    let type = "updated";
    let message = "Task updated";

    if (req.body.status && req.body.status !== oldTask.status) {
      if (req.body.status === "done") {
        type = "completed";
        message = "Moved to Done";
      } else {
        message = "Moved to In Progress";
      }
    }

    if (req.body.priority && req.body.priority !== oldTask.priority) {
      message = `Priority changed to ${req.body.priority}`;
    }

    await Activity.create({
      type,
      message,
      taskTitle: updatedTask.title,
      projectId: updatedTask.projectId,
      taskId: updatedTask._id,
      user: {
        name: req.user.name,
        avatar: "https://i.pravatar.cc/150",
      },
    });

    res.json(updatedTask);
  } catch (err) {
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
    res.status(500).json({ error: err.message });
  }
});

export default router;
