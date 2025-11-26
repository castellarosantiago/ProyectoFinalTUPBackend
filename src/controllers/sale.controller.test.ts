import { Request, Response } from "express";
import { listSales } from "../controllers/sale.controller";
import SaleRepository from "../repositories/Sale.repository";

jest.mock("../repositories/Sale.repository");

// creamos un mock de la instancia del repositorio
const mockFindAll = jest.fn();
const mockSaleRepository = {
    findAll: mockFindAll,
};
(SaleRepository as jest.Mock).mockImplementation(() => mockSaleRepository);

describe("SaleController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let status: jest.Mock;
    let json: jest.Mock;

    beforeEach(() => {
        req = {
            query: {},
        };
        json = jest.fn();
        status = jest.fn().mockReturnValue({ json });
        res = {
            status,
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("listSales", () => {
        it("debería devolver todas las ventas con un estado 200", async () => {
            const mockSales = [{ total: 1500 }, { total: 300 }];
            mockFindAll.mockResolvedValue(mockSales);

            await listSales(req as Request, res as Response);

            expect(mockFindAll).toHaveBeenCalledTimes(1);
            expect(status).toHaveBeenCalledWith(200);
            expect(json).toHaveBeenCalledWith({
                message: "Ventas obtenidas",
                total: mockSales.length,
                sales: mockSales,
            });
        });

        it("debería devolver un error 500 si el repositorio falla", async () => {
            const error = new Error("Database error");
            mockFindAll.mockRejectedValue(error);

            await listSales(req as Request, res as Response);

            expect(status).toHaveBeenCalledWith(500);
            expect(json).toHaveBeenCalledWith({ message: "Error del servidor" });
        });
    });
});
