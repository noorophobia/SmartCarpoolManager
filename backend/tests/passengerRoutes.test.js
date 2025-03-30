const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index");
const Passenger = require("../models/Passenger");
require("dotenv").config({ path: ".env.test" });

let token;
let passengerId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "smartcarpool1@gmail.com", password: "1234" });

    if (res.statusCode === 200) {
        token = res.body.token;
    } else {
        console.error("Failed to log in, status code:", res.statusCode, res.body);
    }
});

// Test: Admin Login
it("Admin login - should return a token", async () => {
    expect(token).toBeDefined();
});

// Test: Add a new passenger
it("Should create a new passenger", async () => {
    const res = await request(app)
        .post("/passengers")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            phone: "1234567890",
            gender: "female",
            password: "password123"
        });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    passengerId = res.body._id;
});

// Test: Fetch all passengers
it("Should fetch all passengers", async () => {
    const res = await request(app)
        .get("/passengers")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

// Test: Fetch single passenger by ID
it("Should fetch a single passenger by ID", async () => {
    const res = await request(app)
        .get(`/passengers/${passengerId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", passengerId);
});

// Test: Update a passenger
it("Should update the passenger details", async () => {
    const updateRes = await request(app)
        .put(`/passengers/${passengerId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "Alice Smith",
            phone: "0987654321",
            gender: "female"
        });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty("_id", passengerId);
    expect(updateRes.body.name).toBe("Alice Smith");
    expect(updateRes.body.phone).toBe("0987654321");
});


// Test: Delete a passenger
it("Should delete a passenger", async () => {
    const res = await request(app)
        .delete(`/passengers/${passengerId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Passenger deleted");
});

// Cleanup after tests
afterAll(async () => {
        await mongoose.connection.db.collection("passengers").deleteMany({});
    
    await mongoose.connection.close();
    if (server) {
        server.close();
    }
});