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
exports.deleteEstate = exports.updateEstate = exports.getEstateById = exports.getAllEstates = exports.createEstate = void 0;
const estate_1 = require("../models/estate");
const user_1 = require("../models/user");
/**
 * @desc Create a new estate
 * @route POST /api/estates
 * @access Admin
 */
const createEstate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, location } = req.body;
        const { adminId } = req.params; // Get adminId from URL params
        // Check if the user exists and is an admin
        const adminUser = yield user_1.UserModel.findById(adminId);
        if (!adminUser || adminUser.role !== "admin") {
            return res.status(403).json({ message: "Only admins can create estates" });
        }
        // Create the estate
        const newEstate = new estate_1.EstateModel({
            name,
            location,
            admin: adminUser._id,
        });
        yield newEstate.save();
        // Update admin user with estate ID
        adminUser.estate = newEstate._id;
        yield adminUser.save();
        return res.status(201).json({ message: "Estate created successfully", estate: newEstate });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.createEstate = createEstate;
/**
 * @desc Get all estates
 * @route GET /api/estates
 * @access Admin
 */
const getAllEstates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const estates = yield estate_1.EstateModel.find().populate("admin", "name email");
        return res.status(200).json(estates);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.getAllEstates = getAllEstates;
/**
 * @desc Get a single estate by ID
 * @route GET /api/estates/:id
 * @access Admin
 */
const getEstateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const estate = yield estate_1.EstateModel.findById(id).populate("admin", "name email");
        if (!estate) {
            return res.status(404).json({ message: "Estate not found" });
        }
        return res.status(200).json(estate);
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.getEstateById = getEstateById;
/**
 * @desc Update estate details
 * @route PUT /api/estates/:id
 * @access Admin
 */
const updateEstate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, location } = req.body;
        const updatedEstate = yield estate_1.EstateModel.findByIdAndUpdate(id, { name, location }, { new: true, runValidators: true });
        if (!updatedEstate) {
            return res.status(404).json({ message: "Estate not found" });
        }
        return res.status(200).json({ message: "Estate updated successfully", estate: updatedEstate });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.updateEstate = updateEstate;
/**
 * @desc Delete an estate
 * @route DELETE /api/estates/:id
 * @access Admin
 */
const deleteEstate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const estate = yield estate_1.EstateModel.findByIdAndDelete(id);
        if (!estate) {
            return res.status(404).json({ message: "Estate not found" });
        }
        return res.status(200).json({ message: "Estate deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.deleteEstate = deleteEstate;
