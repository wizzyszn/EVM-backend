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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
/*
 * @desc Register a new admin user only
 * @route POST /api/auth/register
 */
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role, phone } = req.body;
        // Only allow admin registration through this route
        if (role !== "admin") {
            return res.status(403).json({ message: "Only admin registration is allowed" });
        }
        // Check if user already exists
        const existingUser = yield user_1.UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create admin user
        const newUser = new user_1.UserModel({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
        });
        yield newUser.save();
        return res.status(201).json({
            message: "Admin registered successfully",
            data: { user: newUser },
            info: "Please create an estate",
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.registerUser = registerUser;
/**
 * @desc User login
 * @route POST /api/auth/login
 */
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.UserModel.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
        user.authenticated = true;
        yield user.save();
        res.status(200).json({ message: "Login successful", token, data: { user } });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});
exports.loginUser = loginUser;
