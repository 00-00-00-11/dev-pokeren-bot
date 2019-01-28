const express = require("express");
const router = express.Router();

// Controller
const banController = require("../controllers/ban");

// Routes
router.get("/", banController.bans_get_all);
router.get("/:userId", banController.bans_get_user);

module.exports = router;
