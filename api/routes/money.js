const express = require('express');
const router = express.Router();

// Controller
const moneyController = require('../controllers/money');

// Routes
router.get('/', moneyController.money_get_all);
router.get('/:userId', moneyController.money_get_user);

module.exports = router;
