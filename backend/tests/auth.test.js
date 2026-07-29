import request from "supertest";
import { jest } from "@jest/globals";
import app from "../src/app.js";

jest.setTimeout(30000);


describe("Authentication API",()=>{

    test("Register user", async()=>{

        const response = await request(app)
            .post("/api/auth/register")
            .send({

                name:"New User",
                email:"newuser_register@gmail.com",
                password:"123456",
                role:"Staff"

            });


        expect(response.statusCode)
            .toBe(201);

    });

});