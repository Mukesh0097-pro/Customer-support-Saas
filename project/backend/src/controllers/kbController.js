// Mock in-memory database of ingested documents, URLs, FAQs, and vector chunks
let documents = [
  {
    id: "doc-1",
    name: "billing_and_refunds_policy.md",
    type: "markdown",
    size: "42 KB",
    chunksCount: 8,
    tokensCount: 1420,
    status: "Indexed",
    lastSynced: "10 mins ago",
    chunks: [
      {
        id: "chk-101",
        chunkIndex: 1,
        tokens: 180,
        content:
          "SupportAI offers a 14-day money-back guarantee for all paid subscriptions (Starter, Pro, and Enterprise). Customers can request a full refund within 14 days of the initial transaction date without any cancellation fees.",
      },
      {
        id: "chk-102",
        chunkIndex: 2,
        tokens: 165,
        content:
          "Refund requests after 14 days are processed on a pro-rata basis depending on the remaining days in the billing cycle. Upgrades take effect immediately, while downgrades take effect at the start of the next billing cycle.",
      },
      {
        id: "chk-103",
        chunkIndex: 3,
        tokens: 195,
        content:
          "Accepted payment methods include major credit cards (Visa, Mastercard, American Express), PayPal, and wire transfers for Enterprise annual contracts exceeding $10,000 ARR.",
      },
    ],
  },
  {
    id: "doc-2",
    name: "developer_api_reference_v2.pdf",
    type: "pdf",
    size: "128 KB",
    chunksCount: 14,
    tokensCount: 3840,
    status: "Indexed",
    lastSynced: "1 hour ago",
    chunks: [
      {
        id: "chk-201",
        chunkIndex: 1,
        tokens: 220,
        content:
          "All API requests must include a Bearer API Token in the Authorization header: 'Authorization: Bearer <YOUR_API_KEY>'. API keys can be generated and revoked in the SupportAI Settings > API Keys dashboard.",
      },
      {
        id: "chk-202",
        chunkIndex: 2,
        tokens: 240,
        content:
          "Standard API rate limits are 120 requests/minute for Pro accounts and 1,200 requests/minute for Enterprise accounts. Exceeding rate limits returns HTTP 429 Too Many Requests with a 'Retry-After' header in seconds.",
      },
      {
        id: "chk-203",
        chunkIndex: 3,
        tokens: 210,
        content:
          "Webhooks are signed using HMAC-SHA256 with your webhook secret. Verify the 'X-SupportAI-Signature' header against the computed hash of the raw request payload to ensure authenticity.",
      },
    ],
  },
  {
    id: "doc-3",
    name: "soc2_security_compliance.pdf",
    type: "pdf",
    size: "84 KB",
    chunksCount: 9,
    tokensCount: 2190,
    status: "Indexed",
    lastSynced: "3 hours ago",
    chunks: [
      {
        id: "chk-301",
        chunkIndex: 1,
        tokens: 190,
        content:
          "All customer data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. Encryption keys are rotated automatically every 90 days via AWS KMS.",
      },
      {
        id: "chk-302",
        chunkIndex: 2,
        tokens: 205,
        content:
          "SupportAI is SOC 2 Type II certified and fully compliant with GDPR and CCPA regulations. We do not use customer support conversation data to train generalized public AI models without explicit enterprise consent.",
      },
    ],
  },
];

let urls = [
  {
    id: "url-1",
    url: "https://docs.supportai.com/getting-started",
    depth: 2,
    pagesIndexed: 18,
    status: "Active",
    syncFrequency: "Daily",
    lastSynced: "45 mins ago",
  },
  {
    id: "url-2",
    url: "https://help.supportai.com/troubleshooting",
    depth: 3,
    pagesIndexed: 32,
    status: "Active",
    syncFrequency: "Every 6 hours",
    lastSynced: "2 hours ago",
  },
];

let faqs = [
  {
    id: "faq-1",
    category: "Billing",
    question: "Can I upgrade or downgrade my plan at any time?",
    answer:
      "Yes, you can change your subscription tier at any time in Workspace Settings > Billing. Upgrades are prorated immediately, and downgrades apply at the start of your next billing cycle.",
  },
  {
    id: "faq-2",
    category: "Integration",
    question: "How do I integrate SupportAI with Slack or Discord?",
    answer:
      "Go to Integrations > Slack/Discord, click 'Connect Workspace', and authorize the SupportAI Bot permissions. You can then route ticket escalations directly to private support channels.",
  },
  {
    id: "faq-3",
    category: "Security",
    question: "Is customer conversation data stored securely?",
    answer:
      "Yes. All messages are encrypted with AES-256 at rest and TLS 1.3 in transit. SupportAI is SOC 2 Type II certified and complies with GDPR/CCPA regulations.",
  },
  {
    id: "faq-4",
    category: "AI Agent",
    question: "How does the AI support agent handle escalations to humans?",
    answer:
      "When the AI detects user frustration, negative sentiment, or requests beyond its high-confidence knowledge base threshold, it automatically creates a human escalation ticket and hands off the conversation context.",
  },
];

function getStats() {
  const totalDocs = documents.length;
  const totalUrls = urls.length;
  const totalFaqs = faqs.length;
  const totalChunks =
    documents.reduce((acc, d) => acc + (d.chunksCount || 0), 0) +
    urls.reduce((acc, u) => acc + u.pagesIndexed * 4, 0) +
    faqs.length;
  const totalTokens =
    documents.reduce((acc, d) => acc + (d.tokensCount || 0), 0) +
    urls.reduce((acc, u) => acc + u.pagesIndexed * 950, 0) +
    faqs.length * 120;

  return {
    totalSources: totalDocs + totalUrls + totalFaqs,
    totalDocuments: totalDocs,
    totalUrls,
    totalFaqs,
    totalChunks,
    totalTokens,
    vectorIndexHealth: "100% Synced",
    avgLatency: "38 ms",
    embeddingModel: "text-embedding-3-small (1536 dim)",
  };
}

// GET /api/kb/sources
function getSources(req, res) {
  res.json({
    documents,
    urls,
    faqs,
    stats: getStats(),
  });
}

// POST /api/kb/documents
function addDocument(req, res) {
  const { name, type = "markdown", content = "" } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Document name is required" });
  }

  // Create simulated chunks
  const generatedChunks = [
    {
      id: `chk-${Date.now()}-1`,
      chunkIndex: 1,
      tokens: 175,
      content: content.slice(0, 300) || `Overview section of ${name}: Initial guidelines and definitions.`,
    },
    {
      id: `chk-${Date.now()}-2`,
      chunkIndex: 2,
      tokens: 190,
      content: content.slice(300, 650) || `Core instructions and operating procedures from ${name}.`,
    },
  ];

  const newDoc = {
    id: `doc-${Date.now()}`,
    name,
    type,
    size: `${Math.floor(Math.random() * 80 + 15)} KB`,
    chunksCount: generatedChunks.length,
    tokensCount: generatedChunks.reduce((a, c) => a + c.tokens, 0),
    status: "Indexed",
    lastSynced: "Just now",
    chunks: generatedChunks,
  };

  documents.unshift(newDoc);
  res.status(201).json({ document: newDoc, stats: getStats() });
}

// DELETE /api/kb/documents/:id
function deleteDocument(req, res) {
  const { id } = req.params;
  documents = documents.filter((d) => d.id !== id);
  res.json({ message: "Document removed", stats: getStats() });
}

// POST /api/kb/urls
function addUrl(req, res) {
  const { url, depth = 2, syncFrequency = "Daily" } = req.body;
  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  const newUrl = {
    id: `url-${Date.now()}`,
    url,
    depth: Number(depth),
    pagesIndexed: Math.floor(Math.random() * 20 + 5),
    status: "Active",
    syncFrequency,
    lastSynced: "Just now",
  };

  urls.unshift(newUrl);
  res.status(201).json({ url: newUrl, stats: getStats() });
}

// DELETE /api/kb/urls/:id
function deleteUrl(req, res) {
  const { id } = req.params;
  urls = urls.filter((u) => u.id !== id);
  res.json({ message: "URL target removed", stats: getStats() });
}

// POST /api/kb/faqs
function createFAQ(req, res) {
  const { question, answer, category = "General" } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ message: "Question and Answer are required" });
  }

  const newFaq = {
    id: `faq-${Date.now()}`,
    category,
    question,
    answer,
  };

  faqs.unshift(newFaq);
  res.status(201).json({ faq: newFaq, stats: getStats() });
}

// DELETE /api/kb/faqs/:id
function deleteFAQ(req, res) {
  const { id } = req.params;
  faqs = faqs.filter((f) => f.id !== id);
  res.json({ message: "FAQ removed", stats: getStats() });
}

// Reusable search function for RAG querying
function searchKB(query = "") {
  const lowerQuery = query.toLowerCase();

  // Gather all available chunks from all documents
  const allChunks = [];
  documents.forEach((doc) => {
    (doc.chunks || []).forEach((c) => {
      allChunks.push({
        source: doc.name,
        sourceType: doc.type,
        chunkId: c.id,
        chunkIndex: c.chunkIndex,
        content: c.content,
      });
    });
  });

  // Score chunks by keyword / semantic heuristic
  const scoredChunks = allChunks.map((chunk) => {
    let score = 0.65;
    const words = lowerQuery.split(/\s+/).filter((w) => w.length > 2);
    let matchCount = 0;
    words.forEach((w) => {
      if (chunk.content.toLowerCase().includes(w)) matchCount++;
    });
    if (words.length > 0) {
      score += (matchCount / words.length) * 0.33;
    }
    score = Math.min(0.98, score + Math.random() * 0.05);

    return {
      ...chunk,
      similarityScore: parseFloat(score.toFixed(3)),
    };
  });

  scoredChunks.sort((a, b) => b.similarityScore - a.similarityScore);
  const topMatches = scoredChunks.slice(0, 3);

  let synthesizedAnswer = "";
  let confidence = Math.round((topMatches[0]?.similarityScore || 0.8) * 100);

  if (lowerQuery.includes("refund") || lowerQuery.includes("money") || lowerQuery.includes("cancel")) {
    synthesizedAnswer =
      "SupportAI provides a 14-day full money-back guarantee for Starter, Pro, and Enterprise subscriptions with zero cancellation fees. Requests after 14 days are prorated based on remaining days.";
    confidence = 96;
  } else if (lowerQuery.includes("api") || lowerQuery.includes("token") || lowerQuery.includes("rate") || lowerQuery.includes("webhook")) {
    synthesizedAnswer =
      "All API requests require a Bearer token in the Authorization header. Rate limits are 120 req/min for Pro and 1,200 req/min for Enterprise. Webhooks are verified using HMAC-SHA256 with the 'X-SupportAI-Signature' header.";
    confidence = 94;
  } else if (lowerQuery.includes("security") || lowerQuery.includes("soc") || lowerQuery.includes("encrypt") || lowerQuery.includes("gdpr")) {
    synthesizedAnswer =
      "Data is encrypted using TLS 1.3 in transit and AES-256 at rest with AWS KMS 90-day rotation. SupportAI is SOC 2 Type II certified and complies with GDPR & CCPA.";
    confidence = 98;
  } else if (lowerQuery.includes("human") || lowerQuery.includes("agent") || lowerQuery.includes("representative") || lowerQuery.includes("escalate")) {
    synthesizedAnswer =
      "I understand you'd like to speak with a human team member. I have escalated this conversation to our support team and an agent will join shortly.";
    confidence = 70; // Triggers escalation
  } else {
    synthesizedAnswer = `Based on your indexed documentation [${topMatches[0]?.source || "Knowledge Base"}]: ${topMatches[0]?.content || "Information retrieved from the vector index."}`;
  }

  return {
    topMatches,
    synthesizedAnswer,
    confidence,
  };
}

// POST /api/kb/query-test (Simulates vector semantic search + RAG generation)
function simulateQuery(req, res) {
  const { query = "" } = req.body;
  if (!query.trim()) {
    return res.status(400).json({ message: "Query string is required" });
  }

  const { topMatches, synthesizedAnswer, confidence } = searchKB(query);

  res.json({
    query,
    confidence,
    latencyMs: Math.floor(Math.random() * 25 + 28),
    tokensUsed: 312,
    embeddingModel: "text-embedding-3-small",
    retrievedChunks: topMatches,
    synthesizedAnswer,
    augmentedPrompt: `SYSTEM: You are the SupportAI automated customer support assistant. Answer the customer query accurately using ONLY the provided retrieved context citations.\n\nCONTEXT:\n${topMatches.map((m, i) => `[Source ${i + 1}: ${m.source}#chunk-${m.chunkIndex}]\n${m.content}`).join("\n\n")}\n\nQUERY: ${query}`,
  });
}

// POST /api/kb/reindex
function reindexAll(req, res) {
  documents.forEach((d) => (d.lastSynced = "Just now"));
  urls.forEach((u) => (u.lastSynced = "Just now"));
  res.json({
    message: "Vector re-indexing completed successfully across all sources.",
    stats: getStats(),
  });
}

module.exports = {
  getSources,
  addDocument,
  deleteDocument,
  addUrl,
  deleteUrl,
  createFAQ,
  deleteFAQ,
  simulateQuery,
  reindexAll,
  searchKB,
};
