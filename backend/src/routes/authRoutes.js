import express from "express";

import {
    registerUser,
    loginUser
} from "../controllers/authController.js";


const router = express.Router();


// Register User
// POST /api/auth/register

router.post(
    "/register",
    registerUser
);


// Login User
// POST /api/auth/login

router.post(
    "/login",
    loginUser
);


export default router;