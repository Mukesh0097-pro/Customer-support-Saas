import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Tag,
  Clock,
  Shield,
  ShoppingBag,
  Plus,
  StickyNote,
  Smile,
  Frown,
  Meh,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { ShopifyLogo } from "../settings/IntegrationLogos";

export default function TicketCustomerInspector({
  conversation,
  onUpdateTicket,
  onAddNote,
}) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "notes"
  const [noteText, setNoteText] = useState("");

  if (!conversation) return null;

  const { customer, shopifyContext } = conversation;

  const handleStatusChange = (newStatus) => {
    onUpdateTicket({ status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    onUpdateTicket({ priority: newPriority });
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(noteText.trim());
    setNoteText("");
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "Positive":
        return <Smile size={14} className="text-emerald-600" />;
      case "Frustrated":
        return <Frown size={14} className="text-rose-600" />;
      default:
        return <Meh size={14} className="text-amber-600" />;
    }
  };

  return (
    <div className="hidden xl:flex flex-col h-full bg-white border-l border-base-border w-[340px] shrink-0">
      {/* Sub-Header */}
      <div className="p-3.5 border-b border-base-border flex items-center justify-between">
        <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-md w-full">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 py-1 text-xs font-semibold rounded transition-colors text-center ${
              activeTab === "overview"
                ? "bg-white shadow-2xs text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Customer 360
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-1 text-xs font-semibold rounded transition-colors text-center flex items-center justify-center gap-1.5 ${
              activeTab === "notes"
                ? "bg-white shadow-2xs text-text-primary"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            <span>Internal Notes</span>
            {(conversation.notes || []).length > 0 && (
              <span className="h-4 w-4 rounded-full bg-black text-white text-[9px] flex items-center justify-center font-mono font-bold">
                {conversation.notes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Customer & Ticket Overview */}
      {activeTab === "overview" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Customer Profile Card */}
          <div className="p-3.5 rounded-lg bg-black/[0.015] border border-base-border space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
                {customer.avatar || customer.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="font-display font-semibold text-xs text-text-primary truncate">
                  {customer.name}
                </h4>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-700 font-medium border border-emerald-500/20 mt-0.5">
                  {customer.plan}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-text-muted pt-1">
              <div className="flex items-center gap-2 truncate">
                <Mail size={12} className="text-text-faint shrink-0" />
                <span className="font-mono text-[11px] truncate">{customer.email}</span>
              </div>
              {customer.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={12} className="text-text-faint shrink-0" />
                  <span className="font-mono text-[11px]">{customer.phone}</span>
                </div>
              )}
              {customer.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={12} className="text-text-faint shrink-0" />
                  <span>{customer.location}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-base-border/70 font-mono">
                <span className="text-text-faint">Lifetime Spend:</span>
                <strong className="text-text-primary">{customer.spent || "$0"}</strong>
              </div>
            </div>
          </div>

          {/* Ticket Properties */}
          <div className="space-y-3">
            <h5 className="font-display font-semibold text-xs text-text-primary">
              Ticket Metadata & Status
            </h5>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Ticket ID</span>
                <code className="font-mono font-bold text-[11px] px-1.5 py-0.2 rounded bg-black/[0.04]">
                  {conversation.id}
                </code>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-muted">Status</span>
                <select
                  value={conversation.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="px-2 py-1 text-xs border border-base-border rounded bg-white font-medium focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Escalated">Escalated</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-muted">Priority</span>
                <select
                  value={conversation.priority}
                  onChange={(e) => handlePriorityChange(e.target.value)}
                  className="px-2 py-1 text-xs border border-base-border rounded bg-white font-medium focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-text-muted">Sentiment</span>
                <span className="flex items-center gap-1 font-medium text-[11px]">
                  {getSentimentIcon(conversation.sentiment)}
                  {conversation.sentiment}
                </span>
              </div>
            </div>
          </div>

          {/* Shopify Order Context Card */}
          {shopifyContext && (
            <div className="p-3.5 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShopifyLogo className="w-4 h-4" />
                  <span className="text-xs font-semibold text-text-primary">
                    Shopify E-Commerce Record
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-800 font-bold">
                  {shopifyContext.orderId}
                </span>
              </div>

              <div className="space-y-1 text-xs text-text-muted">
                <p className="text-[11px] text-text-primary font-medium">
                  {shopifyContext.items[0]}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono pt-1">
                  <span>Order Total:</span>
                  <strong className="text-text-primary">{shopifyContext.total}</strong>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span>Fulfillment:</span>
                  <span className="text-amber-700 font-semibold">{shopifyContext.fulfillmentStatus}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Internal Collaboration Notes */}
      {activeTab === "notes" && (
        <div className="flex-1 flex flex-col h-full overflow-hidden p-4 space-y-4">
          <form onSubmit={handleAddNoteSubmit} className="space-y-2 shrink-0">
            <textarea
              rows={3}
              placeholder="Add private note for the support team…"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-2.5 text-xs border border-base-border rounded focus:outline-none focus:border-black resize-none bg-black/[0.01]"
            />
            <button
              type="submit"
              disabled={!noteText.trim()}
              className="w-full py-1.5 text-xs font-semibold bg-black text-white rounded hover:opacity-85 disabled:opacity-40 transition-opacity"
            >
              Add Note
            </button>
          </form>

          <div className="flex-1 overflow-y-auto space-y-2.5">
            {(conversation.notes || []).length === 0 ? (
              <p className="text-center text-text-faint text-xs py-8">
                No internal notes yet. Add one above.
              </p>
            ) : (
              conversation.notes.map((note) => (
                <div key={note.id} className="p-3 rounded bg-amber-500/5 border border-amber-500/20 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-text-primary">{note.author}</span>
                    <span className="text-text-faint font-mono">{note.timestamp}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed font-body">{note.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
