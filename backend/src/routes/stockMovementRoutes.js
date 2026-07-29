import express from "express";

import {
    createStockMovement,
    getStockMovementHistory
} from "../controllers/stockMovementController.js";

import { stockMovementValidator } from "../validators/stockMovementValidator.js";
import { validate } from "../middleware/validate.js";
import {
    protect,
    authorize
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/products/:id/stock-movements",
    protect,
    authorize("Admin","Staff"),
    createStockMovement
);


router.get(
    "/products/:id/stock-movements",
    protect,
    authorize("Admin","Staff"),
    getStockMovementHistory
);
export default router;