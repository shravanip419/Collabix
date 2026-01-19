import express from "express";
import Activity from "../models/Activity.js";
import Project from "../models/Project.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({ message: "projectId is required" });
    }

    const activities = await Activity
      .find({ projectId })
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/recent", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const activities = await Activity
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

   
    const projectIds = activities.map(a => a.projectId);
    const projects = await Project.find({ _id: { $in: projectIds } });

    const projectMap = {};
    projects.forEach(p => {
      projectMap[p._id.toString()] = p.name;
    });

    const result = activities.map(a => ({
      ...a,
      projectName: projectMap[a.projectId?.toString()] || "Unknown Project",
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
