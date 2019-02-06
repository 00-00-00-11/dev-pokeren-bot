const express = require('express');
const router = express.Router();

// Controller
const lowstakesController = require('../controllers/lowstakes');

// Route
router.get('/', lowstakesController.get_all);

module.exports = router;
