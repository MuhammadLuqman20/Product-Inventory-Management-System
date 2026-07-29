import { body } from "express-validator";


export const productValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Product name must be at least 3 characters"),


    body("sku")
        .trim()
        .notEmpty()
        .withMessage("SKU is required")
        .bail()
        .isLength({ min: 3 })
        .withMessage("SKU must be at least 3 characters"),


    body("unitPrice")
        .notEmpty()
        .withMessage("Unit price is required")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("Unit price must be a non-negative number"),


    body("quantityInStock")
        .notEmpty()
        .withMessage("Quantity is required")
        .bail()
        .isInt({ min: 0 })
        .withMessage("Quantity must be a non-negative integer"),


    body("category")
        .notEmpty()
        .withMessage("Category is required"),


    body("supplier")
        .notEmpty()
        .withMessage("Supplier is required")

];