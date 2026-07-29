import Category from "../models/Category.js";
import Product from "../models/Product.js";

// @desc    Create category
// @route   POST /api/categories
export const createCategory = async (req, res, next) => {

    try {

        const { name, description } = req.body;


        const category = await Category.create({
            name,
            description
        });


        res.status(201).json({
            success: true,
            data: category
        });


    } catch (error) {

        next(error);

    }

};

// @desc    Get all categories
// @route   GET /api/categories
export const getCategories = async (req, res, next) => {

    try {

        const categories = await Category.find();


        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });


    } catch (error) {

        next(error);

    }

};

// @desc    Get single category
// @route   GET /api/categories/:id
export const getCategoryById = async (req, res, next) => {

    try {

        const category = await Category.findById(req.params.id);


        if (!category) {
            return res.status(404).json({
                success:false,
                message:"Category not found"
            });
        }


        res.status(200).json({
            success:true,
            data:category
        });


    } catch (error) {

        next(error);

    }

};

// @desc    Update category
// @route   PUT /api/categories/:id
export const updateCategory = async (req, res, next) => {

    try {

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
                runValidators:true
            }
        );


        if(!category){
            return res.status(404).json({
                success:false,
                message:"Category not found"
            });
        }


        res.status(200).json({
            success:true,
            data:category
        });


    } catch (error) {

        next(error);

    }

};

// @desc    Delete category
// @route   DELETE /api/categories/:id

// @desc    Delete category
// @route   DELETE /api/categories/:id

export const deleteCategory = async (req, res, next) => {

    try {

        const products = await Product.findOne({
            category: req.params.id
        });


        if(products){

            return res.status(409).json({

                error:{
                    code:"CATEGORY_IN_USE",
                    message:"Cannot delete category because products are assigned to it"
                }

            });

        }



        const category = await Category.findByIdAndDelete(
            req.params.id
        );


        if(!category){

            return res.status(404).json({

                success:false,
                message:"Category not found"

            });

        }



        res.status(200).json({

            success:true,
            message:"Category deleted successfully"

        });



    } catch(error){

        next(error);

    }

};