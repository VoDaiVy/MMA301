var express = require('express');
var router = express.Router();

const Contract = require('../models/Contract');

/* GET all contracts */
router.get('/', async function (req, res) {
  const contracts = await Contract.find();
  res.json(contracts);
});

/* POST create contract */
router.post('/', async function (req, res) {
  const contract = new Contract(req.body);
  await contract.save();
  res.json(contract);
});

module.exports = router;

// Em có test postman và em có chụp lại hình để ở folde images nha cô. Cô có thể xem giúp em ạ.
// Em cảm ơn cô nhiều.