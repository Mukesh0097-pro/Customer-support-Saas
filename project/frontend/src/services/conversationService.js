const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchConversations(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/conversations?${query}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch conversations");
    return await res.json();
  } catch (err) {
    console.warn("Using local fallback conversations:", err.message);
    return getFallbackConversations(params);
  }
}

export async function fetchConversationById(id) {
  try {
    const res = await fetch(`${API_BASE}/conversations/${id}`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch conversation");
    return await res.json();
  } catch (err) {
    const fallbackList = getFallbackConversations().conversations;
    const found = fallbackList.find((c) => c.id === id) || fallbackList[0];
    return { conversation: found };
  }
}

export async function sendConversationMessage(id, messageData) {
  try {
    const res = await fetch(`${API_BASE}/conversations/${id}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(messageData),
    });
    if (!res.ok) throw new Error("Failed to send message");
    return await res.json();
  } catch (err) {
    return {
      message: {
        id: `msg-${Date.now()}`,
        sender: messageData.sender || "agent",
        authorName: messageData.authorName || "Mukesh Kumar",
        text: messageData.text,
        timestamp: "Just now",
      },
    };
  }
}

export async function fetchCopilotDraft(id) {
  try {
    const res = await fetch(`${API_BASE}/conversations/${id}/copilot-draft`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch copilot draft");
    return await res.json();
  } catch (err) {
    return {
      draft: {
        text: "Hi! I've verified your account and checked our knowledge base. Everything is configured properly and I've cleared the rate limit flag for your endpoint.",
        confidence: 94,
        citations: [
          {
            docTitle: "API Rate Limits & Authentication Troubleshooting",
            section: "Section 4.1 - 429 Mitigation",
            snippet: "Rate limits automatically reset on rolling 60-second windows.",
          },
        ],
        suggestedActions: ["Send as Human Agent", "Send & Mark Resolved"],
      },
    };
  }
}

export async function toggleConversationHandover(id, targetHandler = "Human Lead") {
  try {
    const res = await fetch(`${API_BASE}/conversations/${id}/handover`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ targetHandler }),
    });
    if (!res.ok) throw new Error("Failed to toggle handover");
    return await res.json();
  } catch (err) {
    return { success: true };
  }
}

export async function updateConversationTicket(id, data) {
  try {
    const res = await fetch(`${API_BASE}/conversations/${id}/ticket`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update ticket");
    return await res.json();
  } catch (err) {
    return { success: true, updated: data };
  }
}

export async function addConversationNote(id, noteData) {
  try {
    const res = await fetch(`${API_BASE}/conversations/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(noteData),
    });
    if (!res.ok) throw new Error("Failed to add note");
    return await res.json();
  } catch (err) {
    return {
      note: {
        id: `note-${Date.now()}`,
        author: noteData.author || "Mukesh Kumar",
        text: noteData.text,
        timestamp: "Just now",
      },
    };
  }
}

function getFallbackConversations(params = {}) {
  const all = [
    {
      id: "conv-101",
      customer: {
        id: "cust-901",
        name: "Marcus Chen",
        email: "marcus.chen@techcorp.io",
        avatar: "MC",
        phone: "+1 (555) 234-8901",
        location: "San Francisco, CA",
        plan: "Enterprise VIP",
        spent: "$14,250",
        joinedDate: "Mar 2024",
      },
      channel: "shopify",
      subject: "Refund not showing in bank account after 5 business days",
      status: "Escalated",
      priority: "High",
      handler: "Human Lead",
      sentiment: "Frustrated",
      confidence: 68,
      slaDueInMinutes: 12,
      createdAt: "18 mins ago",
      lastMessageTime: "2 mins ago",
      unread: true,
      shopifyContext: {
        orderId: "#ORD-99412",
        orderDate: "Aug 8, 2026",
        items: ["Enterprise AI Gateway Appliance (x2)", "Custom Vector Indexing License"],
        total: "$3,499.00",
        fulfillmentStatus: "Refund Pending",
        trackingNumber: "TRK-9821491-US",
      },
      messages: [
        {
          id: "msg-1",
          sender: "customer",
          authorName: "Marcus Chen",
          text: "Hi there. I was promised a refund of $3,499 for order #ORD-99412 five days ago, but nothing has credited my Chase account yet. Can someone look into this immediately?",
          timestamp: "18 mins ago",
        },
        {
          id: "msg-2",
          sender: "ai",
          authorName: "SupportAI Assistant",
          text: "Hello Marcus, I apologize for the delay with your refund. I've checked our billing ledger: Refund #REF-8812 was authorized on Aug 8, 2026 for $3,499.00. Standard ACH bank clearance typically takes 5 to 7 business days depending on Chase's clearing cycle.",
          timestamp: "16 mins ago",
          confidence: 84,
          citations: [
            {
              docTitle: "Billing & Refund Processing Policy",
              section: "Section 3.2 - Bank Settlement Windows",
              snippet: "Credit card and ACH merchant refunds take 5-7 business days to reflect on customer statements.",
            },
          ],
        },
        {
          id: "msg-3",
          sender: "customer",
          authorName: "Marcus Chen",
          text: "Today is the 6th business day and my accounting team needs the transaction reference code (ARN) to verify with Chase. Please escalate this.",
          timestamp: "2 mins ago",
        },
      ],
      notes: [
        {
          id: "note-1",
          author: "Sarah Jenkins (Support Lead)",
          text: "Customer requested Acquirer Reference Number (ARN). Checking Stripe billing portal for ARN code.",
          timestamp: "1 min ago",
        },
      ],
    },
    {
      id: "conv-102",
      customer: {
        id: "cust-902",
        name: "Elena Rostova",
        email: "elena.r@innovate.co",
        avatar: "ER",
        phone: "+44 20 7946 0912",
        location: "London, UK",
        plan: "Growth Tier",
        spent: "$3,600",
        joinedDate: "Jan 2025",
      },
      channel: "slack",
      subject: "How do I configure Slack escalation webhook alerts?",
      status: "In Progress",
      priority: "Medium",
      handler: "AI Assistant",
      sentiment: "Neutral",
      confidence: 94,
      slaDueInMinutes: 45,
      createdAt: "35 mins ago",
      lastMessageTime: "8 mins ago",
      unread: false,
      messages: [
        {
          id: "msg-201",
          sender: "customer",
          authorName: "Elena Rostova",
          text: "Hey! We want all high-priority ticket escalations to route directly into our #support-triage Slack channel. What webhook settings do we need?",
          timestamp: "35 mins ago",
        },
        {
          id: "msg-202",
          sender: "ai",
          authorName: "SupportAI Assistant",
          text: "Hi Elena! You can configure this in SupportAI Settings > Integrations > Slack. Click 'Connect', select your workspace, and pick #support-triage. Alternatively, configure a Webhook in Settings > Webhooks with event 'ticket.escalated'.",
          timestamp: "33 mins ago",
          confidence: 96,
          citations: [
            {
              docTitle: "Slack Integration Guide & Webhook Routing",
              section: "Step 2 - Channel Authorization",
              snippet: "Navigate to Settings > Integrations to bind channels for automated escalation broadcasts.",
            },
          ],
        },
        {
          id: "msg-203",
          sender: "customer",
          authorName: "Elena Rostova",
          text: "Awesome, does this require admin privileges in Slack?",
          timestamp: "8 mins ago",
        },
      ],
      notes: [],
    },
    {
      id: "conv-103",
      customer: {
        id: "cust-903",
        name: "David Kim",
        email: "david.kim@hypergrowth.app",
        avatar: "DK",
        phone: "+1 (555) 883-1029",
        location: "Austin, TX",
        plan: "Starter Plan",
        spent: "$588",
        joinedDate: "May 2026",
      },
      channel: "whatsapp",
      subject: "API Token rate limit returned 429 Too Many Requests",
      status: "Open",
      priority: "High",
      handler: "AI Assistant",
      sentiment: "Frustrated",
      confidence: 76,
      slaDueInMinutes: 18,
      createdAt: "12 mins ago",
      lastMessageTime: "12 mins ago",
      unread: true,
      messages: [
        {
          id: "msg-301",
          sender: "customer",
          authorName: "David Kim",
          text: "Our production batch script started receiving HTTP 429 rate limit errors when calling /v1/chat/completions. What is our current RPM limit?",
          timestamp: "12 mins ago",
        },
      ],
      notes: [],
    },
    {
      id: "conv-104",
      customer: {
        id: "cust-904",
        name: "Sophia Martinez",
        email: "sophia@retailhub.com",
        avatar: "SM",
        phone: "+1 (555) 492-3301",
        location: "Chicago, IL",
        plan: "Enterprise VIP",
        spent: "$28,900",
        joinedDate: "Nov 2023",
      },
      channel: "web",
      subject: "Can I increase our vector embedding index to 500k documents?",
      status: "Resolved",
      priority: "Low",
      handler: "AI Assistant",
      sentiment: "Positive",
      confidence: 98,
      slaDueInMinutes: 0,
      createdAt: "2h ago",
      lastMessageTime: "1h ago",
      unread: false,
      messages: [
        {
          id: "msg-401",
          sender: "customer",
          authorName: "Sophia Martinez",
          text: "Hi! We're planning to index our entire 450,000 product catalog into SupportAI knowledge base. Is there any quota limit on Enterprise?",
          timestamp: "2h ago",
        },
        {
          id: "msg-402",
          sender: "ai",
          authorName: "SupportAI Assistant",
          text: "Hello Sophia! Enterprise Scale accounts include dedicated vector clustering that effortlessly supports up to 1,000,000 documents with sub-50ms vector cosine similarity lookups.",
          timestamp: "2h ago",
          confidence: 99,
          citations: [
            {
              docTitle: "Vector Database Limits & Architecture",
              section: "Enterprise Cluster Specifications",
              snippet: "Enterprise Scale clusters scale to 1M+ embeddings with automatic partition sharding.",
            },
          ],
        },
        {
          id: "msg-403",
          sender: "customer",
          authorName: "Sophia Martinez",
          text: "Perfect, that's exactly what I needed. Thank you!",
          timestamp: "1h ago",
        },
      ],
      notes: [],
    },
  ];

  let filtered = [...all];
  const { status, channel, search, priority } = params;

  if (status && status !== "all") {
    if (status === "ai-active") {
      filtered = filtered.filter((c) => c.handler === "AI Assistant" && c.status !== "Resolved");
    } else if (status === "escalated") {
      filtered = filtered.filter((c) => c.status === "Escalated" || c.handler.includes("Human"));
    } else if (status === "resolved") {
      filtered = filtered.filter((c) => c.status === "Resolved");
    } else if (status === "vip") {
      filtered = filtered.filter((c) => c.customer.plan.includes("VIP"));
    }
  }

  if (channel && channel !== "all") {
    filtered = filtered.filter((c) => c.channel.toLowerCase() === channel.toLowerCase());
  }

  if (priority && priority !== "all") {
    filtered = filtered.filter((c) => c.priority.toLowerCase() === priority.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.subject.toLowerCase().includes(q) ||
        c.customer.name.toLowerCase().includes(q) ||
        c.customer.email.toLowerCase().includes(q)
    );
  }

  return {
    conversations: filtered,
    stats: {
      total: all.length,
      aiActive: all.filter((c) => c.handler === "AI Assistant" && c.status !== "Resolved").length,
      escalated: all.filter((c) => c.status === "Escalated").length,
      resolved: all.filter((c) => c.status === "Resolved").length,
      avgResponseTime: "8.2s",
      aiResolutionRate: "94.2%",
    },
  };
}
