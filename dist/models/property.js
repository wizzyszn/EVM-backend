"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyModel = exports.PropertyStatus = void 0;
const mongoose_1 = require("mongoose");
var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["AVAILABLE"] = "available";
    PropertyStatus["OCCUPIED"] = "occupied";
    PropertyStatus["UNDER_MAINTENANCE"] = "under_maintenance";
    PropertyStatus["SOLD"] = "sold";
})(PropertyStatus || (exports.PropertyStatus = PropertyStatus = {}));
const PropertySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    type: { type: String, enum: ["apartment", "villa", "studio", "penthouse"], required: true },
    estate: { type: mongoose_1.Schema.Types.ObjectId, ref: "Estate", required: true }, // Link to Estate
    size: { type: Number },
    price: { type: Number, required: true },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true }, //Admin
    tenants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }], //Tenants renting the property
    status: {
        type: String,
        enum: Object.values(PropertyStatus),
        default: PropertyStatus.AVAILABLE
    }
}, { timestamps: true });
exports.PropertyModel = (0, mongoose_1.model)("Property", PropertySchema);
