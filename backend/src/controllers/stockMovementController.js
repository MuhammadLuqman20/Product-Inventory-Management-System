import mongoose from "mongoose";
import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";


// Add stock movement
// POST /api/products/:id/stock-movements

export const createStockMovement = async (req, res, next) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();

        const { type, quantity, reason } = req.body;


        const product = await Product.findById(req.params.id)
            .session(session);


        if (!product) {

            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }


        // Validate OUT stock

        if (
            type === "OUT" &&
            quantity > product.quantityInStock
        ) {

            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });

        }


        // Update product quantity

        if (type === "IN") {

            product.quantityInStock += quantity;

        }


        if (type === "OUT") {

            product.quantityInStock -= quantity;

        }


        await product.save({ session });



        // Create movement record

        const movement = await StockMovement.create(
            [
                {
                    product: product._id,
                    type,
                    quantity,
                    reason
                }
            ],
            {
                session
            }
        );



        await session.commitTransaction();



        res.status(201).json({

            success: true,

            data: {
                product,
                movement: movement[0]
            }

        });



    } catch (error) {

        await session.abortTransaction();

        next(error);

    } finally {

        session.endSession();

    }

};

// @desc Get stock movement history of product
// @route GET /api/products/:id/stock-movements

export const getStockMovementHistory = async (req, res, next) => {

    try {

        const product = await Product.findById(
            req.params.id
        );


        if(!product){

            return res.status(404).json({

                success:false,
                message:"Product not found"

            });

        }



        const movements = await StockMovement.find({
            product: req.params.id
        })
        .sort({
            createdAt:1
        });



        let balance = 0;


        const history = movements.map((movement)=>{


            if(movement.type === "IN"){

                balance += movement.quantity;

            }


            if(movement.type === "OUT"){

                balance -= movement.quantity;

            }



            return {

                id: movement._id,

                type: movement.type,

                quantity: movement.quantity,

                reason: movement.reason,

                balance,

                date: movement.createdAt

            };


        });



        res.status(200).json({

            success:true,

            product:{
                id:product._id,
                name:product.name
            },

            history

        });



    } catch(error){

        next(error);

    }

};