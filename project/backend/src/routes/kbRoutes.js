const express = require("express");
const {
  getSources,
  addDocument,
  deleteDocument,
  addUrl,
  deleteUrl,
  createFAQ,
  deleteFAQ,
  simulateQuery,
  reindexAll,
} = require("../controllers/kbController");

const router = express.Router();

// Sources & stats
router.get("/sources", getSources);

// Documents
router.post("/documents", addDocument);
router.delete("/documents/:id", deleteDocument);

// Web URLs
router.post("/urls", addUrl);
router.delete("/urls/:id", deleteUrl);

// FAQs
router.post("/faqs", createFAQ);
router.delete("/faqs/:id", deleteFAQ);

// RAG Query Sandbox & Re-index
router.post("/query-test", simulateQuery);
router.post("/reindex", reindexAll);

module.exports = router;
