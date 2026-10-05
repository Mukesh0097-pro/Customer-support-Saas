import { useState, useEffect } from "react";
import {
  FileText,
  Globe,
  HelpCircle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import KBStatsRibbon from "../../components/knowledge/KBStatsRibbon";
import DocumentManager from "../../components/knowledge/DocumentManager";
import WebsiteCrawler from "../../components/knowledge/WebsiteCrawler";
import FAQEditor from "../../components/knowledge/FAQEditor";
import RAGSimulator from "../../components/knowledge/RAGSimulator";
import {
  fetchKBSources,
  addKBDocument,
  deleteKBDocument,
  addKBCrawlerUrl,
  deleteKBCrawlerUrl,
  createKBFAQ,
  deleteKBFAQ,
  triggerReindex,
} from "../../services/kbService";

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState("documents");
  const [loading, setLoading] = useState(true);
  const [isReindexing, setIsReindexing] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [urls, setUrls] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchKBSources();
    setDocuments(data.documents || []);
    setUrls(data.urls || []);
    setFaqs(data.faqs || []);
    setStats(data.stats || null);
    setLoading(false);
  };

  const handleAddDocument = async (doc) => {
    const res = await addKBDocument(doc);
    if (res.document) {
      setDocuments((prev) => [res.document, ...prev]);
    }
    if (res.stats) setStats(res.stats);
  };

  const handleDeleteDocument = async (id) => {
    await deleteKBDocument(id);
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    loadData();
  };

  const handleAddUrl = async (urlData) => {
    const res = await addKBCrawlerUrl(urlData);
    if (res.url) {
      setUrls((prev) => [res.url, ...prev]);
    }
    if (res.stats) setStats(res.stats);
  };

  const handleDeleteUrl = async (id) => {
    await deleteKBCrawlerUrl(id);
    setUrls((prev) => prev.filter((u) => u.id !== id));
    loadData();
  };

  const handleAddFAQ = async (faq) => {
    const res = await createKBFAQ(faq);
    if (res.faq) {
      setFaqs((prev) => [res.faq, ...prev]);
    }
    if (res.stats) setStats(res.stats);
  };

  const handleDeleteFAQ = async (id) => {
    await deleteKBFAQ(id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    loadData();
  };

  const handleReindex = async () => {
    setIsReindexing(true);
    const res = await triggerReindex();
    if (res.stats) setStats(res.stats);
    setTimeout(() => {
      setIsReindexing(false);
    }, 800);
  };

  const tabs = [
    { id: "documents", label: "Documents & Files", icon: FileText, count: documents.length },
    { id: "crawler", label: "Website Crawler", icon: Globe, count: urls.length },
    { id: "faqs", label: "Direct Q&A FAQs", icon: HelpCircle, count: faqs.length },
    { id: "simulator", label: "Live RAG Simulator", icon: Sparkles },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-black" />
            <h1 className="font-display text-xl font-semibold tracking-tight">
              Knowledge Base & RAG Studio
            </h1>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            Train and empower the SupportAI agent with company docs, crawled URLs, and vector embeddings.
          </p>
        </div>
      </div>

      {/* Top Vector Summary Ribbon */}
      <KBStatsRibbon
        stats={stats}
        onReindex={handleReindex}
        isReindexing={isReindexing}
      />

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-base-border mb-6 overflow-x-auto pb-0.5">
        {tabs.map(({ id, label, icon: Icon, count }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-black text-text-primary font-semibold"
                  : "border-transparent text-text-muted hover:text-text-primary hover:border-black/20"
              }`}
            >
              <Icon size={15} className={isActive ? "text-black" : "text-text-faint"} />
              <span>{label}</span>
              {count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? "bg-black text-white" : "bg-black/[0.05] text-text-muted"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Documents & Files */}
      {activeTab === "documents" && (
        <DocumentManager
          documents={documents}
          onAddDocument={handleAddDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      )}

      {/* Tab 2: Website Crawler */}
      {activeTab === "crawler" && (
        <WebsiteCrawler
          urls={urls}
          onAddUrl={handleAddUrl}
          onDeleteUrl={handleDeleteUrl}
        />
      )}

      {/* Tab 3: Direct FAQs */}
      {activeTab === "faqs" && (
        <FAQEditor
          faqs={faqs}
          onAddFAQ={handleAddFAQ}
          onDeleteFAQ={handleDeleteFAQ}
        />
      )}

      {/* Tab 4: Live RAG Sandbox */}
      {activeTab === "simulator" && <RAGSimulator />}
    </DashboardLayout>
  );
}
