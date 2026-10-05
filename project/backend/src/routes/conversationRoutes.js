const express = require("express");
const {
  getConversations,
  getConversationById,
  sendMessage,
  generateCopilotDraft,
  toggleHandover,
  updateTicket,
  addNote,
} = require("../controllers/conversationController");

const router = express.Router();

router.get("/", getConversations);
router.get("/:id", getConversationById);
router.post("/:id/messages", sendMessage);
router.get("/:id/copilot-draft", generateCopilotDraft);
router.post("/:id/handover", toggleHandover);
router.patch("/:id/ticket", updateTicket);
router.post("/:id/notes", addNote);

module.exports = router;
