import { Request, Response } from "express";
import CategoryController from "../controllers/category.controller";
import CategoryRepository from "../repositories/Category.repository";

jest.mock("../repositories/Category.repository");

describe("CategoryController", () => {
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
        jest.clearAllMocks();
    });

    describe("getCategories", () => {
        it("debería devolver todas las categorías con un estado 200", async () => {
            const mockCategories = [{ name: "Electrónica" }, { name: "Hogar" }];
            (CategoryRepository.getCategories as jest.Mock).mockResolvedValue(
                mockCategories
            );

            await CategoryController.getCategories(req as Request, res as Response);

            expect(CategoryRepository.getCategories).toHaveBeenCalledTimes(1);
            expect(status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalledWith(mockCategories);
        });

        it("debería devolver un error 500 si el repositorio falla", async () => {
            const error = new Error("Database error");
            (CategoryRepository.getCategories as jest.Mock).mockRejectedValue(error);

            await CategoryController.getCategories(req as Request, res as Response);

            expect(status).toHaveBeenCalledWith(500);
        });
    });
});
