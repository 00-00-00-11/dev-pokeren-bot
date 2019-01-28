const express = require("express");
const router = express.Router();

// Controller
const countController = require("../controllers/ftCounter");

// Route
router.get("/", countController.counters);
router.get("/:serverId", countController.counters_get_server);

module.exports = router;
