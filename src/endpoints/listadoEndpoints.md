### Ventas
# Listar todas las ventas
GET http://localhost:5000/api/sales

# Filtrar por fechas
GET http://localhost:5000/api/sales?startDate=2024-11-01&endDate=2024-11-30

# Filtrar por usuario
GET http://localhost:5000/api/sales?userId=XXX

# Ver detalle
GET http://localhost:5000/api/sales/XXX