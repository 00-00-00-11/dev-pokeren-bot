const express = require("express");
const router = express.Router();

// Controller
const chipcountController = require("../controllers/chipcount");

// Route
router.get("/", chipcountController.chipcount_get_all);
router.get("/:userId", chipcountController.chipcount_get_one);

module.exports = router;
