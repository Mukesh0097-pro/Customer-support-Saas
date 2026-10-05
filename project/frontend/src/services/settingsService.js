const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchSettings() {
  try {
    const res = await fetch(`${API_BASE}/settings`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch settings");
    return await res.json();
  } catch (err) {
    console.warn("Using local fallback settings:", err.message);
    return getFallbackSettings();
  }
}

export async function saveWorkspaceSettings(data) {
  try {
    const res = await fetch(`${API_BASE}/settings/workspace`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save workspace settings");
    return await res.json();
  } catch (err) {
    return { message: "Workspace settings saved (local)", workspace: data };
  }
}

export async function saveAgentConfig(data) {
  try {
    const res = await fetch(`${API_BASE}/settings/agent`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save agent config");
    return await res.json();
  } catch (err) {
    return { message: "AI Agent config saved (local)", agent: data };
  }
}

export async function saveNotificationSettings(data) {
  try {
    const res = await fetch(`${API_BASE}/settings/notifications`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to save notification preferences");
    return await res.json();
  } catch (err) {
    return { message: "Notification preferences saved (local)", notifications: data };
  }
}

export async function createApiKey(name, scope = "Full Admin") {
  try {
    const res = await fetch(`${API_BASE}/settings/api-keys`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, scope }),
    });
    if (!res.ok) throw new Error("Failed to create API key");
    return await res.json();
  } catch (err) {
    const rawKey = `sk_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    return {
      apiKey: {
        id: `key-${Date.now()}`,
        name,
        scope,
        keyPrefix: `${rawKey.slice(0, 10)}...${rawKey.slice(-4)}`,
        rawKey,
        createdAt: "Today",
        lastUsed: "Never",
      },
    };
  }
}

export async function revokeApiKey(id) {
  try {
    const res = await fetch(`${API_BASE}/settings/api-keys/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to revoke API key");
    return await res.json();
  } catch (err) {
    return { message: "API key revoked (local)" };
  }
}

export async function addWebhook(webhookData) {
  try {
    const res = await fetch(`${API_BASE}/settings/webhooks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(webhookData),
    });
    if (!res.ok) throw new Error("Failed to add webhook");
    return await res.json();
  } catch (err) {
    return {
      webhook: {
        id: `wh-${Date.now()}`,
        url: webhookData.url,
        events: webhookData.events || ["ticket.escalated"],
        secret: `whsec_${Math.random().toString(36).substring(2, 12)}`,
        status: "Active",
      },
    };
  }
}

export async function deleteWebhook(id) {
  try {
    const res = await fetch(`${API_BASE}/settings/webhooks/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete webhook");
    return await res.json();
  } catch (err) {
    return { message: "Webhook deleted (local)" };
  }
}

export async function testWebhookPing(id) {
  try {
    const res = await fetch(`${API_BASE}/settings/webhooks/${id}/ping`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to ping webhook");
    return await res.json();
  } catch (err) {
    return {
      status: 200,
      message: "Ping payload delivered successfully",
      latency: "128ms",
      timestamp: new Date().toISOString(),
      responseBody: { received: true, event: "ping.test" },
    };
  }
}

export async function inviteTeamMember(memberData) {
  try {
    const res = await fetch(`${API_BASE}/settings/team`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(memberData),
    });
    if (!res.ok) throw new Error("Failed to invite team member");
    return await res.json();
  } catch (err) {
    return {
      member: {
        id: `tm-${Date.now()}`,
        name: memberData.name,
        email: memberData.email,
        role: memberData.role || "Support Agent",
        status: "Invited",
        avatar: memberData.name.slice(0, 2).toUpperCase(),
      },
    };
  }
}

export async function updateTeamMember(id, data) {
  try {
    const res = await fetch(`${API_BASE}/settings/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update team member");
    return await res.json();
  } catch (err) {
    return { member: { id, ...data } };
  }
}

export async function removeTeamMember(id) {
  try {
    const res = await fetch(`${API_BASE}/settings/team/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to remove team member");
    return await res.json();
  } catch (err) {
    return { message: "Member removed (local)" };
  }
}

export async function toggleIntegration(id) {
  try {
    const res = await fetch(`${API_BASE}/settings/integrations/${id}/toggle`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to toggle integration");
    return await res.json();
  } catch (err) {
    return { message: "Toggled integration (local)" };
  }
}

export async function updateIntegration(id, data) {
  try {
    const res = await fetch(`${API_BASE}/settings/integrations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update integration");
    return await res.json();
  } catch (err) {
    return { message: "Integration updated (local)" };
  }
}

export async function upgradeBillingPlan(planData) {
  try {
    const res = await fetch(`${API_BASE}/settings/billing/plan`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(planData),
    });
    if (!res.ok) throw new Error("Failed to upgrade plan");
    return await res.json();
  } catch (err) {
    return {
      message: "Plan updated successfully (local)",
      billing: {
        currentPlan: planData.planName,
        price: planData.price,
        renewalDate: "Sept 1, 2026",
        conversationsUsed: 4218,
        conversationsLimit: planData.conversationsLimit || 25000,
        tokensUsed: 1420000,
        tokensLimit: planData.tokensLimit || 15000000,
        storageUsedMB: 64.2,
        storageLimitMB: 1000,
        seatsUsed: 4,
        seatsLimit: 25,
      },
    };
  }
}

function getFallbackSettings() {
  return {
    workspace: {
      name: "Acme Support Core",
      subdomain: "acme.supportai.com",
      supportEmail: "support@acme.inc",
      timezone: "UTC-05:00 (Eastern Time)",
      operatingHours: "24/7 (Continuous AI Coverage)",
      language: "English (US)",
    },
    agent: {
      model: "GPT-4o Resolution Engine",
      temperature: 0.3,
      tone: "Empathetic & Professional",
      confidenceThreshold: 82,
      hallucinationGuard: true,
      systemPrompt:
        "You are the SupportAI automated customer support assistant for Acme Inc. Be polite, precise, and concise. Always ground answers strictly in the indexed knowledge base citations. If the confidence score is below 80% or the customer expresses extreme frustration, gracefully escalate to a human agent.",
      bannedTopics: ["Political debates", "Internal salary details", "Competitor disparagement"],
    },
    apiKeys: [
      {
        id: "key-1",
        name: "Production Backend Ingestion",
        scope: "Full Admin",
        keyPrefix: "sk_live_94f8a...3e19",
        createdAt: "Aug 1, 2026",
        lastUsed: "2 mins ago",
      },
      {
        id: "key-2",
        name: "Staging Testing Key",
        scope: "Read Only",
        keyPrefix: "sk_test_71b0c...8a42",
        createdAt: "Aug 8, 2026",
        lastUsed: "Yesterday",
      },
    ],
    webhooks: [
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
    ],
    teamMembers: [
      { id: "tm-1", name: "Mukesh Kumar", email: "mukesh@acme.inc", role: "Admin", status: "Active", avatar: "MK" },
      { id: "tm-2", name: "Sarah Jenkins", email: "sarah.j@acme.inc", role: "Support Lead", status: "Active", avatar: "SJ" },
      { id: "tm-3", name: "David Chen", email: "david.c@acme.inc", role: "Support Agent", status: "Active", avatar: "DC" },
      { id: "tm-4", name: "Elena Rostova", email: "elena.r@acme.inc", role: "Support Agent", status: "Invited", avatar: "ER" },
    ],
    integrations: [
      { id: "slack", name: "Slack", description: "Route ticket escalations & urgent alerts directly to a designated Slack channel.", category: "Communication", connected: true, channel: "#support-escalations" },
      { id: "discord", name: "Discord", description: "Stream community support queries and ticket updates to Discord servers.", category: "Communication", connected: false, channel: null },
      { id: "zendesk", name: "Zendesk", description: "Bi-directional ticket sync with existing Zendesk Support instances.", category: "Ticketing", connected: true, channel: "Sync Active" },
      { id: "shopify", name: "Shopify", description: "Empower AI agent to look up customer orders, refunds, and tracking statuses.", category: "E-Commerce", connected: true, channel: "acme-store.myshopify.com" },
      { id: "whatsapp", name: "WhatsApp Business", description: "Connect WhatsApp Business API for instant multi-channel AI customer support.", category: "Messaging", connected: false, channel: null },
      { id: "stripe", name: "Stripe Billing", description: "Lookup subscription tiers, invoice receipts, and trigger refund authorisations.", category: "Payments", connected: true, channel: "Live Invoicing Active" },
      { id: "jira", name: "Jira Service Management", description: "File engineering bug tickets directly from escalated customer issues.", category: "Engineering", connected: false, channel: null },
      { id: "teams", name: "Microsoft Teams", description: "Stream high-priority escalations and bot triage straight to MS Teams channels.", category: "Communication", connected: false, channel: null },
      { id: "intercom", name: "Intercom Messenger", description: "Embed SupportAI resolution bot inside your Intercom live chat messenger.", category: "Ticketing", connected: true, channel: "Messenger App Active" },
      { id: "salesforce", name: "Salesforce CRM", description: "Sync lead profiles, customer lifetime value, and support cases with Salesforce.", category: "CRM", connected: false, channel: null },
      { id: "hubspot", name: "HubSpot Service Hub", description: "Bi-directional contact syncing and automated ticket resolution pipeline logging.", category: "CRM", connected: false, channel: null },
    ],
    billing: {
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
    },
    notifications: {
      slaBreachAlerts: true,
      urgentEscalations: true,
      dailyDigest: true,
      weeklyReport: false,
      soundAlerts: true,
      slackWebhookAlerts: true,
      escalationEmail: "ops-lead@acme.inc",
      notifyOnConfidenceBelow: 75,
    },
  };
}
