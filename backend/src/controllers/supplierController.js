import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";

// Create Supplier
// POST /api/suppliers
export const createSupplier = async (req, res, next) => {

    try {

        const {
            name,
            contactEmail,
            phone,
            address
        } = req.body;


        const supplier = await Supplier.create({
            name,
            contactEmail,
            phone,
            address
        });


        res.status(201).json({
            success: true,
            data: supplier
        });


    } catch (error) {

        next(error);

    }

};


// Get all suppliers
// GET /api/suppliers
export const getSuppliers = async (req, res, next) => {

    try {

        const suppliers = await Supplier.find();


        res.status(200).json({
            success: true,
            count: suppliers.length,
            data: suppliers
        });


    } catch (error) {

        next(error);

    }

};



// Get single supplier
// GET /api/suppliers/:id
export const getSupplierById = async (req, res, next) => {

    try {

        const supplier = await Supplier.findById(req.params.id);


        if(!supplier){
            return res.status(404).json({
                success:false,
                message:"Supplier not found"
            });
        }


        res.status(200).json({
            success:true,
            data:supplier
        });


    } catch (error) {

        next(error);

    }

};


// Update supplier
// PUT /api/suppliers/:id
export const updateSupplier = async (req, res, next) => {

    try {

        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
                runValidators:true
            }
        );


        if(!supplier){
            return res.status(404).json({
                success:false,
                message:"Supplier not found"
            });
        }


        res.status(200).json({
            success:true,
            data:supplier
        });


    } catch (error) {

        next(error);

    }

};

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id

export const deleteSupplier = async (req,res,next)=>{

    try {


        const products = await Product.findOne({
            supplier:req.params.id
        });


        if(products){

            return res.status(409).json({

                error:{
                    code:"SUPPLIER_IN_USE",
                    message:"Cannot delete supplier because products are assigned to it"
                }

            });

        }



        const supplier = await Supplier.findByIdAndDelete(
            req.params.id
        );


        if(!supplier){

            return res.status(404).json({

                success:false,
                message:"Supplier not found"

            });

        }



        res.status(200).json({

            success:true,
            message:"Supplier deleted successfully"

        });



    }catch(error){

        next(error);

    }

};