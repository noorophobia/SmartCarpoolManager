const express = require("express");
const Package = require("../models/Package");
const router = express.Router();

// Create a new package
router.post("/packages", async (req, res) => {
  const { name, duration, discount, fee } = req.body;

  if (!name || !duration || !discount || !fee) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newPackage = new Package({
      name,
      duration,
      discount,
      fee,
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    console.error("Error creating package:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all packages
router.get("/packages", async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    console.error("Error fetching packages:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get package by ID
router.get("/packages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }
    res.status(200).json(package);
  } catch (error) {
    console.error("Error fetching package:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update package
router.put("/packages/:id", async (req, res) => {
  const { id } = req.params;
  const { name, duration, discount, fee } = req.body;

  if (!name || !duration || !discount || !fee) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }

    package.name = name;
    package.duration = duration;
    package.discount = discount;
    package.fee = fee;
    package.updatedAt = Date.now();

    const updatedPackage = await package.save();
    res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error updating package:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete package
router.delete("/packages/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const package = await Package.findById(id);
    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }

    await package.remove();
    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Error deleting package:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
