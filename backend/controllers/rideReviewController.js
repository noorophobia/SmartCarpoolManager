const {
  getAllReviewsWithCompositeIds,
  updateReviewResolution,
} = require("../services/rideReviewService");

const fetchAllReviews = async (req, res) => {
  try {
    const { updatedCount, reviews } = await getAllReviewsWithCompositeIds();

    res.status(200).json({
      message: `${updatedCount} reviews updated with composite IDs.`,
      reviews,
    });
  } catch (error) {
    console.error("Failed to fetch reviews with composite IDs:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const resolveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolved } = req.body;

    const updatedReview = await updateReviewResolution(id, resolved);

    res.status(200).json({
      message: "Review status updated successfully.",
      updatedReview,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    if (error.message === 'Resolved must be a boolean value.') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'Review not found.') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  fetchAllReviews,
  resolveReview,
};
