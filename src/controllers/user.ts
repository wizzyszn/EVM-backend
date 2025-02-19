import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {UserModel} from "../models/user";
import {EstateModel} from "../models/estate";

//const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

/**
 * @desc Get all users
 * @route GET /api/users
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find().populate("estate", "name");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  /**
   * @desc Get a user by ID
   * @route GET /api/users/:id
   */
  export const getUserById = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.params.id).populate("estate", "name");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  /**
   * @desc Update a user
   * @route PUT /api/users/:id
   */
  export const updateUser = async (req: Request, res: Response) => {
    try {
      const { name, email, estateId } = req.body;
  
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // If estate is being updated, check if it exists
      if (estateId) {
        const estate = await EstateModel.findById(estateId);
        if (!estate) return res.status(404).json({ message: "Estate not found" });
      }
  
      user.name = name || user.name;
      user.email = email || user.email;
      user.estate = estateId || user.estate;
  
      await user.save();
      res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  /**
   * @desc Delete a user
   * @route DELETE /api/users/:id
   */
  export const deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await UserModel.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      await user.deleteOne();
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  /**
   * @desc Get all users in a specific estate
   * @route GET /api/estates/:estateId/users
   */
  export const getUsersByEstate = async (req: Request, res: Response) => {
    try {
      const users = await UserModel.find({ estate: req.params.estateId }).populate("estate", "name");
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  