import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import auth from "../middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// GET ALL PROJECTS WITH TASK STATS
router.get("/", auth, async (req, res) => {
  try {
    const projectsWithStats = await Project.aggregate([
      {
        // ✅ FIX 1: use req.user.id
        // ✅ FIX 2: match correct field name
        $match: { user: new mongoose.Types.ObjectId(req.user.id) }
      },
      {
       $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "project", // 🔥 MUST MATCH
        as: "projectTasks"
           }

      },
      {
        $addFields: {
          totalTasks: { $size: "$projectTasks" },
          completedTasks: {
            $size: {
              $filter: {
                input: "$projectTasks",
                as: "task",
                cond: { $eq: ["$$task.status", "done"] }
              }
            }
          }
        }
      },
      {
        $project: { projectTasks: 0 }
      }
    ]);

    res.json(projectsWithStats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD PROJECT
router.post("/", auth, async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      // ✅ FIX 3: save correct user field
      user: req.user.id
    });

    res.status(201).json(project);
  } catch (err) {
    console.error("DB Create Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
