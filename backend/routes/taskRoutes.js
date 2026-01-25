import express from "express";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/* DASHBOARD STATS */
router.get("/dashboard", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL TASKS (DASHBOARD) */
router.get("/dashboard/all", auth, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project")
      .populate("user");

    const filtered = tasks.filter(
      t => t.project && t.project.user.toString() === req.user.id
    );

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: "Dashboard task fetch failed" });
  }
});

/* GET TASKS BY PROJECT */
router.get("/", auth, async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const tasks = await Task.find({
      project: projectId,
      user: req.user.id,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* CREATE TASK + ACTIVITY */
router.post("/", auth, async (req, res) => {
  try {

    // ✅ Get logged in user
    const user = await User.findById(req.user.id);

    const task = await Task.create({
      title: req.body.title,
      status: req.body.status,
      priority: req.body.priority,
      description: req.body.description,
      dueDate: req.body.dueDate,
      assignee: req.body.assignee,

      project: req.body.projectId,
      user: req.user.id,
    });

    // ✅ CREATE ACTIVITY
    await Activity.create({
      type: "created",
      message: "created a new task",
      taskTitle: task.title,
      projectId: task.project,
      taskId: task._id,

      user: {
        id: user._id,

        // ⭐ MAIN FIX HERE
        name: user.fullName || user.name || user.username,

        avatar: user.avatar || "https://i.pravatar.cc/150",
      },
    });

    res.status(201).json(task);

  } catch (err) {
    console.error("TASK CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE TASK */
router.patch("/:id", auth, async (req, res) => {
  try {

    const oldTask = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!oldTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    // ✅ Get logged in user
    const user = await User.findById(req.user.id);

    let type = "updated";
    let message = "updated the task";

    if (req.body.status && req.body.status !== oldTask.status) {
      if (req.body.status === "done") {
        type = "completed";
        message = "completed the task";
      } else {
        message = "moved task to In Progress";
      }
    }

    if (req.body.priority && req.body.priority !== oldTask.priority) {
      message = `changed priority to ${req.body.priority}`;
    }

    // ✅ CREATE ACTIVITY
    await Activity.create({
      type,
      message,
      taskTitle: updatedTask.title,
      projectId: updatedTask.project,
      taskId: updatedTask._id,

      user: {
        id: user._id,

        // ⭐ MAIN FIX HERE
        name: user.fullName || user.name || user.username,

        avatar: user.avatar || "https://i.pravatar.cc/150",
      },
    });

    res.json(updatedTask);

  } catch (err) {
    console.error("TASK UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* DELETE TASK */
router.delete("/:id", auth, async (req, res) => {
  try {

    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
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
