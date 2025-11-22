import { Router } from "express";
import productController from "../controllers/product.controller";
import { productBodyCreateSchema, productBodyPutSchema } from "../schemas/product.schema";
import { validate } from "../middlewares/validator.middleware";

const productRouter = Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/:id", validate(, "params") ,productController.findProductById);
productRouter.delete("/:id", validate(, "params"), productController.deleteProduct);
productRouter.post("/", validate(productBodyCreateSchema, "body"), productController.createProduct);
productRouter.put("/:id", validate(, "params"), validate(productBodyPutSchema, "body"), productController.updateProduct);

export default productRouter;