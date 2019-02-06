const express = require('express');
const router = express.Router();

// Controller
const livescoresController = require('../controllers/livescores');

// Route
router.get('/', livescoresController.get_all);

module.exports = router;
