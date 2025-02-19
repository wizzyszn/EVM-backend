"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaseModel = void 0;
const mongoose_1 = require("mongoose");
const LeaseSchema = new mongoose_1.Schema({
    tenant: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: "Property", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rentAmount: { type: Number, required: true },
    status: { type: String, enum: ["active", "terminated", "pending"], default: "pending" },
}, { timestamps: true });
exports.LeaseModel = (0, mongoose_1.model)("Lease", LeaseSchema);
