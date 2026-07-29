import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";
import bcrypt from "bcrypt";


dotenv.config({
    path: ".env.test"
});


beforeAll(async()=>{

    // Only connect if not already connected (avoids duplicate connections across suites)
    if (mongoose.connection.readyState === 0) {
        await connectDB();
    }

    // Clear users collection before seeding
    await User.deleteMany({});

    // Hash password so login works correctly in product tests
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({

        name:"Test Admin",

        email:"testadmin@gmail.com",

        password: hashedPassword,

        role:"Admin"

    });


});


afterAll(async()=>{

    await mongoose.connection.close();

});