import mongoose from "mongoose";


const supplierSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    contactEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true
    }

});


const Supplier = mongoose.model(
    "Supplier",
    supplierSchema
);


export default Supplier;