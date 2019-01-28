const express = require("express");
const router = express.Router();

// Controller
const tempmuteController = require("../controllers/tempmute");

// Routes
router.get("/", tempmuteController.tempmute_get_all);
router.get("/:userId", tempmuteController.tempmute_get_user);

module.exports = router;
