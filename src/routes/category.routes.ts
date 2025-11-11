import { Router } from "express";
import categoryController from "../controllers/category.controller";
import { categoryBodySchema, categoryIdSchema } from "../schemas/category.schema";
import { validate } from "../middlewares/validator.middleware";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategories);
categoryRouter.get("/:id", validate(categoryIdSchema, "params") ,categoryController.findCategoryById);
categoryRouter.delete("/:id", validate(categoryIdSchema, "params"), categoryController.deleteCategory);
categoryRouter.post("/", validate(categoryBodySchema, "body"), categoryController.createCategory);
categoryRouter.put("/:id", validate(categoryIdSchema, "params"), validate(categoryBodySchema, "body"), categoryController.updateCategory);

export default categoryRouter;