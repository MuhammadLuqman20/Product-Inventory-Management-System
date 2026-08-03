# Product Inventory Management System

A full-stack inventory management system that enables organizations to manage products, categories, suppliers, and stock movements through a structured REST API and modern web interface.

The system provides efficient inventory tracking, data validation, stock control, and scalable backend architecture.

---

# Overview

Product Inventory Management System is designed to simplify inventory operations by providing:

- Product management
- Category and supplier management
- Stock movement tracking
- Inventory updates
- Search and filtering capabilities
- Pagination support
- Data validation and error handling

The backend follows a clean MVC architecture with a RESTful API design.

---

# Features

## Product Management

- Create, update, retrieve, and delete products
- Search products by name and SKU
- Filter products by category
- Filter products by supplier
- Filter products by stock availability
- Paginated product listing


## Category Management

- Create and manage product categories
- Maintain category-product relationships
- Prevent invalid category references


## Supplier Management

- Create and manage suppliers
- Maintain supplier-product relationships


## Inventory Management

- Record stock IN and OUT transactions
- Automatically update product inventory
- Prevent negative inventory
- Maintain stock movement records
- Ensure consistent stock updates using database transactions


## Validation & Error Handling

- Request validation for all write operations
- Unique SKU validation
- Email format validation
- Quantity and price validation
- Centralized error handling
- Consistent API error responses

---

# Tech Stack

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose ODM

## Libraries & Tools

- Express Validator
- Helmet
- Morgan
- CORS
- dotenv

## Database

- MongoDB Atlas

---

# Architecture

The backend follows the MVC (Model-View-Controller) architecture:

```
Client Request
      |
      |
    Routes
      |
      |
 Controllers
      |
      |
    Models
      |
      |
  MongoDB Database
```

---

# Project Structure

```
backend
│
├── src
│   │
│   ├── config
│   │   └── db.js
│   │
│   ├── controllers
│   │   ├── productController.js
│   │   ├── categoryController.js
│   │   ├── supplierController.js
│   │   └── stockMovementController.js
│   │
│   ├── middleware
│   │   ├── errorMiddleware.js
│   │   └── validate.js
│   │
│   ├── models
│   │   ├── Product.js
│   │   ├── Category.js
│   │   ├── Supplier.js
│   │   └── StockMovement.js
│   │
│   ├── routes
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── supplierRoutes.js
│   │   └── stockMovementRoutes.js
│   │
│   ├── validators
│   │
│   ├── seed
│   │   └── seed.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── API_DOCUMENTATION.md
└── README.md
```

---

# Database Design

The application uses the following entities:

```
Category
    |
    |
    |----< Product >---- Supplier
                  |
                  |
                  |
            StockMovement
```

Relationships:

- A category can contain multiple products
- A supplier can provide multiple products
- A product can have multiple stock movements

---

# Installation

## Clone Repository

```bash
git clone https://github.com/MuhammadLuqman20/Product-Inventory-Management-System.git
```

## Navigate to Backend

```bash
cd backend
```

## Install Dependencies

```bash
npm install
```

---

# Environment Configuration

Create a `.env` file in the backend root directory.

Example:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string
```

---

# Running the Application

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
npm start
```

The server will start at:

```
http://localhost:5000
```

---

# Database Seeding

The project includes sample data generation.

Run:

```bash
npm run seed
```

Seed data includes:

- Categories
- Suppliers
- Products

---

# API Documentation

Complete API documentation including:
- Endpoints
- Request formats
- Response structures
- Error responses

is available in:

```
API_DOCUMENTATION.md
```

---

# API Overview

Base URL:

```
http://localhost:5000/api
```

## Products

```
POST    /products
GET     /products
GET     /products/:id
PUT     /products/:id
DELETE  /products/:id
POST    /products/:id/stock-movements
```

## Categories

```
POST    /categories
GET     /categories
GET     /categories/:id
PUT     /categories/:id
DELETE  /categories/:id
```

## Suppliers

```
POST    /suppliers
GET     /suppliers
GET     /suppliers/:id
PUT     /suppliers/:id
DELETE  /suppliers/:id
```

---

# Query Features

Product listing supports:

- Search
- Category filtering
- Supplier filtering
- Stock status filtering
- Pagination

Example:

```
GET /api/products?search=laptop&page=1&pageSize=10
```

---

# Error Handling

The API follows a consistent error response format:

```json
{
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input"
    }
}
```

---

# Security Practices

Implemented:

- Environment variable protection
- Request validation
- Secure HTTP headers using Helmet
- Controlled CORS configuration
- Input sanitization through validation

---
