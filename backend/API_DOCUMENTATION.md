# Product Inventory Management System API

Base URL:

http://localhost:5000/api


## Categories


### Create Category

POST /categories


Request:

{
    "name":"Electronics",
    "description":"Electronic products"
}


Response:

201 Created



### Get All Categories

GET /categories



### Get Single Category

GET /categories/:id



### Update Category

PUT /categories/:id



### Delete Category

DELETE /categories/:id



---

# Suppliers


### Create Supplier

POST /suppliers


Body:

{
    "name":"Tech World",
    "contactEmail":"tech@gmail.com",
    "phone":"03001234567",
    "address":"Lahore"
}



### Get Suppliers

GET /suppliers



### Get Supplier

GET /suppliers/:id



### Update Supplier

PUT /suppliers/:id



### Delete Supplier

DELETE /suppliers/:id



---

# Products


### Create Product

POST /products


Body:

{
"name":"Laptop",
"sku":"LAP001",
"unitPrice":1200,
"quantityInStock":20,
"category":"categoryId",
"supplier":"supplierId"
}



### Get Products

GET /products


Query Parameters:

search

category

supplier

status

page

pageSize



Example:

GET /products?search=laptop&page=1&pageSize=10



### Get Product

GET /products/:id



### Update Product

PUT /products/:id



### Delete Product

DELETE /products/:id



---

# Stock Movement


### Add Stock Movement

POST /products/:id/stock-movements


Body:

{
"type":"IN",
"quantity":10,
"reason":"New stock arrival"
}


Allowed Types:

IN

OUT

