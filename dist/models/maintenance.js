"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRequestModel = void 0;
const mongoose_1 = require("mongoose");
const MaintenanceRequestSchema = new mongoose_1.Schema({
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: "Property", required: true },
    tenant: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["pending", "in-progress", "resolved"], default: "pending" },
}, { timestamps: true });
exports.MaintenanceRequestModel = (0, mongoose_1.model)("MaintenanceRequest", MaintenanceRequestSchema);
