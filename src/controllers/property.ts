import { Request, Response } from "express";
import {PropertyModel} from "../models/property";
import {EstateModel} from "../models/estate";

/**
 * @desc Create a new property
 * @route POST /api/properties
 */
export const createProperty = async (req: Request, res: Response) => {
  try {
    const { name, estateId, owner, type, status, price, address, tenants , size} = req.body;

    const estate = await EstateModel.findById(estateId);
    if (!estate) return res.status(404).json({ message: "Estate not found" });

    const newProperty = new PropertyModel({
      name,
      estate: estateId,
      owner,
      type,
      status,
      price,
      address,
      tenants,
      size
    });

    await newProperty.save();
    res.status(201).json({ message: "Property created successfully", data: {property: newProperty}});
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Get all properties
 * @route GET /api/properties
 */
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await PropertyModel.find().populate("estate", "name").populate("owner", "name email");
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
/**
 * @desc Get all properties in a specific estate
 * @route GET /api/properties/:estateId
 */
export const getAllPropertiesInEstate = async (req: Request, res: Response) => {
  try {
    const { estateId } = req.params;

    // Fetch properties belonging to the specified estate
    const properties = await PropertyModel.find({ estate: estateId })
      .populate("estate", "name")
      .populate("owner", "name email")
      .populate("tenants", "name email phone");

    if (!properties.length) {
      return res.status(404).json({ message: "No properties found in this estate" });
    }

    return res.status(200).json({
      info : "",
      data : {properties},
      message : "Successfully fecthed all properties"

    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};


/**
 * @desc Get a property by ID
 * @route GET /api/properties/:id
 */
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await PropertyModel.findById(req.params.id)
      .populate("estate", "name")
      .populate("owner", "name email");
    if (!property) return res.status(404).json({ message: "Property not found" });

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Update a property
 * @route PUT /api/properties/:id
 */
export const updateProperty = async (req: Request, res: Response) => {
  try {
    const { name, estateId, owner, type, status } = req.body;

    const property = await PropertyModel.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    if (estateId) {
      const estate = await EstateModel.findById(estateId);
      if (!estate) return res.status(404).json({ message: "Estate not found" });
    }

    property.name = name || property.name;
    property.estate = estateId || property.estate;
    property.owner = owner || property.owner;
    property.type = type || property.type;
    property.status = status || property.status;

    await property.save();
    res.status(200).json({ message: "Property updated successfully", property });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Delete a property
 * @route DELETE /api/properties/:id
 */
export const deleteProperty = async (req: Request, res: Response) => {
  try {
    const property = await PropertyModel.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    await property.deleteOne();
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * @desc Get all properties within a specific estate
 * @route GET /api/estates/:estateId/properties
 */
export const getPropertiesByEstate = async (req: Request, res: Response) => {
  try {
    const properties = await PropertyModel.find({ estate: req.params.estateId })
      .populate("estate", "name")
      .populate("owner", "name email");
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
