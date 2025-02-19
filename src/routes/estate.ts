import { Router } from "express";
import { createEstate } from "../controllers/estate";
const estateRouter = Router();
estateRouter.post("/:adminId", createEstate);

export default estateRouter