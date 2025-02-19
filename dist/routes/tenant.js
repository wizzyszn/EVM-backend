"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tenant_1 = require("../controllers/tenant");
const tenantRouter = (0, express_1.Router)();
tenantRouter.post("/:adminId", tenant_1.addTenant);
tenantRouter.get("/:adminId", tenant_1.getAllTenants);
exports.default = tenantRouter;
