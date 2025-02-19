import {Router} from "express";
import { createProperty, getAllPropertiesInEstate } from "../controllers/property";

const propertyRouter  = Router();
propertyRouter.post("/", createProperty);
propertyRouter.get("/:estateId", getAllPropertiesInEstate);

export default propertyRouter;