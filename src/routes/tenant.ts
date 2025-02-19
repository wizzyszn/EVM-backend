import {Router} from "express";
import { addTenant, getAllTenants } from "../controllers/tenant";

const tenantRouter  = Router();

tenantRouter.post("/:adminId", addTenant)
tenantRouter.get("/:adminId", getAllTenants)
export default tenantRouter;