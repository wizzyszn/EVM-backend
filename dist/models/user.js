"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["TENANT"] = "tenant";
})(UserRole || (exports.UserRole = UserRole = {}));
;
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authenticated: { type: Boolean, default: false },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    properties: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Property" }], //properties owned or rented
    estate: { type: mongoose_1.Schema.Types.ObjectId, ref: "Estate" }, // Link to Estate
}, { timestamps: true });
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
