import jwt from "jsonwebtoken";
import User from "../models/User.js";


// Protect routes (JWT verification)

export const protect = async (req, res, next) => {

    try {

        let token;


        // Check Authorization header

        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ){

            token = req.headers.authorization.split(" ")[1];

        }



        if(!token){

            return res.status(401).json({

                success:false,
                message:"Not authorized, no token"

            });

        }



        // Verify token

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );



        // Get user from database

        req.user = await User.findById(
            decoded.id
        ).select("-password");



        if(!req.user){

            return res.status(401).json({

                success:false,
                message:"User not found"

            });

        }



        next();



    } catch(error){

        return res.status(401).json({

            success:false,
            message:"Not authorized, token failed"

        });

    }

};




// Role based authorization

export const authorize = (...roles) => {

    return (req, res, next) => {


        if(!roles.includes(req.user.role)){

            return res.status(403).json({

                success:false,
                message:"Access denied"

            });

        }


        next();

    };

};