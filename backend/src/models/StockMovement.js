import mongoose from "mongoose";


const stockMovementSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    type: {
        type: String,
        enum: ["IN", "OUT"],
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    reason: {
        type: String,
        required: true,
        trim: true
    }

},
{
    timestamps: true
});


const StockMovement = mongoose.model(
    "StockMovement",
    stockMovementSchema
);


export default StockMovement;