import { Router } from "express";
import productController from "../controllers/product.controller";
import { productBodyCreateSchema, productBodyPutSchema } from "../schemas/product.schema";
import { idSchema } from "../schemas/id.schema";
import { validate } from "../middlewares/validator.middleware";

const productRouter = Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/:id", validate(idSchema, "params") ,productController.findProductById);
productRouter.delete("/:id", validate(idSchema, "params"), productController.deleteProduct);
productRouter.post("/", validate(productBodyCreateSchema, "body"), productController.createProduct);
productRouter.put("/:id", validate(idSchema, "params"), validate(productBodyPutSchema, "body"), productController.updateProduct);

export default productRouter;