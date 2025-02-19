"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModel = void 0;
const mongoose_1 = require("mongoose");
const PaymentSchema = new mongoose_1.Schema({
    lease: { type: mongoose_1.Schema.Types.ObjectId, ref: "Lease", required: true },
    tenant: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["paid", "pending", "overdue"], required: true },
    method: { type: String, enum: ["cash", "bank transfer", "card"], required: true },
}, { timestamps: true });
exports.PaymentModel = (0, mongoose_1.model)("Payment", PaymentSchema);
