const { searchKB } = require("./kbController");
const { recordWidgetInteraction } = require("./conversationController");

// POST /api/chat/public
function handlePublicChat(req, res) {
  const { message, conversationId, visitorName = "Website Visitor" } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  const convId = conversationId || `conv-widget-${Date.now()}`;

  // Run Knowledge Base semantic retrieval
  const { topMatches, synthesizedAnswer, confidence } = searchKB(message.trim());

  // Record into Live Ticketing Desk
  const updatedConv = recordWidgetInteraction({
    conversationId: convId,
    userMessage: message.trim(),
    aiResponse: synthesizedAnswer,
    citations: topMatches,
    confidence,
    customerName: visitorName,
  });

  res.json({
    conversationId: convId,
    reply: synthesizedAnswer,
    confidence,
    isEscalated: confidence < 80,
    citations: topMatches.map((m) => ({
      title: m.source,
      snippet: m.content,
      score: m.similarityScore,
    })),
    createdAt: new Date().toISOString(),
  });
}

// GET /api/chat/config
function getWidgetConfig(req, res) {
  res.json({
    botName: "SupportAI Assistant",
    greeting: "Hi there! 👋 How can I help you today?",
    brandColor: "#000000",
    suggestions: [
      "What is your refund policy?",
      "How do I authenticate API requests?",
      "Is customer data encrypted?",
    ],
  });
}

module.exports = {
  handlePublicChat,
  getWidgetConfig,
};
