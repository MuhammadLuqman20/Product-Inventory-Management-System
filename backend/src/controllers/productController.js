import Product from "../models/Product.js";
import StockMovement from "../models/StockMovement.js";
import { Parser } from "json2csv";

import csv from "csv-parser";
import { Readable } from "stream";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";

// Create Product
// POST /api/products

export const createProduct = async (req, res, next) => {

    try {

        const {
            name,
            sku,
            description,
            unitPrice,
            quantityInStock,
            category,
            supplier
        } = req.body;


        const product = await Product.create({

            name,
            sku,
            description,
            unitPrice,
            quantityInStock,
            category,
            supplier

        });


        res.status(201).json({

            success:true,
            data:product

        });


    } catch(error) {

        next(error);

    }

};



// Get all products
// GET /api/products

export const getProducts = async (req, res, next) => {

    try {

        const {
            search,
            category,
            supplier,
            status
        } = req.query;


        let {
            page = 1,
            pageSize = 10
        } = req.query;



        // Safe pagination values

        page = Math.max(Number(page),1);

        pageSize = Math.max(Number(pageSize),1);



        const skip = (page - 1) * pageSize;



        let filter = {};



        // Search by product name or SKU

        if(search){

            filter.$or = [

                {
                    name:{
                        $regex:search,
                        $options:"i"
                    }
                },

                {
                    sku:{
                        $regex:search,
                        $options:"i"
                    }
                }

            ];

        }



        // Filter by category

        if(category){

            filter.category = category;

        }



        // Filter by supplier

        if(supplier){

            filter.supplier = supplier;

        }



        // Stock status filter

        if(status){


            if(status === "in-stock"){

                filter.quantityInStock = {
                    $gt:0
                };

            }



            if(status === "low-stock"){

                filter.quantityInStock = {

                    $gte:1,
                    $lt:10

                };

            }



            if(status === "out-of-stock"){

                filter.quantityInStock = 0;

            }

        }



        const total = await Product.countDocuments(filter);



        const products = await Product.find(filter)

            .populate("category","name")

            .populate("supplier","name")

            .sort({
                createdAt:-1
            })

            .skip(skip)

            .limit(pageSize);



        res.status(200).json({

            success:true,


            pagination:{

                page,

                pageSize,

                totalItems:total,

                totalPages:Math.ceil(
                    total / pageSize
                )

            },


            data:products

        });



    } catch(error) {

        next(error);

    }

};




// Get single product
// GET /api/products/:id


export const getProductById = async(req,res,next)=>{


    try{


        const product = await Product.findById(req.params.id)

            .populate("category","name")

            .populate("supplier","name");



        if(!product){

            return res.status(404).json({

                success:false,

                message:"Product not found"

            });

        }



        res.status(200).json({

            success:true,

            data:product

        });



    }catch(error){

        next(error);

    }

};




// Update Product
// PUT /api/products/:id


export const updateProduct = async(req,res,next)=>{


    try{


        const product = await Product.findByIdAndUpdate(

            req.params.id,

            req.body,

            {

                new:true,

                runValidators:true

            }

        )

        .populate("category","name")

        .populate("supplier","name");



        if(!product){


            return res.status(404).json({

                success:false,

                message:"Product not found"

            });

        }



        res.status(200).json({

            success:true,

            data:product

        });



    }catch(error){


        next(error);

    }

};




// Delete Product
// DELETE /api/products/:id


// Delete Product
// DELETE /api/products/:id


export const deleteProduct = async(req,res,next)=>{


    try{


        const product = await Product.findById(
            req.params.id
        );



        if(!product){


            return res.status(404).json({

                success:false,

                message:"Product not found"

            });

        }



        // Delete related stock movements

        await StockMovement.deleteMany({

            product:req.params.id

        });



        // Delete product

        await Product.findByIdAndDelete(

            req.params.id

        );



        res.status(200).json({

            success:true,

            message:"Product and stock movements deleted successfully"

        });



    }catch(error){


        next(error);

    }

};

// Export Products CSV
// GET /api/products/export

export const exportProductsCSV = async (req, res, next) => {

    try {

        const {
            search,
            category,
            supplier,
            status
        } = req.query;


        let filter = {};



        // Search filter

        if(search){

            filter.$or = [

                {
                    name:{
                        $regex:search,
                        $options:"i"
                    }
                },

                {
                    sku:{
                        $regex:search,
                        $options:"i"
                    }
                }

            ];

        }



        // Category filter

        if(category){

            filter.category = category;

        }



        // Supplier filter

        if(supplier){

            filter.supplier = supplier;

        }



        // Stock status filter

        if(status){

            if(status === "in-stock"){

                filter.quantityInStock = {
                    $gt:0
                };

            }


            if(status === "low-stock"){

                filter.quantityInStock = {
                    $gte:1,
                    $lt:10
                };

            }


            if(status === "out-of-stock"){

                filter.quantityInStock = 0;

            }

        }



        const products = await Product.find(filter)

            .populate("category","name")

            .populate("supplier","name");



        const data = products.map(product => ({

            Name: product.name,

            SKU: product.sku,

            Category: product.category?.name || "N/A",

            Supplier: product.supplier?.name || "N/A",

            Price: product.unitPrice,

            Quantity: product.quantityInStock,

            CreatedAt: product.createdAt

        }));



        const parser = new Parser();

        const csv = parser.parse(data);



        res.header(
            "Content-Type",
            "text/csv"
        );


        res.attachment(
            "products.csv"
        );


        res.send(csv);



    } catch(error){

        next(error);

    }

};


// Bulk Import Products CSV
// POST /api/products/import

export const importProductsCSV = async (req,res,next)=>{

    try{


        if(!req.file){

            return res.status(400).json({

                success:false,

                message:"CSV file required"

            });

        }



        const products = [];

        const errors = [];



        let rowNumber = 1;



        await new Promise((resolve,reject)=>{


            Readable
            .from(req.file.buffer)

            .pipe(csv())

            .on("data",(row)=>{


                rowNumber++;


                if(
                    !row.name ||
                    !row.sku ||
                    !row.unitPrice ||
                    !row.quantityInStock
                ){

                    errors.push({

                        row:rowNumber,

                        message:"Missing required fields"

                    });


                    return;

                }



                if(Number(row.quantityInStock)<0){

                    errors.push({

                        row:rowNumber,

                        message:"Quantity cannot be negative"

                    });


                    return;

                }



                products.push({

                    name:row.name,

                    sku:row.sku,

                    description:row.description,

                    unitPrice:Number(row.unitPrice),

                    quantityInStock:Number(row.quantityInStock),

                    category:row.category,

                    supplier:row.supplier

                });


            })


            .on("end",resolve)

            .on("error",reject);


        });



        let imported = 0;



        for(const product of products){


            try{


                const exists = await Product.findOne({

                    sku:product.sku

                });



                if(exists){

                    errors.push({

                        row:"unknown",

                        sku:product.sku,

                        message:"SKU already exists"

                    });


                    continue;

                }



                await Product.create(product);


                imported++;



            }catch(error){


                errors.push({

                    sku:product.sku,

                    message:error.message

                });


            }

        }



        res.status(200).json({

            success:true,

            imported,

            failed:errors.length,

            errors

        });



    }catch(error){

        next(error);

    }

};