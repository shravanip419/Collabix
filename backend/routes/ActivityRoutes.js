import express from "express";
import Activity from "../models/Activity.js";
import Project from "../models/Project.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const { projectId } = req.query;

    let filter = {};

    if (projectId) {
      filter.projectId = projectId;
    }

    const activities = await Activity
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    const projectIds = activities.map(a => a.projectId);

    const projects = await Project.find({
      _id: { $in: projectIds }
    });

    const projectMap = {};

    projects.forEach(p => {
      projectMap[p._id.toString()] = p.name;
    });

    const result = activities.map(a => ({
      ...a,
      projectName:
        projectMap[a.projectId?.toString()] || "Unknown Project"
    }));

    res.json(result);

  } catch (err) {
    console.error("Activity API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET RECENT ACTIVITIES (for Dashboard)
router.get("/recent", auth, async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 5;

    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("projectId", "name"); // 👈 get project name

    const formatted = activities.map(a => ({
      ...a._doc,
      projectName: a.projectId?.name || "General",
    }));

    res.json(formatted);
  } catch (err) {
    console.error("RECENT ACTIVITY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});


export default router;
