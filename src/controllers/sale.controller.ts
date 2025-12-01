import { Request, Response } from "express";
import SaleRepository from "../repositories/Sale.repository";
import productRepository from "../repositories/Product.repository";
import { ProductInterface } from "../types/product.interface";
import { ISaleDetail } from "../types/sales.interface";
import { SaleSchema } from "../schemas/sale.schema";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";

// Listar ventas con filtros opcionales (por fecha y usuario)
export const listSales = async (req: Request, res: Response) => {
  try {
    const saleRepository = new SaleRepository();
    const { startDate, endDate, userId } = req.query;

    // construir filtro dinamico
    const filter: any = {};

    // filtro por rango de fechas
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) {
        filter.date.$gte = new Date(startDate as string);
      }
      if (endDate) {
        // agregar 1 dia para incluir todo el dia final
        const end = new Date(endDate as string);
        end.setDate(end.getDate() + 1);
        filter.date.$lt = end;
      }
    }

    // filtro por usuario
    if (userId) {
      filter.user = userId;
    }

    // buscar ventas usando el repositorio
    const sales = await saleRepository.findAll(filter);

    return res.status(200).json({
      message: "Ventas obtenidas",
      total: sales.length,
      sales: sales,
    });
  } catch (err) {
    console.error("List sales error", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener detalle de una venta especifica
export const getSaleDetail = async (req: Request, res: Response) => {
  try {
    const saleRepository = new SaleRepository();
    const { id } = req.params;

    // validar que el id sea valido
    if (!id) {
      return res.status(400).json({ message: "El ID de venta es requerido" });
    }

    // buscar venta por id usando el repositorio
    const sale = await saleRepository.findById(id);

    // verificar si existe la venta
    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    return res.status(200).json({
      message: "Detalle de venta obtenido",
      sale: sale,
    });
  } catch (err) {
    console.error("Get sale detail error", err);
    return res.status(500).json({ message: "Error del servidor" });
  }
};

// registrar una nueva venta
export const createSale = async (req: Request, res: Response) => {
  try {
    const saleRepository = new SaleRepository();
    const { details } = req.body;
    const userId = (req as any).user.id; // desde el middleware de autenticacion

    // validar entrada con schema de zod
    const validatedData = SaleSchema.parse({ details });

    // construir array de detalles de venta con calculos
    let total = 0;
    const saleDetails: ISaleDetail[] = [];

    // procesar cada detalle de producto usando el repositorio de productos
    for (const detail of validatedData.details) {
      const productId = new mongoose.Types.ObjectId(detail.product);

      // buscar producto en BD
      const product = (await productRepository.findProductById(
        productId
      )) as ProductInterface | null;

      if (!product) {
        return res
          .status(404)
          .json({ message: `Producto ${detail.product} no encontrado` });
      }
      // validar que hay stock disponible
      if (product.stock < detail.amountSold) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`,
        });
      }

      // calcular subtotal desde el interface de Product
      const subtotal = product.price * detail.amountSold;
      total += subtotal;

      // agregar detalle a la venta
      saleDetails.push({
        product: productId,
        name: product.name,
        amountSold: detail.amountSold,
        subtotal: subtotal,
      });

      // actualizar stock del producto
      const updated = await productRepository.decrementStock(
        productId,
        detail.amountSold
      );
      if (!updated) {
        return res.status(400).json({
          message: `No se pudo decrementar stock para ${product.name}.`,
        });
      }
    }

    // crear la venta con el total calculado
    const newSale = await saleRepository.create({
      date: new Date(),
      user: userId,
      detail: saleDetails,
      total: total,
    });

    return res.status(201).json({
      message: "Venta registrada exitosamente",
      sale: newSale,
    });
  } catch (err) {
    console.error("Create sale error", err);

    // validar errores de zod
    if (err instanceof Error && err.message.includes("ZodError")) {
      return res.status(400).json({ message: "Datos de venta inválidos" });
    }

    return res.status(500).json({ message: "Error del servidor" });
  }
};

// Generar reporte de ventas en PDF
export const generateReport = async (req: Request, res: Response) => {
  try {
    const saleRepository = new SaleRepository();
    const sales = await saleRepository.findAll({});

    const doc = new PDFDocument();

    // Configurar headers para descarga
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reporte_ventas.pdf");

    doc.pipe(res);

    // Titulo
    doc.fontSize(20).text("Reporte de Ventas", { align: "center" });
    doc.moveDown();

    // Tabla simple
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`, { align: "right" });
    doc.moveDown();

    doc.fontSize(14).text("Detalle de Ventas", { underline: true });
    doc.moveDown();

    let totalSales = 0;

    sales.forEach((sale, index) => {
      const date = new Date(sale.date).toLocaleDateString();
      const amount = sale.total.toFixed(2);
      totalSales += sale.total;

      doc.fontSize(12).text(`${index + 1}. Fecha: ${date} - Total: $${amount}`);
      
      // Listar productos de la venta
      sale.detail.forEach((d: any) => {
         doc.fontSize(10).text(`   - ${d.name} x ${d.amountSold} ($${d.subtotal})`, { indent: 20 });
      });
      
      doc.moveDown(0.5);
    });

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(16).text(`Total General: $${totalSales.toFixed(2)}`, { align: "right" });

    doc.end();

  } catch (err) {
    console.error("Generate report error", err);
    return res.status(500).json({ message: "Error al generar reporte" });
  }
};

export default { listSales, getSaleDetail, createSale, generateReport };
