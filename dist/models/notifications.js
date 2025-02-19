"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    recipient: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["payment", "maintenance", "lease"], required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
exports.NotificationModel = (0, mongoose_1.model)("Notification", NotificationSchema);
