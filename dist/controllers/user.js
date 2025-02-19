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
exports.getUsersByEstate = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const user_1 = require("../models/user");
const estate_1 = require("../models/estate");
//const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
/**
 * @desc Get all users
 * @route GET /api/users
 */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.UserModel.find().populate("estate", "name");
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getAllUsers = getAllUsers;
/**
 * @desc Get a user by ID
 * @route GET /api/users/:id
 */
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.UserModel.findById(req.params.id).populate("estate", "name");
        if (!user)
            return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getUserById = getUserById;
/**
 * @desc Update a user
 * @route PUT /api/users/:id
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, estateId } = req.body;
        const user = yield user_1.UserModel.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        // If estate is being updated, check if it exists
        if (estateId) {
            const estate = yield estate_1.EstateModel.findById(estateId);
            if (!estate)
                return res.status(404).json({ message: "Estate not found" });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.estate = estateId || user.estate;
        yield user.save();
        res.status(200).json({ message: "User updated successfully", user });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.updateUser = updateUser;
/**
 * @desc Delete a user
 * @route DELETE /api/users/:id
 */
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.UserModel.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        yield user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.deleteUser = deleteUser;
/**
 * @desc Get all users in a specific estate
 * @route GET /api/estates/:estateId/users
 */
const getUsersByEstate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.UserModel.find({ estate: req.params.estateId }).populate("estate", "name");
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.getUsersByEstate = getUsersByEstate;
