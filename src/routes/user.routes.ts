import { Router } from "express";
import userController from "../controllers/user.controller";
import { idSchema } from "../schemas/id.schema";
import { validate } from "../middlewares/validator.middleware";
import authenticate from "../middlewares/auth.middleware";
import { authorizeAdmin } from "../middlewares/role.middleware";
import { userBodyPutSchema } from "../schemas/user.schema";

const userRouter = Router();

// Rutas protegidas, solo el admin las puede utilizar
userRouter.get("/", authenticate, authorizeAdmin, userController.getUsers);
userRouter.delete("/:id", authenticate, authorizeAdmin, validate(idSchema, "params"), userController.deleteUser);
userRouter.put("/:id", authenticate, authorizeAdmin, validate(idSchema, "params"), validate(userBodyPutSchema, "body"), userController.updateUser);

export default userRouter;