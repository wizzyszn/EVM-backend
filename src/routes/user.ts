import { Router } from "express";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user";
const userRouter = Router();
userRouter.get("/",getAllUsers );
userRouter.get("/:id",getUserById );
userRouter.put("/:id", updateUser );
userRouter.delete("/:id", deleteUser);

export default userRouter