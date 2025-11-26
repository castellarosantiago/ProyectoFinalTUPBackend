import { Router } from "express";
import categoryController from "../controllers/category.controller";
import { categoryBodySchema } from "../schemas/category.schema";
import { idSchema } from "../schemas/id.schema";
import { validate } from "../middlewares/validator.middleware";
import { authorizeAdmin } from "../middlewares/role.middleware";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get("/:id", validate(idSchema, "params") ,categoryController.findCategoryById);
categoryRouter.delete("/:id", authorizeAdmin ,validate(idSchema, "params"), categoryController.deleteCategory);
categoryRouter.post("/", authorizeAdmin, validate(categoryBodySchema, "body"), categoryController.createCategory);
categoryRouter.put("/:id", authorizeAdmin, validate(idSchema, "params"), validate(categoryBodySchema, "body"), categoryController.updateCategory);

export default categoryRouter;