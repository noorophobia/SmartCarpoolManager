const express = require("express");
const nodemailer = require("nodemailer");
const Passenger = require("../models/Passenger");
const Driver = require("../models/Driver");

const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "smartcarpool1@gmail.com",  // Replace with your email
    pass: "qtoq hwre buev sncg",     // Replace with your email password or app password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Route to handle sending notifications
router.post("/send-notification", async (req, res) => {
  const { recipientType, email, message } = req.body;

  if (!message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  let recipients = [];

  try {
    if (recipientType === "allPassengers") {
      const passengers = await Passenger.find();
      recipients = passengers.map(passenger => passenger.email);
    } else if (recipientType === "allDrivers") {
      const drivers = await Driver.find();
      recipients = drivers.map(driver => driver.email);
    } else if (recipientType === "specificEmail" && email) {
      recipients = [email];
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: "No recipients found" });
    }

    console.log(recipients);

    // Setup email options with HTML content
    const mailOptions = {
      from: "smartcarpool1@gmail.com",  // Sender's email address
      to: recipients,  // Recipients
      subject: "Important Notification",  // Subject line
      html: message,
      //'<html> <body> <h1>Test Notification</h1> <p>This is a test notification with an image.</p><img src="https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg" alt="Test Image" /></body>  </html>',  // Send the message as HTML
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Notification sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

module.exports = router;
