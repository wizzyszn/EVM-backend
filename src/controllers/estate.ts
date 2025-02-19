import { Request, Response } from "express";
import {EstateModel} from "../models/estate";
import { UserModel } from "../models/user";
import { Schema } from "mongoose";

/**
 * @desc Create a new estate
 * @route POST /api/estates
 * @access Admin
 */
export const createEstate = async (req: Request, res: Response) => {
    try {
      const { name, location } = req.body;
      const { adminId } = req.params; // Get adminId from URL params
  
      // Check if the user exists and is an admin
      const adminUser = await UserModel.findById(adminId);
      if (!adminUser || adminUser.role !== "admin") {
        return res.status(403).json({ message: "Only admins can create estates" });
      }
  
      // Create the estate
      const newEstate = new EstateModel({
        name,
        location,
        admin: adminUser._id,
      });
  
      await newEstate.save();
  
      // Update admin user with estate ID
      adminUser.estate = newEstate._id as  Schema.Types.ObjectId;
      await adminUser.save();
  
      return res.status(201).json({ message: "Estate created successfully", estate: newEstate });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
  
/**
 * @desc Get all estates
 * @route GET /api/estates
 * @access Admin
 */
export const getAllEstates = async (req: Request, res: Response) => {
  try {
    const estates = await EstateModel.find().populate("admin", "name email");
    return res.status(200).json(estates);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Get a single estate by ID
 * @route GET /api/estates/:id
 * @access Admin
 */
export const getEstateById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const estate = await EstateModel.findById(id).populate("admin", "name email");
    if (!estate) {
      return res.status(404).json({ message: "Estate not found" });
    }

    return res.status(200).json(estate);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Update estate details
 * @route PUT /api/estates/:id
 * @access Admin
 */
export const updateEstate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const updatedEstate = await EstateModel.findByIdAndUpdate(
      id,
      { name, location },
      { new: true, runValidators: true }
    );

    if (!updatedEstate) {
      return res.status(404).json({ message: "Estate not found" });
    }

    return res.status(200).json({ message: "Estate updated successfully", estate: updatedEstate });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Delete an estate
 * @route DELETE /api/estates/:id
 * @access Admin
 */
export const deleteEstate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const estate = await EstateModel.findByIdAndDelete(id);
    if (!estate) {
      return res.status(404).json({ message: "Estate not found" });
    }

    return res.status(200).json({ message: "Estate deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
