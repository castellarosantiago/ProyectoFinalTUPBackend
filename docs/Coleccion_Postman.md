# Configuración de Environment y Tokens

1.  En **Authorization** de la colección:
    -   Seleccionar **Bearer Token**\
    -   Colocar: `{{token}}`
2.  En **Variables de la colección**, agregar la variable:
    -   `token`
3.  En el endpoint **Login**, en **Post‑Response Script**, colocar:

``` js
const json = pm.response.json();

if (json.token) {
    pm.environment.set("token", json.token);
    console.log("Token guardado en Environment");
} else {
    console.log("No se recibió token");
}
```

4.  (Opcional) Crear un nuevo environment.

------------------------------------------------------------------------

# Endpoints

## AUTH

### POST /api/auth/register

    POST http://localhost:5000/api/auth/register
    body: {
        "name":"Admin test",
        "email":"admin10@gmail.com",
        "password":"Adminsign10",
        "rol":"admin"
    }

### POST /api/auth/login

    POST http://localhost:5000/api/auth/login
    body: {
        "email":"admin10@gmail.com",
        "password":"Adminsign10"
    }

------------------------------------------------------------------------

## CATEGORIES

    GET http://localhost:5000/api/categories
    GET http://localhost:5000/api/categories/id
    DELETE http://localhost:5000/api/categories/

### POST /api/categories

    POST http://localhost:5000/api/categories
    body: {
        "name":"Bebidas",
        "description":"Gaseosas, Jugos, Agua, Alcohol."
    }

### PUT /api/categories/id

    PUT http://localhost:5000/api/categories/id
    body: {
        "name":"Bebidas",
        "description":"Gaseosas, Jugos, Agua, Alcohol, Licuados."
    }

------------------------------------------------------------------------

## PRODUCTS

    GET http://localhost:5000/api/products
    GET http://localhost:5000/api/products/id
    GET http://localhost:5000/api/products/search/name?name=Agua
    GET http://localhost:5000/api/products/filter/price?minPrice=100&maxPrice=1000
    GET http://localhost:5000/api/products/filter/category?id_category=6928a72855d908a7199b2e0f
    DELETE http://localhost:5000/api/products/id

### POST /api/products

    POST http://localhost:5000/api/products
    body: {
        "id_category": "6928a72855d908a7199b2e0f",
        "name": "Agua",
        "price": 1500,
        "stock": 20
    }

### PUT /api/id

    PUT http://localhost:5000/api/id
    {
        "name": "Agua",
        "price": 1500,
        "stock": 15
    }

------------------------------------------------------------------------

## SALES

    GET http://localhost:5000/api/sales
    GET http://localhost:5000/api/sales?userId=id
    GET http://localhost:5000/api/sales?startDate=2024-11-01&endDate=2024-11-30
    GET http://localhost:5000/api/sales/id

### POST /api/sales

    POST http://localhost:5000/api/sales
    {
        "details": [
            {
                "product": "6928d02a954fa9823e8a3595",
                "amountSold": 1,
                "subtotal": 1500
            }
        ]
    }
