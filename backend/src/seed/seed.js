import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";
import Product from "../models/Product.js";
import User from "../models/User.js";


dotenv.config();



const connectDB = async()=>{

    try{

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

    }catch(error){

        console.log(error.message);
        process.exit(1);

    }

};



const seedData = async()=>{


    try{


        // Clear existing data

        await Category.deleteMany();
        await Supplier.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Seed users
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("123456", salt);

        await User.insertMany([
            {
                name: "Demo Admin",
                email: "testadmin@gmail.com",
                password: hashedPassword,
                role: "Admin"
            },
            {
                name: "Demo Staff",
                email: "teststaff@gmail.com",
                password: hashedPassword,
                role: "Staff"
            }
        ]);



        // Create Categories

        const categories = await Category.insertMany([

            {
                name:"Electronics",
                description:"Electronic devices and accessories"
            },

            {
                name:"Furniture",
                description:"Office and home furniture"
            },

            {
                name:"Stationery",
                description:"Office stationery items"
            }

        ]);



        // Create Suppliers

        const suppliers = await Supplier.insertMany([

            {
                name:"Tech World",
                contactEmail:"techworld@gmail.com",
                phone:"03001234567",
                address:"Lahore"
            },

            {
                name:"Office Solutions",
                contactEmail:"office@gmail.com",
                phone:"03009876543",
                address:"Islamabad"
            },

            {
                name:"Smart Supplies",
                contactEmail:"smart@gmail.com",
                phone:"03111234567",
                address:"Karachi"
            }

        ]);



        // Create Products

       const products = [

    {
        name:"Laptop",
        sku:"LAP001",
        description:"Core i7 Business Laptop",
        unitPrice:1200,
        quantityInStock:25,
        category:categories[0]._id,
        supplier:suppliers[0]._id
    },

    {
        name:"Keyboard",
        sku:"KEY001",
        description:"Mechanical Keyboard",
        unitPrice:80,
        quantityInStock:50,
        category:categories[0]._id,
        supplier:suppliers[0]._id
    },

    {
        name:"Mouse",
        sku:"MOU001",
        description:"Wireless Mouse",
        unitPrice:40,
        quantityInStock:100,
        category:categories[0]._id,
        supplier:suppliers[0]._id
    },

    {
        name:"Monitor",
        sku:"MON001",
        description:"24 inch LED Monitor",
        unitPrice:250,
        quantityInStock:30,
        category:categories[0]._id,
        supplier:suppliers[0]._id
    },

    {
        name:"Printer",
        sku:"PRI001",
        description:"Laser Printer",
        unitPrice:300,
        quantityInStock:10,
        category:categories[0]._id,
        supplier:suppliers[2]._id
    },

    {
        name:"Office Chair",
        sku:"CHR001",
        description:"Ergonomic Office Chair",
        unitPrice:200,
        quantityInStock:15,
        category:categories[1]._id,
        supplier:suppliers[1]._id
    },

    {
        name:"Office Table",
        sku:"TAB001",
        description:"Wooden Office Table",
        unitPrice:350,
        quantityInStock:20,
        category:categories[1]._id,
        supplier:suppliers[1]._id
    },

    {
        name:"Bookshelf",
        sku:"BOK001",
        description:"Office Bookshelf",
        unitPrice:150,
        quantityInStock:12,
        category:categories[1]._id,
        supplier:suppliers[1]._id
    },

    {
        name:"Drawer Cabinet",
        sku:"DRW001",
        description:"Storage Drawer Cabinet",
        unitPrice:180,
        quantityInStock:8,
        category:categories[1]._id,
        supplier:suppliers[1]._id
    },

    {
        name:"Notebook",
        sku:"NOT001",
        description:"A4 Notebook",
        unitPrice:5,
        quantityInStock:200,
        category:categories[2]._id,
        supplier:suppliers[2]._id
    },

    {
        name:"Pen",
        sku:"PEN001",
        description:"Ball Pen",
        unitPrice:1,
        quantityInStock:500,
        category:categories[2]._id,
        supplier:suppliers[2]._id
    },

    {
        name:"Marker",
        sku:"MAR001",
        description:"Whiteboard Marker",
        unitPrice:3,
        quantityInStock:150,
        category:categories[2]._id,
        supplier:suppliers[2]._id
    },

    {
        name:"Stapler",
        sku:"STA001",
        description:"Office Stapler",
        unitPrice:10,
        quantityInStock:60,
        category:categories[2]._id,
        supplier:suppliers[2]._id
    },

    {
        name:"Paper Pack",
        sku:"PAP001",
        description:"500 sheets paper pack",
        unitPrice:8,
        quantityInStock:100,
        category:categories[2]._id,
        supplier:suppliers[2]._id
    },

    {
        name:"Tablet",
        sku:"TAB002",
        description:"Android Tablet",
        unitPrice:400,
        quantityInStock:18,
        category:categories[0]._id,
        supplier:suppliers[0]._id
    },

    {
        name:"Smartphone",
        sku:"PHN001",
        description:"Android Smartphone",
        unitPrice:500,
        quantityInStock:35,
        category:categories[0]._id,
        supplier:suppliers[0]._id
    },

    {
        name:"Webcam",
        sku:"WEB001",
        description:"HD Webcam",
        unitPrice:70,
        quantityInStock:40,
        category:categories[0]._id,
        supplier:suppliers[0]._id
    },

    {
        name:"Headphones",
        sku:"HDP001",
        description:"Noise Cancelling Headphones",
        unitPrice:120,
        quantityInStock:45,
        category:categories[0]._id,
        supplier:suppliers[0]._id
    },

    {
        name:"Whiteboard",
        sku:"WHI001",
        description:"Office Whiteboard",
        unitPrice:90,
        quantityInStock:7,
        category:categories[1]._id,
        supplier:suppliers[1]._id
    },

    {
        name:"File Folder",
        sku:"FIL001",
        description:"Document File Folder",
        unitPrice:2,
        quantityInStock:300,
        category:categories[2]._id,
        supplier:suppliers[2]._id
    }

];


        await Product.insertMany(products);



        console.log("Seed completed successfully");


        process.exit();


    }catch(error){

        console.log(error.message);

        process.exit(1);

    }

};



connectDB()
.then(()=>seedData());