const express = require("express");
const { handlePublicChat, getWidgetConfig } = require("../controllers/chatController");

const router = express.Router();

// Public widget routes (No auth token required)
router.post("/public", handlePublicChat);
router.get("/config", getWidgetConfig);

module.exports = router;
