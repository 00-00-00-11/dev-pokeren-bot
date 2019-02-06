const express = require('express');
const router = express.Router();

// Controller
const microstakesController = require('../controllers/microstakes');

// Route
router.get('/', microstakesController.get_all);

module.exports = router;
