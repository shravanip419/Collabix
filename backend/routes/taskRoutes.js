import express from "express";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

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
    const { title, status, priority, dueDate, description, projectId } =
      req.body;

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

    const user = req.body.user || { name: "Unknown User" };

    await Activity.create({
      type: "created",
      message: "Task created",
      taskTitle: task.title,
      projectId: task.projectId,
      taskId: task._id,
      user: {
        name: user.name,
        avatar: "https://i.pravatar.cc/150",
      },
    });

    res.status(201).json(task);
  } catch (err) {
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

    const user = req.body.user || { name: "Unknown User" };

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
        name: user.name,
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
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
