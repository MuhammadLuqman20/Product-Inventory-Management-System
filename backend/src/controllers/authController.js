import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// Generate JWT Token

const generateToken = (id, role) => {

    return jwt.sign(
        {
            id,
            role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || "7d"
        }
    );

};



// @desc Register User
// @route POST /api/auth/register

export const registerUser = async (req, res, next) => {

    try {

        const {
            name,
            email,
            password,
            role
        } = req.body;



        // Check existing user

        const existingUser = await User.findOne({
            email
        });


        if(existingUser){

            return res.status(400).json({

                success:false,
                message:"User already exists"

            });

        }



        // Hash password

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );



        const user = await User.create({

            name,
            email,
            password: hashedPassword,
            role

        });



        const token = generateToken(
            user._id,
            user.role
        );



        res.status(201).json({

            success:true,

            token,

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });



    } catch(error){

        next(error);

    }

};




// @desc Login User
// @route POST /api/auth/login

export const loginUser = async (req, res, next) => {

    try {


        const {
            email,
            password
        } = req.body;



        const user = await User.findOne({
            email
        });



        if(!user){

            return res.status(401).json({

                success:false,
                message:"Invalid credentials"

            });

        }



        const isMatch = await bcrypt.compare(
            password,
            user.password
        );



        if(!isMatch){

            return res.status(401).json({

                success:false,
                message:"Invalid credentials"

            });

        }



        const token = generateToken(
            user._id,
            user.role
        );



        res.status(200).json({

            success:true,

            token,

            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role
            }

        });



    } catch(error){

        next(error);

    }

};