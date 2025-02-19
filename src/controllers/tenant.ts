import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import {UserModel} from "../models/user";
import {PropertyModel, PropertyStatus} from "../models/property";
import bcrypt from "bcryptjs";
/**
 * @desc Add a tenant to an estate
 * @route POST /api/tenants/:adminId
 * @access Admin Only
 */
export const addTenant = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, propertyId } = req.body;
    const { adminId } = req.params;

    // Check if the admin exists
    const adminUser = await UserModel.findById(adminId);
    if (!adminUser) return res.status(404).json({ message: "Admin not found" });

    if (adminUser.role !== "admin") {
      return res.status(403).json({ message: "Only admins can add tenants" });
    }

    // Check if property exists
    const property = await PropertyModel.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // Check if tenant with same email exists
    const existingTenant = await UserModel.findOne({ email, role: "tenant" });
    if (existingTenant) return res.status(400).json({ message: "Tenant already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new tenant as a user with the "tenant" role
    const newTenant = new UserModel({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "tenant",
      properties: [propertyId], // Add property to tenant's properties array
      estate: adminUser.estate, // Link tenant to the same estate as the admin
    });

    await newTenant.save();

    // Add the tenant's ID to the property's tenants array
    property.tenants && property.tenants.push(newTenant._id as mongoose.Schema.Types.ObjectId);
    property.status = PropertyStatus.OCCUPIED
    await property.save();

    return res.status(201).json({ message: "Tenant added successfully", tenant: newTenant });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Get all tenants in an estate
 * @route GET /api/tenants/:adminId
 * @access Admin Only
 */
export const getAllTenants = async (req: Request, res: Response) => {
    try {
      const { adminId } = req.params;
  
      // Check if admin exists
      const adminUser = await UserModel.findById(adminId);
      if (!adminUser) return res.status(404).json({ message: "Admin not found" });
  
      if (adminUser.role !== "admin") {
        return res.status(403).json({ message: "Only admins can view tenants" });
      }
  
      // Get all tenants in the estate
      const tenants = await UserModel.find({ estate: adminUser.estate, role: "tenant" }).populate("properties estate");
  
      return res.status(200).json({message : "successfully fetched all tenats", data : {tenants} });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
  
  /**
   * @desc Get tenant details
   * @route GET /api/tenants/details/:tenantId
   * @access Admin/Tenant
   */
  export const getTenantById = async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.params;
  
      const tenant = await UserModel.findOne({ _id: tenantId, role: "tenant" }).populate("properties");
      if (!tenant) return res.status(404).json({ message: "Tenant not found" });
  
      return res.status(200).json({ tenant });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
  
  /**
   * @desc Update tenant details
   * @route PUT /api/tenants/:tenantId
   * @access Admin Only
   */
  export const updateTenant = async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.params;
      const updateData = req.body;
  
      const tenant = await UserModel.findOneAndUpdate(
        { _id: tenantId, role: "tenant" },
        updateData,
        { new: true }
      );
      if (!tenant) return res.status(404).json({ message: "Tenant not found" });
  
      return res.status(200).json({ message: "Tenant updated successfully", tenant });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
  
  /**
   * @desc Remove a tenant from a property
   * @route DELETE /api/tenants/:tenantId
   * @access Admin Only
   */
  export const removeTenant = async (req: Request, res: Response) => {
    try {
      const { tenantId } = req.params;
  
      const tenant = await UserModel.findOne({ _id: tenantId, role: "tenant" });
      if (!tenant) return res.status(404).json({ message: "Tenant not found" });
  
      // Remove tenant from all properties
      await PropertyModel.updateMany(
        { tenants: tenant._id },
        { $pull: { tenants: tenant._id } }
      );
  
      // Delete tenant
      await UserModel.findByIdAndDelete(tenantId);
  
      return res.status(200).json({ message: "Tenant removed successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  };
  