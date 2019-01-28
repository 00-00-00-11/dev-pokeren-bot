const express = require("express");
const router = express.Router();

// Controller
const kickController = require("../controllers/kick");

// Routes
router.get("/", kickController.kicks_get_all);
router.get("/:userId", kickController.kicks_get_user);

module.exports = router;
