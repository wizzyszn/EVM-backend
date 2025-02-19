"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_1 = require("../controllers/property");
const propertyRouter = (0, express_1.Router)();
propertyRouter.post("/", property_1.createProperty);
propertyRouter.get("/:estateId", property_1.getAllPropertiesInEstate);
exports.default = propertyRouter;
