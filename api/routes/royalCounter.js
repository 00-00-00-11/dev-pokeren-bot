const express = require("express");
const router = express.Router();

// Controller
const royalCountController = require("../controllers/royalCounter");

// Route
router.get("/", royalCountController.counters);
router.get("/:serverId", royalCountController.counters_get_server);

module.exports = router;
