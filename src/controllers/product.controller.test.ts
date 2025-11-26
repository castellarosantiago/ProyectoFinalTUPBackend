import { Request, Response } from "express";
import ProductController from "../controllers/product.controller";
import ProductRepository from "../repositories/Product.repository";

jest.mock("../repositories/Product.repository");

describe("ProductController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: jest.Mock;
    let json: jest.Mock;

    beforeEach(() => {
        // objetos mock de request y response antes de cada test
        req = {};
        json = jest.fn();
        status = jest.fn().mockReturnValue({ json });
        res = {
            status,
        };
    });

    afterEach(() => {
        // limpiamos los mocks despues de cada test
        jest.clearAllMocks();
    });

    describe("getProducts", () => {
        it("debería devolver todos los productos con un estado 200", async () => {
            const mockProducts = [
                { name: "Laptop", price: 1200 },
                { name: "Mouse", price: 25 },
            ];
            // configuramos el mock para que devuelva una lista de productos
            (ProductRepository.getProducts as jest.Mock).mockResolvedValue(
                mockProducts
            );

            await ProductController.getProducts(req as Request, res as Response);

            expect(ProductRepository.getProducts).toHaveBeenCalledTimes(1);
            expect(status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalledWith(mockProducts);
        });

        it("debería devolver un error 500 si el repositorio falla", async () => {
            const error = new Error("Database error");
            (ProductRepository.getProducts as jest.Mock).mockRejectedValue(error);

            await ProductController.getProducts(req as Request, res as Response);

            expect(status).toHaveBeenCalledWith(500);
            expect(json).toHaveBeenCalledWith({
                message:
                    "Ha ocurrido un problema al intentar obtener todos los Productos.",
                error: error.message,
            });
        });
    });
});
