const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index");
require('dotenv').config({ path: '.env.test' }); // Load test env variables

let token;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Login to get a token
    const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "smartcarpool1@gmail.com", password: "1234" });

    token = res.body.token;
});

// ✅ Test: Admin login (valid)
it("Admin login - should return a token", async () => {
    expect(token).toBeDefined();
});

// ❌ Test: Admin login (invalid email)
it("Admin login - invalid email", async () => {
    const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "invalid@gmail.com", password: "1234" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid email or password");
});

// ❌ Test: Admin login (invalid password)
it("Admin login - invalid password", async () => {
    const res = await request(app)
        .post("/api/admin/login")
        .send({ email: "smartcarpool1@gmail.com", password: "wrongpassword" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid email or password");
});

// ❌ Test: Admin login (missing fields)
it("Admin login - missing email", async () => {
    const res = await request(app)
        .post("/api/admin/login")
        .send({ password: "1234" });

    expect(res.statusCode).toBe(400);
});

// ✅ Test: Admin password update (valid)
it("Admin password update - valid", async () => {
    const res = await request(app)
        .put("/api/admin/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "smartcarpool1@gmail.com", newPassword: "newPass123" });

    expect(res.statusCode).toBe(200);
});

// ❌ Test: Admin password update (missing fields)
it("Admin password update - missing fields", async () => {
    const res = await request(app)
        .put("/api/admin/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({ newPassword: "newPass123" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Email and new password are required");
});

// ❌ Test: Admin password update (non-existent admin)
it("Admin password update - admin not found", async () => {
    const res = await request(app)
        .put("/api/admin/update-password")
        .set("Authorization", `Bearer ${token}`)
        .send({ email: "nonexistent@gmail.com", newPassword: "newPass123" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Admin not found");
});

// ✅ Test: Admin password reset (valid)
it("Admin password reset - valid", async () => {
    const res = await request(app)
        .post("/api/admin/reset-password")
        .send({ email: "smartcarpool1@gmail.com" });

    expect(res.statusCode).toBe(200);
});

// ❌ Test: Admin password reset (non-existent admin)
it("Admin password reset - admin not found", async () => {
    const res = await request(app)
        .post("/api/admin/reset-password")
        .send({ email: "nonexistent@gmail.com" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Admin not found.");
});

// ❌ Test: Accessing protected route without auth token
it("Admin update password - Unauthorized", async () => {
    const res = await request(app)
        .put("/api/admin/update-password")
        .send({ email: "smartcarpool1@gmail.com", newPassword: "newPass123" });

    expect(res.statusCode).toBe(401);
});

// Cleanup
afterAll(async () => {
    await mongoose.connection.close();
    if (server) server.close();
});
