import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
      jobTitle = "",
      department = "",
      organization = "",
      location = "",
      avatar = ""
    } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({
        message: "All required fields must be filled"
      });
    }

    const exist = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (exist) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: fullName,
      username,
      email,
      password: hash,
      jobTitle,
      department,
      organization,
      location,
      avatar
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar || ""
      }
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar || ""
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
