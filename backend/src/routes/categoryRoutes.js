import express from "express";
import { categoryValidator } from "../validators/categoryValidator.js";
import { validate } from "../middleware/validate.js";

import {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController.js";

import {
    protect,
    authorize
} from "../middleware/authMiddleware.js";


const router = express.Router();

router.post(
    "/",
    protect,
    authorize("Admin"),
    categoryValidator,
    validate,
    createCategory
);


router.get(
    "/",
    protect,
    authorize("Admin","Staff"),
    getCategories
);


router.get(
    "/:id",
    protect,
    authorize("Admin","Staff"),
    getCategoryById
);


router.put(
    "/:id",
    protect,
    authorize("Admin"),
    categoryValidator,
    validate,
    updateCategory
);


router.delete(
    "/:id",
    protect,
    authorize("Admin"),
    deleteCategory
);


export default router;