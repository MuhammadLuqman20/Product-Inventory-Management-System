import express from "express";
import upload from "../middleware/uploadMiddleware.js";

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    exportProductsCSV,
    importProductsCSV
} from "../controllers/productController.js";


import { productValidator } from "../validators/productValidator.js";
import { validate } from "../middleware/validate.js";


import {
    protect,
    authorize
} from "../middleware/authMiddleware.js";


const router = express.Router();



// Create Product
// POST /api/products

router.post(
    "/",
    protect,
    authorize("Admin"),
    productValidator,
    validate,
    createProduct
);



// Export Products CSV
// GET /api/products/export

router.get(
    "/export",
    protect,
    authorize("Admin","Staff"),
    exportProductsCSV
);



// Import Products CSV
// POST /api/products/import

router.post(
    "/import",
    protect,
    authorize("Admin"),
    upload.single("file"),
    importProductsCSV
);



// Get All Products
// GET /api/products

router.get(
    "/",
    protect,
    authorize("Admin","Staff"),
    getProducts
);



// Get Single Product
// GET /api/products/:id

router.get(
    "/:id",
    protect,
    authorize("Admin","Staff"),
    getProductById
);



// Update Product
// PUT /api/products/:id

router.put(
    "/:id",
    protect,
    authorize("Admin"),
    productValidator,
    validate,
    updateProduct
);



// Delete Product
// DELETE /api/products/:id

router.delete(
    "/:id",
    protect,
    authorize("Admin"),
    deleteProduct
);



export default router;