const Booking = require('../models/Booking');
const Car = require('../models/Car');

const getBookingDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('userId')
      .populate('carId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookingsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await Booking.find({ userId: id }).populate('carId');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const { id } = req.params;
    const cars = await Car.find({ ownerId: id });
    const carIds = cars.map(car => car._id);
    const bookings = await Booking.find({ carId: { $in: carIds } })
      .populate('userId')
      .populate('carId');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'PENDING' });
    const confirmed = await Booking.countDocuments({ status: 'CONFIRMED' });
    const cancelled = await Booking.countDocuments({ status: 'CANCELLED' });

    res.status(200).json({
      total,
      pending,
      confirmed,
      cancelled
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBookingDetail,
  getBookingsByUser,
  getOwnerBookings,
  getAdminStats
};