# API Endpoints

------------------------------------------------------------------------

## **CATEGORIES**

### **Crear categoría**

**POST**\
`http://localhost:5000/categories`

**Body:**

``` json
{
    "name": "Verduras"
}
```

------------------------------------------------------------------------

### **Obtener todas las categorías**

**GET**\
`http://localhost:5000/categories`

------------------------------------------------------------------------

### **Obtener una categoría por ID**

**GET**\
`http://localhost:5000/categories/6923712e44e0350c87172297`

------------------------------------------------------------------------

### **Actualizar una categoría**

**PUT**\
`http://localhost:5000/categories/6923712e44e0350c87172297`

**Body:**

``` json
{
    "name": "Verduras",
    "description": "Todo tipo de verduras"
}
```

------------------------------------------------------------------------

### **Eliminar una categoría**

**DELETE**\
`http://localhost:5000/categories/6923712e44e0350c87172297`

------------------------------------------------------------------------

------------------------------------------------------------------------

## **PRODUCTS**

### **Crear producto**

**POST**\
`http://localhost:5000/products`

**Body:** *(usar un id_category existente)*

``` json
{
    "id_category": "692372fa44e0350c8717229d",
    "name": "Tomate",
    "price": 300,
    "stock": 20
}
```

------------------------------------------------------------------------

### **Obtener todos los productos**

**GET**\
`http://localhost:5000/products`

------------------------------------------------------------------------

### **Obtener un producto por ID**

**GET**\
`http://localhost:5000/products/692373dc44e0350c871722a7`

------------------------------------------------------------------------

### **Actualizar un producto**

**PUT**\
`http://localhost:5000/products/692373dc44e0350c871722a7`

**Body:**

``` json
{
    "name": "Tomate",
    "price": 250,
    "stock": 20
}
```

------------------------------------------------------------------------

### **Eliminar un producto**

**DELETE**\
`http://localhost:5000/products/692373dc44e0350c871722a7`

------------------------------------------------------------------------

------------------------------------------------------------------------

## **Filtrado**

### **Buscar por nombre**

**GET**\
`http://localhost:5000/products/search/name?name=Tomate`

------------------------------------------------------------------------

### **Filtrar por categoría**

**GET**\
`http://localhost:5000/products/filter/category?id_category=6923759044e0350c871722b2`

------------------------------------------------------------------------

### **Filtrar por precio**

**GET**\
`http://localhost:5000/products/filter/price?minPrice=100&maxPrice=1000`
