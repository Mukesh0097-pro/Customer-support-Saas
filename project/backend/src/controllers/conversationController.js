// In-memory mock store for Live Conversations & AI Ticket Desk
let conversations = [
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
    channel: "shopify", // shopify, slack, whatsapp, web, email
    subject: "Refund not showing in bank account after 5 business days",
    status: "Escalated", // "Open", "In Progress", "Escalated", "Resolved"
    priority: "High", // "High", "Medium", "Low"
    handler: "Human Lead", // "AI Assistant" | "Human Lead" | "Sarah J."
    sentiment: "Frustrated", // "Positive", "Neutral", "Frustrated"
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
  {
    id: "conv-105",
    customer: {
      id: "cust-905",
      name: "Liam O'Connor",
      email: "liam@finflow.ie",
      avatar: "LO",
      phone: "+353 1 496 0123",
      location: "Dublin, Ireland",
      plan: "Growth Tier",
      spent: "$4,200",
      joinedDate: "Feb 2025",
    },
    channel: "email",
    subject: "Requesting GDPR Data Processing Agreement (DPA)",
    status: "In Progress",
    priority: "Medium",
    handler: "Sarah J.",
    sentiment: "Neutral",
    confidence: 91,
    slaDueInMinutes: 110,
    createdAt: "3h ago",
    lastMessageTime: "45 mins ago",
    unread: false,
    messages: [
      {
        id: "msg-501",
        sender: "customer",
        authorName: "Liam O'Connor",
        text: "Please send us your signed Standard Contractual Clauses (SCC) and GDPR DPA document for our EU compliance audit.",
        timestamp: "3h ago",
      },
      {
        id: "msg-502",
        sender: "agent",
        authorName: "Sarah Jenkins",
        text: "Hi Liam, I have attached our pre-signed SupportAI GDPR DPA (v2.4) with EU SCC annexes. Let me know if your legal team requires any customized data addendums.",
        timestamp: "45 mins ago",
      },
    ],
    notes: [],
  },
];

// Controllers
function getConversations(req, res) {
  const { status, channel, search, priority } = req.query;
  let result = [...conversations];

  if (status && status !== "all") {
    if (status === "ai-active") {
      result = result.filter((c) => c.handler === "AI Assistant" && c.status !== "Resolved");
    } else if (status === "escalated") {
      result = result.filter((c) => c.status === "Escalated" || c.handler.includes("Human"));
    } else if (status === "resolved") {
      result = result.filter((c) => c.status === "Resolved");
    } else if (status === "vip") {
      result = result.filter((c) => c.customer.plan.includes("VIP"));
    } else {
      result = result.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }
  }

  if (channel && channel !== "all") {
    result = result.filter((c) => c.channel.toLowerCase() === channel.toLowerCase());
  }

  if (priority && priority !== "all") {
    result = result.filter((c) => c.priority.toLowerCase() === priority.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (c) =>
        c.subject.toLowerCase().includes(q) ||
        c.customer.name.toLowerCase().includes(q) ||
        c.customer.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    );
  }

  res.json({
    conversations: result,
    stats: {
      total: conversations.length,
      aiActive: conversations.filter((c) => c.handler === "AI Assistant" && c.status !== "Resolved").length,
      escalated: conversations.filter((c) => c.status === "Escalated").length,
      resolved: conversations.filter((c) => c.status === "Resolved").length,
      avgResponseTime: "8.2s",
      aiResolutionRate: "94.2%",
    },
  });
}

function getConversationById(req, res) {
  const { id } = req.params;
  const conversation = conversations.find((c) => c.id === id);
  if (!conversation) return res.status(404).json({ message: "Conversation not found" });
  conversation.unread = false;
  res.json({ conversation });
}

function sendMessage(req, res) {
  const { id } = req.params;
  const { text, sender = "agent", authorName = "Mukesh Kumar" } = req.body;
  if (!text) return res.status(400).json({ message: "Message text is required" });

  const conv = conversations.find((c) => c.id === id);
  if (!conv) return res.status(404).json({ message: "Conversation not found" });

  const newMsg = {
    id: `msg-${Date.now()}`,
    sender,
    authorName,
    text,
    timestamp: "Just now",
  };

  conv.messages.push(newMsg);
  conv.lastMessageTime = "Just now";

  if (sender === "agent") {
    conv.handler = authorName;
    if (conv.status === "Open" || conv.status === "Escalated") {
      conv.status = "In Progress";
    }
  }

  res.status(201).json({ message: newMsg, conversation: conv });
}

function generateCopilotDraft(req, res) {
  const { id } = req.params;
  const conv = conversations.find((c) => c.id === id);
  if (!conv) return res.status(404).json({ message: "Conversation not found" });

  // Intelligent context-aware draft generation based on customer question
  const lastCustomerMsg = [...conv.messages].reverse().find((m) => m.sender === "customer")?.text || "";

  let draftText = "";
  let confidence = 92;
  let citations = [];

  if (lastCustomerMsg.toLowerCase().includes("arn") || lastCustomerMsg.toLowerCase().includes("refund")) {
    draftText = `Hi ${conv.customer.name.split(" ")[0]}, I've pulled the Acquirer Reference Number (ARN) for your refund: ARN-883910249814. You can provide this 23-digit code directly to Chase Bank support to trace the settlement funds. Please let us know if Chase needs any further verification letters.`;
    confidence = 96;
    citations = [
      {
        docTitle: "Stripe Billing & Acquirer Reference Numbers (ARN)",
        section: "ARN Inquiries",
        snippet: "When a customer requests an ARN for an ACH/Card refund, provide the 23-digit acquirer trace reference.",
      },
    ];
  } else if (lastCustomerMsg.toLowerCase().includes("admin") || lastCustomerMsg.toLowerCase().includes("slack")) {
    draftText = `Yes, connecting the SupportAI Slack App requires workspace Admin or App Manager permissions in your Slack organization to authorize webhook scopes. Let me know if you'd like me to send an invite link directly to your Slack administrator!`;
    confidence = 95;
    citations = [
      {
        docTitle: "Slack App Scopes & Permissions",
        section: "Oauth Scopes",
        snippet: "Installing the bot app requires workspace admin consent for channel webhook routing.",
      },
    ];
  } else {
    draftText = `Hello ${conv.customer.name.split(" ")[0]}, thank you for reaching out. Based on your account configuration, I have verified your system parameters and resolved the underlying ticket flag. Please let us know if you need anything else!`;
    confidence = 88;
    citations = [
      {
        docTitle: "General Customer Support SLA",
        section: "Standard Escalation SOP",
        snippet: "Ground answers in verified customer account credentials.",
      },
    ];
  }

  res.json({
    draft: {
      text: draftText,
      confidence,
      citations,
      suggestedActions: ["Send as Human Agent", "Send & Mark Resolved", "Escalate to Engineering"],
    },
  });
}

function toggleHandover(req, res) {
  const { id } = req.params;
  const { targetHandler = "Human Lead" } = req.body;
  const conv = conversations.find((c) => c.id === id);
  if (!conv) return res.status(404).json({ message: "Conversation not found" });

  if (conv.handler === "AI Assistant") {
    conv.handler = targetHandler;
    conv.status = "In Progress";
  } else {
    conv.handler = "AI Assistant";
  }

  res.json({ conversation: conv });
}

function updateTicket(req, res) {
  const { id } = req.params;
  const conv = conversations.find((c) => c.id === id);
  if (!conv) return res.status(404).json({ message: "Conversation not found" });

  if (req.body.status) conv.status = req.body.status;
  if (req.body.priority) conv.priority = req.body.priority;
  if (req.body.handler) conv.handler = req.body.handler;

  res.json({ conversation: conv });
}

function addNote(req, res) {
  const { id } = req.params;
  const { text, author = "Mukesh Kumar (Admin)" } = req.body;
  if (!text) return res.status(400).json({ message: "Note text is required" });

  const conv = conversations.find((c) => c.id === id);
  if (!conv) return res.status(404).json({ message: "Conversation not found" });

  const newNote = {
    id: `note-${Date.now()}`,
    author,
    text,
    timestamp: "Just now",
  };

  conv.notes = conv.notes || [];
  conv.notes.unshift(newNote);

  res.status(201).json({ note: newNote, conversation: conv });
}

function recordWidgetInteraction({ conversationId, userMessage, aiResponse, citations, confidence, customerName = "Website Visitor" }) {
  let conv = conversations.find((c) => c.id === conversationId);
  const now = "Just now";

  if (!conv) {
    conv = {
      id: conversationId,
      customer: {
        id: `cust-${Date.now().toString().slice(-4)}`,
        name: customerName,
        email: "visitor@website.client",
        avatar: customerName.slice(0, 2).toUpperCase(),
        phone: "Web Session",
        location: "Online Visitor",
        plan: "Visitor",
        spent: "$0",
        joinedDate: "Today",
      },
      channel: "web",
      subject: userMessage.slice(0, 60) + (userMessage.length > 60 ? "..." : ""),
      status: confidence < 80 ? "Escalated" : "Open",
      priority: confidence < 80 ? "High" : "Low",
      handler: confidence < 80 ? "Human Lead" : "AI Assistant",
      sentiment: confidence < 80 ? "Frustrated" : "Neutral",
      confidence: confidence || 90,
      slaDueInMinutes: confidence < 80 ? 15 : 60,
      createdAt: now,
      lastMessageTime: now,
      unread: true,
      messages: [],
      notes: [],
    };
    conversations.unshift(conv);
  }

  // Add user message
  conv.messages.push({
    id: `msg-${Date.now()}-u`,
    sender: "customer",
    authorName: conv.customer.name,
    text: userMessage,
    timestamp: now,
  });

  // Add AI reply
  if (aiResponse) {
    conv.messages.push({
      id: `msg-${Date.now()}-a`,
      sender: "ai",
      authorName: "SupportAI Assistant",
      text: aiResponse,
      timestamp: now,
      confidence,
      citations: (citations || []).map((c) => ({
        docTitle: c.source || "Knowledge Base",
        section: `Chunk #${c.chunkIndex}`,
        snippet: c.content,
      })),
    });
  }

  conv.lastMessageTime = now;
  return conv;
}

module.exports = {
  getConversations,
  getConversationById,
  sendMessage,
  generateCopilotDraft,
  toggleHandover,
  updateTicket,
  addNote,
  recordWidgetInteraction,
};
