"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertiesByEstate = exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.getAllPropertiesInEstate = exports.getAllProperties = exports.createProperty = void 0;
const property_1 = require("../models/property");
const estate_1 = require("../models/estate");
/**
 * @desc Create a new property
 * @route POST /api/properties
 */
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, estateId, owner, type, status, price, address, tenants, size } = req.body;
        const estate = yield estate_1.EstateModel.findById(estateId);
        if (!estate)
            return res.status(404).json({ message: "Estate not found" });
        const newProperty = new property_1.PropertyModel({
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
        yield newProperty.save();
        res.status(201).json({ message: "Property created successfully", data: { property: newProperty } });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.createProperty = createProperty;
/**
 * @desc Get all properties
 * @route GET /api/properties
 */
const getAllProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield property_1.PropertyModel.find().populate("estate", "name").populate("owner", "name email");
        res.status(200).json(properties);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getAllProperties = getAllProperties;
/**
 * @desc Get all properties in a specific estate
 * @route GET /api/properties/:estateId
 */
const getAllPropertiesInEstate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { estateId } = req.params;
        // Fetch properties belonging to the specified estate
        const properties = yield property_1.PropertyModel.find({ estate: estateId })
            .populate("estate", "name")
            .populate("owner", "name email")
            .populate("tenants", "name email phone");
        if (!properties.length) {
            return res.status(404).json({ message: "No properties found in this estate" });
        }
        return res.status(200).json({
            info: "",
            data: { properties },
            message: "Successfully fecthed all properties"
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.getAllPropertiesInEstate = getAllPropertiesInEstate;
/**
 * @desc Get a property by ID
 * @route GET /api/properties/:id
 */
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield property_1.PropertyModel.findById(req.params.id)
            .populate("estate", "name")
            .populate("owner", "name email");
        if (!property)
            return res.status(404).json({ message: "Property not found" });
        res.status(200).json(property);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getPropertyById = getPropertyById;
/**
 * @desc Update a property
 * @route PUT /api/properties/:id
 */
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, estateId, owner, type, status } = req.body;
        const property = yield property_1.PropertyModel.findById(req.params.id);
        if (!property)
            return res.status(404).json({ message: "Property not found" });
        if (estateId) {
            const estate = yield estate_1.EstateModel.findById(estateId);
            if (!estate)
                return res.status(404).json({ message: "Estate not found" });
        }
        property.name = name || property.name;
        property.estate = estateId || property.estate;
        property.owner = owner || property.owner;
        property.type = type || property.type;
        property.status = status || property.status;
        yield property.save();
        res.status(200).json({ message: "Property updated successfully", property });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateProperty = updateProperty;
/**
 * @desc Delete a property
 * @route DELETE /api/properties/:id
 */
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const property = yield property_1.PropertyModel.findById(req.params.id);
        if (!property)
            return res.status(404).json({ message: "Property not found" });
        yield property.deleteOne();
        res.status(200).json({ message: "Property deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.deleteProperty = deleteProperty;
/**
 * @desc Get all properties within a specific estate
 * @route GET /api/estates/:estateId/properties
 */
const getPropertiesByEstate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const properties = yield property_1.PropertyModel.find({ estate: req.params.estateId })
            .populate("estate", "name")
            .populate("owner", "name email");
        res.status(200).json(properties);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getPropertiesByEstate = getPropertiesByEstate;
