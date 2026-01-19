import express from "express";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

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
    res.status(500).json({ error: err.message });
  }
});

// CREATE task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
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

// UPDATE task (status / priority)
router.patch("/:id", async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    const user = req.body.user || { name: "Unknown User" };

    let type = "updated";
    let message = "Task updated";

    // ✅ STATUS CHANGE
    if (req.body.status && req.body.status !== oldTask.status) {
      if (req.body.status === "done") {
        type = "completed";
        message = "Moved to Done";
      } else {
        type = "updated";
        message = `Moved to In Progress`;
      }
    }

    // ✅ PRIORITY CHANGE
    if (req.body.priority && req.body.priority !== oldTask.priority) {
      type = "updated";
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

export default router;
