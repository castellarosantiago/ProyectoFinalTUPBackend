import { Router } from "express";
import productController from "../controllers/product.controller";
import { productBodyCreateSchema, productBodyPutSchema, productFilterPriceSchema, productSearchNameSchema, productFilterIdCategorySchema } from "../schemas/product.schema";
import { idSchema } from "../schemas/id.schema";
import { validate } from "../middlewares/validator.middleware";
import authenticate from "../middlewares/auth.middleware";

const productRouter = Router();

productRouter.get("/", productController.getProducts);
productRouter.get("/:id", validate(idSchema, "params") ,productController.findProductById);
productRouter.delete("/:id", authenticate, validate(idSchema, "params"), productController.deleteProduct);
productRouter.post("/", authenticate, validate(productBodyCreateSchema, "body"), productController.createProduct);
productRouter.put("/:id", authenticate, validate(idSchema, "params"), validate(productBodyPutSchema, "body"), productController.updateProduct);
// filtrado
productRouter.get('/search/name', validate(productSearchNameSchema, "query"), productController.findProductByName);
productRouter.get('/filter/category', validate(productFilterIdCategorySchema, "query"), productController.filterByCategory);
productRouter.get('/filter/price', validate(productFilterPriceSchema, "query"), productController.filterByPrice);


export default productRouter;
