"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorLogModel = void 0;
const mongoose_1 = require("mongoose");
const VisitorLogSchema = new mongoose_1.Schema({
    visitorName: { type: String, required: true },
    purpose: { type: String, required: true },
    tenant: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    entryTime: { type: Date, required: true },
    exitTime: { type: Date },
}, { timestamps: true });
exports.VisitorLogModel = (0, mongoose_1.model)("VisitorLog", VisitorLogSchema);
