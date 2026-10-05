import { useState, useEffect } from "react";
import {
  MessageSquare,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Sliders,
  Filter,
  Zap,
  Bot,
  Activity,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import ConversationQueue from "../../components/conversations/ConversationQueue";
import ChatWorkspace from "../../components/conversations/ChatWorkspace";
import TicketCustomerInspector from "../../components/conversations/TicketCustomerInspector";
import {
  fetchConversations,
  fetchConversationById,
  sendConversationMessage,
  fetchCopilotDraft,
  toggleConversationHandover,
  updateConversationTicket,
  addConversationNote,
} from "../../services/conversationService";

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedConv, setSelectedConv] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, [statusFilter, channelFilter, searchQuery]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    const data = await fetchConversations({
      status: statusFilter,
      channel: channelFilter,
      search: searchQuery,
    });
    setConversations(data.conversations || []);
    setStats(data.stats || null);

    if (data.conversations?.length > 0) {
      // If current selectedId still exists in list, keep it; otherwise pick first
      const currentSelected = data.conversations.find((c) => c.id === selectedId);
      const targetId = currentSelected ? currentSelected.id : data.conversations[0].id;
      setSelectedId(targetId);
      loadSingleConversation(targetId);
    } else {
      setSelectedId(null);
      setSelectedConv(null);
    }
    setLoading(false);
  };

  const loadSingleConversation = async (id) => {
    const res = await fetchConversationById(id);
    if (res?.conversation) {
      setSelectedConv(res.conversation);
    }
  };

  const handleSelectConversation = (id) => {
    setSelectedId(id);
    loadSingleConversation(id);
  };

  const handleSendMessage = async (text) => {
    if (!selectedId) return;
    const res = await sendConversationMessage(selectedId, {
      text,
      sender: "agent",
      authorName: "Mukesh Kumar",
    });

    if (res?.message) {
      setSelectedConv((prev) =>
        prev
          ? {
              ...prev,
              handler: "Mukesh Kumar",
              status: prev.status === "Open" || prev.status === "Escalated" ? "In Progress" : prev.status,
              messages: [...prev.messages, res.message],
            }
          : prev
      );

      // Update in queue list
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? {
                ...c,
                handler: "Mukesh Kumar",
                status: c.status === "Open" || c.status === "Escalated" ? "In Progress" : c.status,
                lastMessageTime: "Just now",
                messages: [...c.messages, res.message],
              }
            : c
        )
      );

      showToast("Response sent to customer");
    }
  };

  const handleToggleHandover = async (targetHandler) => {
    if (!selectedId) return;
    await toggleConversationHandover(selectedId, targetHandler);

    setSelectedConv((prev) =>
      prev ? { ...prev, handler: targetHandler } : prev
    );

    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, handler: targetHandler } : c))
    );

    showToast(`Session assigned to ${targetHandler}`);
  };

  const handleUpdateTicket = async (data) => {
    if (!selectedId) return;
    await updateConversationTicket(selectedId, data);

    setSelectedConv((prev) => (prev ? { ...prev, ...data } : prev));
    setConversations((prev) =>
      prev.map((c) => (c.id === selectedId ? { ...c, ...data } : c))
    );

    showToast("Ticket updated");
  };

  const handleAddNote = async (text) => {
    if (!selectedId) return;
    const res = await addConversationNote(selectedId, {
      text,
      author: "Mukesh Kumar (Admin)",
    });

    if (res?.note) {
      setSelectedConv((prev) =>
        prev ? { ...prev, notes: [res.note, ...(prev.notes || [])] } : prev
      );
      showToast("Internal note added");
    }
  };

  return (
    <DashboardLayout>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Stats Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-black" />
            <h1 className="font-display text-xl font-semibold tracking-tight">
              Live Omnichannel Inbox & AI Ticket Desk
            </h1>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            Real-time customer conversation streams, RAG Copilot resolution drafts, and live human handover.
          </p>
        </div>

        {/* Live Ribbon Stats */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-base-border bg-white text-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-text-muted">AI Res. Rate:</span>
            <strong className="font-mono text-text-primary">{stats?.aiResolutionRate || "94.2%"}</strong>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-base-border rounded bg-white hover:bg-black/[0.02] text-text-muted hover:text-text-primary transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Sync Feed
          </button>
        </div>
      </div>

      {/* 3-Column Resolution Desk Container */}
      <div className="panel bg-white border border-base-border flex h-[calc(100vh-190px)] min-h-[580px] overflow-hidden rounded-card">
        {/* Column 1: Queue */}
        <ConversationQueue
          conversations={conversations}
          selectedId={selectedId}
          onSelectConversation={handleSelectConversation}
          stats={stats}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          channelFilter={channelFilter}
          setChannelFilter={setChannelFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Column 2: Chat Workspace */}
        <ChatWorkspace
          conversation={selectedConv}
          onSendMessage={handleSendMessage}
          onToggleHandover={handleToggleHandover}
          onFetchDraft={fetchCopilotDraft}
          onUpdateStatus={(status) => handleUpdateTicket({ status })}
        />

        {/* Column 3: Customer & Ticket Inspector */}
        <TicketCustomerInspector
          conversation={selectedConv}
          onUpdateTicket={handleUpdateTicket}
          onAddNote={handleAddNote}
        />
      </div>
    </DashboardLayout>
  );
}
