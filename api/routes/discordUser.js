const express = require("express");
const router = express.Router();

// Controller
const discordUserController = require("../controllers/discordUser");

// Routes
router.get("/", discordUserController.discordUser_get_all);
router.get("/:userId", discordUserController.discordUser_get_user);

module.exports = router;
