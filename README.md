# Product Inventory Management System

A full-stack project for managing inventory across products, categories, suppliers, and stock movements.

## Repository structure

- `backend/`: Node.js + Express API with MongoDB and Mongoose.
- `frontend/`: React + Vite dashboard and user interface.

## What this project includes

### Backend
- RESTful endpoints for products, categories, suppliers, and stock movements
- Input validation and centralized error handling
- Inventory updates with stock in/out management
- MongoDB data models for Product, Category, Supplier, and StockMovement
- Seed script and API documentation

### Frontend
- React pages for login, dashboard, products, categories, and suppliers
- Sidebar navigation and theme toggling
- Product detail pages and filtered views
- API service layer for backend calls

## How to run locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Notes

- The backend and frontend are separate projects inside the same repository.
- Use the `backend` folder for server/API work and the `frontend` folder for UI work.
- Ensure your MongoDB connection string is configured in `backend/.env`.
