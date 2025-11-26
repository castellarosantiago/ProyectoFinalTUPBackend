### Ventas
# Listar todas las ventas
GET http://localhost:5000/api/sales

# Filtrar por fechas
GET http://localhost:5000/api/sales?startDate=2024-11-01&endDate=2024-11-30

# Filtrar por usuario
GET http://localhost:5000/api/sales?userId=XXX

# Ver detalle
GET http://localhost:5000/api/sales/XXX

# Registrar nueva venta
POST http://localhost:5000/api/sales
Content-Type: application/json

{
  "details": [
    { "product": "ID_PRODUCTO_1", "amountSold": 2 },
    { "product": "ID_PRODUCTO_2", "amountSold": 3 }
  ]
}