const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Contract', contractSchema);
