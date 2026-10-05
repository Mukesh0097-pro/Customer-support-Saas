const express = require("express");
const {
  getSettings,
  updateWorkspace,
  updateAgent,
  updateNotifications,
  createApiKey,
  revokeApiKey,
  addWebhook,
  deleteWebhook,
  testWebhookPing,
  inviteTeamMember,
  updateTeamMember,
  removeTeamMember,
  toggleIntegration,
  updateIntegration,
  updatePlan,
} = require("../controllers/settingsController");

const router = express.Router();

router.get("/", getSettings);
router.patch("/workspace", updateWorkspace);
router.patch("/agent", updateAgent);
router.patch("/notifications", updateNotifications);
router.patch("/billing/plan", updatePlan);

// API Keys
router.post("/api-keys", createApiKey);
router.delete("/api-keys/:id", revokeApiKey);

// Webhooks
router.post("/webhooks", addWebhook);
router.delete("/webhooks/:id", deleteWebhook);
router.post("/webhooks/:id/ping", testWebhookPing);

// Team
router.post("/team", inviteTeamMember);
router.patch("/team/:id", updateTeamMember);
router.delete("/team/:id", removeTeamMember);

// Integrations
router.post("/integrations/:id/toggle", toggleIntegration);
router.patch("/integrations/:id", updateIntegration);

module.exports = router;
