var express = require('express');
var router = express.Router();

const User = require('../models/User');

//GET /api/v1/users
router.get('/', async function (req, res) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/v1/users 
router.post('/', async function (req, res) {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

// Em có test postman và em có chụp lại hình để ở folde images nha cô. Cô có thể xem giúp em ạ.
// Em cảm ơn cô nhiều.