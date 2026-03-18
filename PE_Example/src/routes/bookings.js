const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const bookingController = require('../controllers/bookingController');

/* GET all bookings */
router.get('/', async function (req, res) {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* POST create booking */
router.post('/', async function (req, res) {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// router bai 4
router.get('/admin/summary', bookingController.getAdminStats);
// router bai 2
router.get('/user/:id', bookingController.getBookingsByUser);
// router bai 3
router.get('/owner/:id', bookingController.getOwnerBookings);
// router bai 1
router.get('/:id', bookingController.getBookingDetail);

module.exports = router;