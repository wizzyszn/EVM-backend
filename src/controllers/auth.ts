import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {UserModel} from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

/*
 * @desc Register a new admin user only
 * @route POST /api/auth/register
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Only allow admin registration through this route
    if (role !== "admin") {
      return res.status(403).json({ message: "Only admin registration is allowed" });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
    });

    await newUser.save();

    return res.status(201).json({
      message: "Admin registered successfully",
      data: { user: newUser },
      info: "Please create an estate",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


/**
 * @desc User login
 * @route POST /api/auth/login
 */
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    user.authenticated = true;
    await user.save();
    res.status(200).json({ message: "Login successful", token, data : {user} });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
