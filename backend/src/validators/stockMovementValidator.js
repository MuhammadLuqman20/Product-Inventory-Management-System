import { body } from "express-validator";


export const stockMovementValidator = [

    body("type")
        .notEmpty()
        .withMessage("Movement type is required")
        .bail()
        .isIn(["IN", "OUT"])
        .withMessage("Movement type must be IN or OUT"),


    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .bail()
        .isInt({ min: 1 })
        .withMessage("Quantity must be greater than zero"),


    body("reason")
        .trim()
        .notEmpty()
        .withMessage("Reason is required")

];