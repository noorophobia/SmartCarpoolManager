const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../index");
const Passenger = require("../models/Passenger");
const Driver = require("../models/Driver");
require("dotenv").config({ path: ".env.test" });

// Mock Nodemailer
jest.mock("nodemailer", () => {
  const sendMailMock = jest.fn().mockResolvedValue("Email Sent Successfully");
  return {
    createTransport: jest.fn().mockReturnValue({
      sendMail: sendMailMock,
    }),
    __mockSendMail: sendMailMock, // Expose the mock for test assertions
  };
});

const nodemailer = require("nodemailer");
const sendMailMock = nodemailer.__mockSendMail; // Access the mock globally

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  testPassenger = new Passenger({
    email: "noorf3531@gmail.com",
    name: "Test Passenger",
    password: "1234",
    phone: "+923155265661",
    gender: "female",
  });
  await testPassenger.save();

  testDriver = new Driver({
    driverFirstName: "John",
    driverLastName: "Doe",
    driverGender: "male",
    driverEmail: "noorf3531@gmail.com",
    driverPhone: "+923144172665",
    driverCnicNumber: "12345-6789012-3",
    driverDOB: "1990-01-01",
    rating: 4.5,
    driverPassword: "password123",
    driverCnicFront: "front-image-url",
    driverCnicBack: "back-image-url",
    driverSelfie: "selfie-url",
    vehicleProductionYear: "2022",
    vehicleType: "Car",
    carType: "Sedan",
    vehicleName: "Toyota Corolla",
    vehicleColor: "Black",
    licenseNumber: "ABC-1234",
    compositeId: "DR-004",
    brand: "Toyota",
    vehicleRegisterationFront: "reg-front-url",
    vehicleRegisterationBack: "reg-back-url",
    vehiclePhotos: ["photo1-url", "photo2-url"],
  });
  await testDriver.save();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Email Notification API Tests", () => {
  it("Should send notification to all passengers", async () => {
    const res = await request(app).post("/send-notification").send({
      recipientType: "allPassengers",
      message: "<p>Important update for passengers</p>",
      subject: "Passenger Alert",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Notification sent successfully!");
    expect(sendMailMock).toHaveBeenCalled();
  });

  it("Should send notification to all drivers", async () => {
    const res = await request(app).post("/send-notification").send({
      recipientType: "allDrivers",
      message: "<p>Important update for drivers</p>",
      subject: "Driver Alert",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Notification sent successfully!");
    expect(sendMailMock).toHaveBeenCalled();
  });

  it("Should send notification to a specific email", async () => {
    const res = await request(app).post("/send-notification").send({
      recipientType: "specificEmail",
      email: "noorf3531@gmail.com",
      message: "<p>Personalized Message</p>",
      subject: "Direct Notification",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Notification sent successfully!");
    expect(sendMailMock).toHaveBeenCalled();
  });

  it("Should return 400 if message is empty", async () => {
    const res = await request(app).post("/send-notification").send({
      recipientType: "allPassengers",
      message: "   ",
      subject: "Missing Message",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Message is required");
  });

  it("Should return 400 if no recipients found", async () => {
    const res = await request(app).post("/send-notification").send({
      recipientType: "specificEmail",
      email: "",
      message: "<p>Invalid request</p>",
      subject: "No Recipients",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "No recipients found");
  });

  it("Should return 500 if email sending fails", async () => {
    sendMailMock.mockRejectedValueOnce(new Error("Email service down"));

    const res = await request(app).post("/send-notification").send({
      recipientType: "specificEmail",
      email: "fail@example.com",
      message: "<p>Failure case</p>",
      subject: "Test Failure",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Failed to send notification");
  });
});

afterAll(async () => {
  await Passenger.deleteMany({});
  await Driver.deleteMany({});
  await mongoose.connection.close();
  if (server) server.close();
});
