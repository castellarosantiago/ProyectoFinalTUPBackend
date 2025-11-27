import { Router } from "express";
import categoryController from "../controllers/category.controller";
import { categoryBodySchema } from "../schemas/category.schema";
import { idSchema } from "../schemas/id.schema";
import { validate } from "../middlewares/validator.middleware";
import authenticate from "../middlewares/auth.middleware";

const categoryRouter = Router();

categoryRouter.get("/", authenticate, categoryController.getCategories);
categoryRouter.get("/:id", authenticate, validate(idSchema, "params") ,categoryController.findCategoryById);
categoryRouter.delete("/:id", authenticate, validate(idSchema, "params"), categoryController.deleteCategory);
categoryRouter.post("/", authenticate, validate(categoryBodySchema, "body"), categoryController.createCategory);
categoryRouter.put("/:id", authenticate, validate(idSchema, "params"), validate(categoryBodySchema, "body"), categoryController.updateCategory);

export default categoryRouter;