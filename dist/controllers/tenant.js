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
exports.removeTenant = exports.updateTenant = exports.getTenantById = exports.getAllTenants = exports.addTenant = void 0;
const user_1 = require("../models/user");
const property_1 = require("../models/property");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * @desc Add a tenant to an estate
 * @route POST /api/tenants/:adminId
 * @access Admin Only
 */
const addTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, password, propertyId } = req.body;
        const { adminId } = req.params;
        // Check if the admin exists
        const adminUser = yield user_1.UserModel.findById(adminId);
        if (!adminUser)
            return res.status(404).json({ message: "Admin not found" });
        if (adminUser.role !== "admin") {
            return res.status(403).json({ message: "Only admins can add tenants" });
        }
        // Check if property exists
        const property = yield property_1.PropertyModel.findById(propertyId);
        if (!property)
            return res.status(404).json({ message: "Property not found" });
        // Check if tenant with same email exists
        const existingTenant = yield user_1.UserModel.findOne({ email, role: "tenant" });
        if (existingTenant)
            return res.status(400).json({ message: "Tenant already exists" });
        // Hash password
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Create new tenant as a user with the "tenant" role
        const newTenant = new user_1.UserModel({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "tenant",
            properties: [propertyId], // Add property to tenant's properties array
            estate: adminUser.estate, // Link tenant to the same estate as the admin
        });
        yield newTenant.save();
        // Add the tenant's ID to the property's tenants array
        property.tenants && property.tenants.push(newTenant._id);
        property.status = property_1.PropertyStatus.OCCUPIED;
        yield property.save();
        return res.status(201).json({ message: "Tenant added successfully", tenant: newTenant });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.addTenant = addTenant;
/**
 * @desc Get all tenants in an estate
 * @route GET /api/tenants/:adminId
 * @access Admin Only
 */
const getAllTenants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.params;
        // Check if admin exists
        const adminUser = yield user_1.UserModel.findById(adminId);
        if (!adminUser)
            return res.status(404).json({ message: "Admin not found" });
        if (adminUser.role !== "admin") {
            return res.status(403).json({ message: "Only admins can view tenants" });
        }
        // Get all tenants in the estate
        const tenants = yield user_1.UserModel.find({ estate: adminUser.estate, role: "tenant" }).populate("properties estate");
        return res.status(200).json({ message: "successfully fetched all tenats", data: { tenants } });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.getAllTenants = getAllTenants;
/**
 * @desc Get tenant details
 * @route GET /api/tenants/details/:tenantId
 * @access Admin/Tenant
 */
const getTenantById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.params;
        const tenant = yield user_1.UserModel.findOne({ _id: tenantId, role: "tenant" }).populate("properties");
        if (!tenant)
            return res.status(404).json({ message: "Tenant not found" });
        return res.status(200).json({ tenant });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.getTenantById = getTenantById;
/**
 * @desc Update tenant details
 * @route PUT /api/tenants/:tenantId
 * @access Admin Only
 */
const updateTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.params;
        const updateData = req.body;
        const tenant = yield user_1.UserModel.findOneAndUpdate({ _id: tenantId, role: "tenant" }, updateData, { new: true });
        if (!tenant)
            return res.status(404).json({ message: "Tenant not found" });
        return res.status(200).json({ message: "Tenant updated successfully", tenant });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.updateTenant = updateTenant;
/**
 * @desc Remove a tenant from a property
 * @route DELETE /api/tenants/:tenantId
 * @access Admin Only
 */
const removeTenant = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tenantId } = req.params;
        const tenant = yield user_1.UserModel.findOne({ _id: tenantId, role: "tenant" });
        if (!tenant)
            return res.status(404).json({ message: "Tenant not found" });
        // Remove tenant from all properties
        yield property_1.PropertyModel.updateMany({ tenants: tenant._id }, { $pull: { tenants: tenant._id } });
        // Delete tenant
        yield user_1.UserModel.findByIdAndDelete(tenantId);
        return res.status(200).json({ message: "Tenant removed successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
});
exports.removeTenant = removeTenant;
