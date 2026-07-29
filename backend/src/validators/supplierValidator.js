import { body } from "express-validator";


export const supplierValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Supplier name is required")
        .bail()
        .isLength({ min: 3 })
        .withMessage("Supplier name must be at least 3 characters"),


    body("contactEmail")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Please provide a valid email"),


    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required"),


    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required")

];