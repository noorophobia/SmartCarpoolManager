const express = require("express");
const router = express.Router();
const {
  fetchAllReviews,
  resolveReview,
} = require("../controllers/rideReviewController");

router.get("/passenger-ride-reviews", fetchAllReviews);
router.put("/passenger-ride-reviews/resolve/:id", resolveReview);

module.exports = router;
