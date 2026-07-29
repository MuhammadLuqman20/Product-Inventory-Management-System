import request from "supertest";
import { jest } from "@jest/globals";
import app from "../src/app.js";

jest.setTimeout(30000);
let token;


describe("Product API",()=>{


    test("Login user", async()=>{


        const response = await request(app)

            .post("/api/auth/login")

            .send({

                email:"testadmin@gmail.com",

                password:"123456"

            });



        token = response.body.token;


        expect(token)
            .toBeDefined();


    });




    test("Should block products without token", async()=>{


        const response = await request(app)

            .get("/api/products");



        expect(response.statusCode)
            .toBe(401);


    });





    test("Should get products with token", async()=>{


        const response = await request(app)

            .get("/api/products")

            .set(
                "Authorization",
                `Bearer ${token}`
            );



        expect(response.statusCode)
            .toBe(200);


    });


});