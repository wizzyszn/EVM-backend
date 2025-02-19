"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstateModel = void 0;
const mongoose_1 = require("mongoose");
const EstateSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }, // Estate Manager
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true
});
exports.EstateModel = (0, mongoose_1.model)("Estate", EstateSchema);
