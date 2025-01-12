const paymentSchema = new mongoose.Schema({
    paymentID: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    paymentType: {
      type: String,
      enum: ['Jazz Cash', 'Cash'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed'],
      required: true,
    },
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }, // Relationship to Ride
  });
  
  const Payment = mongoose.model('Payment', paymentSchema);
  module.exports = Payment;
  