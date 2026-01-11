import express from "express";
import Project from "../models/Project.js";

const router = express.Router();

// get all projects
router.get("/", async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// add project
router.post("/", async (req, res) => {
  const project = await Project.create({ name: req.body.name });
  res.status(201).json(project);
});

export default router;
