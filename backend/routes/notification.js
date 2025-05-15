const express = require("express");
const Passenger = require("../models/Passenger");
const Driver = require("../models/Driver");
const { sendNotificationEmail } = require("../services/emailService");

const router = express.Router();

router.post("/send-notification", async (req, res) => {
  const { recipientType, email, message, subject } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    let recipients = [];

    if (recipientType === "allPassengers") {
      const passengers = await Passenger.find();
      recipients = passengers.map((p) => p.email);
    } else if (recipientType === "allDrivers") {
      const drivers = await Driver.find();
      recipients = drivers.map((d) => d.email);
    } else if (recipientType === "specificEmail" && email) {
      recipients = [email];
    }

    if (recipients.length === 0) {
      return res.status(400).json({ error: "No recipients found" });
    }

    await sendNotificationEmail(recipients, subject, message);

    res.status(200).json({ message: "Notification sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send notification" });
  }
});

module.exports = router;
