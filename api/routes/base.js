const express = require("express");
const router = express.Router();

// Controller
const baseController = require("../controllers/base");

// Route
router.get("/", baseController.get_all);

module.exports = router;
