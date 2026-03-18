var express = require('express');
var router = express.Router();

const Car = require('../models/Car');

/* GET all cars */
router.get('/', async function (req, res) {
  const cars = await Car.find();
  res.json(cars);
});

/* POST create car */
router.post('/', async function (req, res) {
  const car = new Car(req.body);
  await car.save();
  res.json(car);
});

module.exports = router;

// Em có test postman và em có chụp lại hình để ở folde images nha cô. Cô có thể xem giúp em ạ.
// Em cảm ơn cô nhiều.