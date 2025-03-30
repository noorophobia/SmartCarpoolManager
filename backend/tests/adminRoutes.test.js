const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { app, server } = require("../index");
require('dotenv').config({ path: '.env.test' }); // Load test env variables

let token;

beforeAll(async () => {
    console.log("MongoDB URI:", process.env.MONGO_URI);

    // Connect to the test database
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Perform login to fetch a valid token
    const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "smartcarpool1@gmail.com", password: "1234" });

    if (res.statusCode === 200) {
        token = res.body.token;
    } else {
        console.error("Failed to log in, status code:", res.statusCode, res.body);
    }
});

// Test for Admin Login
it("Admin login - should return a token", async () => {
    expect(token).toBeDefined();
});

// Test for Admin Password Update
it("Admin password update", async () => {
    const res = await request(app)
        .put("/api/admin/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "smartcarpool1@gmail.com", newPassword: "1234" });

    expect(res.statusCode).toBe(200);
});

 

// Clean up test database
afterAll(async () => {
    await mongoose.connection.close();
    if (server) {
        server.close();
    }
});
