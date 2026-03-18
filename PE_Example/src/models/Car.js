const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    licensePlate: {
      type: String,
      required: true,
      unique: true
    },
    pricePerDay: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['AVAILABLE', 'RENTED', 'MAINTENANCE'],
      default: 'AVAILABLE'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Car', carSchema);
