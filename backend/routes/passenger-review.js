// routes/rideReviewRoute.js
const express = require("express");
const router = express.Router();
const RideReview = require("../models/PassengerReview");
 
 const CompositeId = require("../models/CompositeIds");
const Driver = require("../models/Driver");
const Passenger = require("../models/Passenger");

// GET all reviews with composite ID enrichment if missing
router.get("/passenger-ride-reviews", async (req, res) => {
  try {
    const reviews = await RideReview.find().sort({ createdAt: -1 });

    // Track updates
    let updatedReviews = [];

    for (const review of reviews) {
      let updated = false;

      // Fetch ride compositeId if missing
      const rideComposite = await CompositeId.findOne({ rideID: review.rideId });
      if (rideComposite && !review.rideCompositeId) {
        review.rideCompositeId = rideComposite.compositeId;
        updated = true;
      }

      // Fetch driver compositeId if missing
      const driver = await Driver.findById(review.driverId);
      if (driver && driver.compositeId && !review.driverCompositeId) {
        review.driverCompositeId = driver.compositeId;
        updated = true;
      }

      // Fetch passenger compositeId if missing
      const passenger = await Passenger.findById(review.passengerId);
      if (passenger && passenger.compositeId && !review.passengerCompositeId) {
        review.passengerCompositeId = passenger.compositeId;
        updated = true;
      }

      // Save if any updates made
      if (updated) {
        await review.save();
        updatedReviews.push(review._id);
      }
    }

    const allReviews = await RideReview.find().sort({ createdAt: -1 });

    res.status(200).json({
      message: `${updatedReviews.length} reviews updated with composite IDs.`,
      reviews: allReviews,
    });
  } catch (error) {
    console.error("Failed to fetch reviews with composite IDs:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

 
router.put("/passenger-ride-reviews/resolve/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved } = req.body;
    console.log("inside")

    if (typeof resolved !== "boolean") {
      return res.status(400).json({ message: "Resolved must be a boolean value." });
    }

    const updatedReview = await RideReview.findByIdAndUpdate(
      id,
      { resolved },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found." });
    }

    res.status(200).json({
      message: "Review status updated successfully.",
      updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

 

module.exports = router;
