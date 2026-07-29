import { body } from "express-validator";


export const categoryValidator = [

    body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters"),


    body("description")
        .optional()
        .trim()

];