const express = require('express');
const router = express.Router();

// Controller
const highstakesController = require('../controllers/highstakes');

// Route
router.get('/', highstakesController.get_all);

module.exports = router;
