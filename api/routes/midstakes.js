const express = require('express');
const router = express.Router();

// Controller
const midstakesController = require('../controllers/midstakes');

// Route
router.get('/', midstakesController.get_all);

module.exports = router;
