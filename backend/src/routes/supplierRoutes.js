import express from "express";

import {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} from "../controllers/supplierController.js";


import { supplierValidator } from "../validators/supplierValidator.js";
import { validate } from "../middleware/validate.js";
import {
    protect,
    authorize
} from "../middleware/authMiddleware.js";


const router = express.Router();


router.post(
    "/",
    protect,
    authorize("Admin"),
    supplierValidator,
    validate,
    createSupplier
);


router.get(
    "/",
    protect,
    authorize("Admin","Staff"),
    getSuppliers
);


router.get(
    "/:id",
    protect,
    authorize("Admin","Staff"),
    getSupplierById
);


router.put(
    "/:id",
    protect,
    authorize("Admin"),
    supplierValidator,
    validate,
    updateSupplier
);


router.delete(
    "/:id",
    protect,
    authorize("Admin"),
    deleteSupplier
);


export default router;