"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const estate_1 = require("../controllers/estate");
const estateRouter = (0, express_1.Router)();
estateRouter.post("/:adminId", estate_1.createEstate);
exports.default = estateRouter;
