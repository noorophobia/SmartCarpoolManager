const RideReview = require('../models/PassengerReview');
const CompositeId = require('../models/CompositeIds');
const Driver = require('../models/Driver');
const Passenger = require('../models/Passenger');
 
async function getAllReviewsWithCompositeIds() {
  const reviews = await RideReview.find().sort({ createdAt: -1 });
  const updatedReviews = [];

  for (const review of reviews) {
    let updated = false;
     // Update rideCompositeId if missing
     
const rideComposite = await CompositeId.findOne({ rideID: review.rideId });
 
     
     if (rideComposite) {
      review.rideCompositeId = rideComposite.compositeId;
      updated = true;
      
    }

    // Update driverCompositeId if missing
    const driver = await Driver.findById(review.driverId);
    if (driver && driver.compositeId && !review.driverCompositeId) {
      review.driverCompositeId = driver.compositeId;
      updated = true;
    }

    // Update passengerCompositeId if missing
    const passenger = await Passenger.findById(review.passengerId);
    if (passenger && passenger.compositeId && !review.passengerCompositeId) {
      review.passengerCompositeId = passenger.compositeId;
      updated = true;
    }

    if (updated) {
      await review.save();
      updatedReviews.push(review._id);
    }
  }

  const allReviews = await RideReview.find().sort({ createdAt: -1 });

  return {
    updatedCount: updatedReviews.length,
    reviews: allReviews,
  };
}

async function updateReviewResolution(id, resolved) {
  if (typeof resolved !== 'boolean') {
    throw new Error('Resolved must be a boolean value.');
  }

  const updatedReview = await RideReview.findByIdAndUpdate(
    id,
    { resolved },
    { new: true }
  );

  if (!updatedReview) {
    throw new Error('Review not found.');
  }

  return updatedReview;
}

module.exports = {
  getAllReviewsWithCompositeIds,
  updateReviewResolution,
};
