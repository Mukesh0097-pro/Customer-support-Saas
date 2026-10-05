// In-memory mock store for Settings data
let workspaceSettings = {
  name: "Acme Support Core",
  subdomain: "acme.supportai.com",
  supportEmail: "support@acme.inc",
  timezone: "UTC-05:00 (Eastern Time)",
  operatingHours: "24/7 (Continuous AI Coverage)",
  language: "English (US)",
};

let agentConfig = {
  model: "GPT-4o Resolution Engine",
  temperature: 0.3,
  tone: "Empathetic & Professional",
  confidenceThreshold: 82, // Percent threshold before auto-escalating to human
  hallucinationGuard: true,
  systemPrompt:
    "You are the SupportAI automated customer support assistant for Acme Inc. Be polite, precise, and concise. Always ground answers strictly in the indexed knowledge base citations. If the confidence score is below 80% or the customer expresses extreme frustration, gracefully escalate to a human agent.",
  bannedTopics: ["Political debates", "Internal salary details", "Competitor disparagement"],
};

let apiKeys = [
  {
    id: "key-1",
    name: "Production Backend Ingestion",
    keyPrefix: "sk_live_94f8a...3e19",
    createdAt: "Aug 1, 2026",
    lastUsed: "2 mins ago",
  },
  {
    id: "key-2",
    name: "Staging Testing Key",
    keyPrefix: "sk_test_71b0c...8a42",
    createdAt: "Aug 8, 2026",
    lastUsed: "Yesterday",
  },
];

let webhooks = [
  {
    id: "wh-1",
    url: "https://api.acme.inc/webhooks/supportai",
    events: ["ticket.escalated", "ticket.resolved"],
    secret: "whsec_984f1a2384918e7c10b42",
    status: "Active",
  },
  {
    id: "wh-2",
    url: "https://ops.acme.inc/alerts/rag-sync",
    events: ["rag.reindexed"],
    secret: "whsec_3391ba90e84411df83c99",
    status: "Active",
  },
];

let teamMembers = [
  {
    id: "tm-1",
    name: "Mukesh Kumar",
    email: "mukesh@acme.inc",
    role: "Admin",
    status: "Active",
    avatar: "MK",
  },
  {
    id: "tm-2",
    name: "Sarah Jenkins",
    email: "sarah.j@acme.inc",
    role: "Support Lead",
    status: "Active",
    avatar: "SJ",
  },
  {
    id: "tm-3",
    name: "David Chen",
    email: "david.c@acme.inc",
    role: "Support Agent",
    status: "Active",
    avatar: "DC",
  },
  {
    id: "tm-4",
    name: "Elena Rostova",
    email: "elena.r@acme.inc",
    role: "Support Agent",
    status: "Invited",
    avatar: "ER",
  },
];

let integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Route ticket escalations & urgent alerts directly to a designated Slack channel.",
    category: "Communication",
    connected: true,
    channel: "#support-escalations",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Stream community support queries and ticket updates to Discord servers.",
    category: "Communication",
    connected: false,
    channel: null,
  },
  {
    id: "zendesk",
    name: "Zendesk",
    description: "Bi-directional ticket sync with existing Zendesk Support instances.",
    category: "Ticketing",
    connected: true,
    channel: "Sync Active",
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Empower AI agent to look up customer orders, refunds, and tracking statuses.",
    category: "E-Commerce",
    connected: true,
    channel: "acme-store.myshopify.com",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Business",
    description: "Connect WhatsApp Business API for instant multi-channel AI customer support.",
    category: "Messaging",
    connected: false,
    channel: null,
  },
  {
    id: "stripe",
    name: "Stripe Billing",
    description: "Lookup subscription tiers, invoice receipts, and trigger refund authorisations.",
    category: "Payments",
    connected: true,
    channel: "Live Invoicing Active",
  },
  {
    id: "jira",
    name: "Jira Service Management",
    description: "File engineering bug tickets directly from escalated customer issues.",
    category: "Engineering",
    connected: false,
    channel: null,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Stream high-priority escalations and bot triage straight to MS Teams channels.",
    category: "Communication",
    connected: false,
    channel: null,
  },
  {
    id: "intercom",
    name: "Intercom Messenger",
    description: "Embed SupportAI resolution bot inside your Intercom live chat messenger.",
    category: "Ticketing",
    connected: true,
    channel: "Messenger App Active",
  },
  {
    id: "salesforce",
    name: "Salesforce CRM",
    description: "Sync lead profiles, customer lifetime value, and support cases with Salesforce.",
    category: "CRM",
    connected: false,
    channel: null,
  },
  {
    id: "hubspot",
    name: "HubSpot Service Hub",
    description: "Bi-directional contact syncing and automated ticket resolution pipeline logging.",
    category: "CRM",
    connected: false,
    channel: null,
  },
];

let billing = {
  currentPlan: "Enterprise Scale",
  price: "$499 / month",
  renewalDate: "Sept 1, 2026",
  conversationsUsed: 4218,
  conversationsLimit: 10000,
  tokensUsed: 1420000,
  tokensLimit: 5000000,
  storageUsedMB: 64.2,
  storageLimitMB: 500,
  seatsUsed: 4,
  seatsLimit: 15,
};

let notificationSettings = {
  slaBreachAlerts: true,
  urgentEscalations: true,
  dailyDigest: true,
  weeklyReport: false,
  soundAlerts: true,
  slackWebhookAlerts: true,
  escalationEmail: "ops-lead@acme.inc",
  notifyOnConfidenceBelow: 75,
};

// Handlers
function getSettings(req, res) {
  res.json({
    workspace: workspaceSettings,
    agent: agentConfig,
    apiKeys,
    webhooks,
    teamMembers,
    integrations,
    billing,
    notifications: notificationSettings,
  });
}

function updateWorkspace(req, res) {
  workspaceSettings = { ...workspaceSettings, ...req.body };
  res.json({ message: "Workspace settings updated", workspace: workspaceSettings });
}

function updateAgent(req, res) {
  agentConfig = { ...agentConfig, ...req.body };
  res.json({ message: "AI Agent settings updated", agent: agentConfig });
}

function updateNotifications(req, res) {
  notificationSettings = { ...notificationSettings, ...req.body };
  res.json({ message: "Notification preferences updated", notifications: notificationSettings });
}

function createApiKey(req, res) {
  const { name = "New API Key", scope = "Full Admin" } = req.body;
  const rawKey = `sk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
  const newKey = {
    id: `key-${Date.now()}`,
    name,
    scope,
    keyPrefix: `${rawKey.slice(0, 10)}...${rawKey.slice(-4)}`,
    rawKey,
    createdAt: "Today",
    lastUsed: "Never",
  };
  apiKeys.unshift(newKey);
  res.status(201).json({ apiKey: newKey });
}

function revokeApiKey(req, res) {
  const { id } = req.params;
  apiKeys = apiKeys.filter((k) => k.id !== id);
  res.json({ message: "API Key revoked" });
}

function addWebhook(req, res) {
  const { url, events = ["ticket.escalated"] } = req.body;
  if (!url) return res.status(400).json({ message: "URL is required" });

  const newWebhook = {
    id: `wh-${Date.now()}`,
    url,
    events,
    secret: `whsec_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`,
    status: "Active",
  };
  webhooks.unshift(newWebhook);
  res.status(201).json({ webhook: newWebhook });
}

function deleteWebhook(req, res) {
  const { id } = req.params;
  webhooks = webhooks.filter((w) => w.id !== id);
  res.json({ message: "Webhook deleted" });
}

function testWebhookPing(req, res) {
  const { id } = req.params;
  const target = webhooks.find((w) => w.id === id);
  if (!target) return res.status(404).json({ message: "Webhook not found" });

  res.json({
    status: 200,
    message: "Ping payload delivered successfully",
    latency: "142ms",
    timestamp: new Date().toISOString(),
    responseBody: { received: true, event: "ping.test" },
  });
}

function inviteTeamMember(req, res) {
  const { name, email, role = "Support Agent" } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  const newMember = {
    id: `tm-${Date.now()}`,
    name,
    email,
    role,
    status: "Invited",
    avatar: name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2),
  };
  teamMembers.push(newMember);
  res.status(201).json({ member: newMember });
}

function updateTeamMember(req, res) {
  const { id } = req.params;
  const member = teamMembers.find((m) => m.id === id);
  if (!member) return res.status(404).json({ message: "Team member not found" });
  if (req.body.role) member.role = req.body.role;
  if (req.body.status) member.status = req.body.status;
  res.json({ member });
}

function removeTeamMember(req, res) {
  const { id } = req.params;
  teamMembers = teamMembers.filter((m) => m.id !== id);
  res.json({ message: "Team member removed" });
}

function toggleIntegration(req, res) {
  const { id } = req.params;
  const target = integrations.find((i) => i.id === id);
  if (target) {
    target.connected = !target.connected;
    if (target.connected && !target.channel) {
      target.channel = "Connected";
    }
  }
  res.json({ integrations });
}

function updateIntegration(req, res) {
  const { id } = req.params;
  const target = integrations.find((i) => i.id === id);
  if (target) {
    if (req.body.channel !== undefined) target.channel = req.body.channel;
    if (req.body.connected !== undefined) target.connected = req.body.connected;
  }
  res.json({ integrations });
}

function updatePlan(req, res) {
  const { planName, price, conversationsLimit, tokensLimit } = req.body;
  billing.currentPlan = planName || billing.currentPlan;
  if (price) billing.price = price;
  if (conversationsLimit) billing.conversationsLimit = conversationsLimit;
  if (tokensLimit) billing.tokensLimit = tokensLimit;
  res.json({ message: "Plan upgraded successfully", billing });
}

module.exports = {
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
};
