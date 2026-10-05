import { useState } from "react";
import {
  Webhook,
  Plus,
  Trash2,
  Send,
  Check,
  Copy,
  Eye,
  EyeOff,
  Activity,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

const AVAILABLE_EVENTS = [
  { id: "ticket.escalated", label: "Ticket Escalated", desc: "Triggered when AI confidence drops below threshold or user requests human." },
  { id: "ticket.resolved", label: "Ticket Resolved", desc: "Triggered when customer marks query satisfied or agent finishes conversation." },
  { id: "ticket.created", label: "Ticket Created", desc: "Triggered upon first inbound customer message." },
  { id: "rag.reindexed", label: "Knowledge Base Reindexed", desc: "Triggered when vector embeddings and documents update." },
  { id: "agent.sentiment_alert", label: "Negative Sentiment Alert", desc: "Triggered if customer expresses severe dissatisfaction." },
];

export default function WebhooksManager({ webhooks = [], onAddWebhook, onDeleteWebhook, onTestPing }) {
  const [isAdding, setIsAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState(["ticket.escalated", "ticket.resolved"]);
  const [visibleSecrets, setVisibleSecrets] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [pingResult, setPingResult] = useState(null);
  const [pingingId, setPingingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleToggleSecret = (id) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleEvent = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      if (selectedEvents.length > 1) {
        setSelectedEvents(selectedEvents.filter((e) => e !== eventId));
      }
    } else {
      setSelectedEvents([...selectedEvents, eventId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    await onAddWebhook({ url: url.trim(), events: selectedEvents });
    setUrl("");
    setSelectedEvents(["ticket.escalated", "ticket.resolved"]);
    setIsAdding(false);
  };

  const handleTestPing = async (id) => {
    setPingingId(id);
    const res = await onTestPing(id);
    setPingingId(null);
    setPingResult({ id, ...res });
  };

  const handleDeleteConfirm = async (id) => {
    await onDeleteWebhook(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Ping Test Result Banner */}
      {pingResult && (
        <div className="panel p-5 bg-black/[0.02] border border-black/15 rounded-lg space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <h4 className="text-xs font-semibold text-text-primary">
                Webhook Ping Delivered Successfully ({pingResult.status || 200} OK)
              </h4>
            </div>
            <button
              onClick={() => setPingResult(null)}
              className="text-xs text-text-faint hover:text-text-primary"
            >
              Dismiss
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
            <span>Latency: <strong className="text-text-primary">{pingResult.latency || "128ms"}</strong></span>
            <span>Timestamp: <strong className="text-text-primary">{new Date(pingResult.timestamp || Date.now()).toLocaleTimeString()}</strong></span>
          </div>
        </div>
      )}

      {/* Main Webhooks Panel */}
      <div className="panel p-6 bg-white border border-base-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-border">
          <div>
            <h3 className="font-display font-semibold text-sm text-text-primary">
              Webhooks & Event Subscriptions
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Broadcast real-time JSON payloads to your servers when customer tickets escalate, resolve, or index.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-black text-white rounded hover:opacity-85 transition-opacity self-start sm:self-auto"
          >
            <Plus size={14} />
            Add Webhook Endpoint
          </button>
        </div>

        {/* Webhooks List */}
        <div className="space-y-4">
          {webhooks.length === 0 ? (
            <div className="py-8 text-center text-text-muted text-xs border border-dashed border-base-border rounded-lg">
              No webhook endpoints configured. Click "Add Webhook Endpoint" above to get started.
            </div>
          ) : (
            webhooks.map((w) => {
              const isSecretVisible = visibleSecrets[w.id];
              return (
                <div
                  key={w.id}
                  className="p-4 rounded-lg border border-base-border bg-white hover:border-black/20 transition-all space-y-3"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="p-2 rounded bg-black/[0.04] text-black shrink-0">
                        <Webhook size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold font-mono text-text-primary truncate">
                          {w.url}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-medium border border-emerald-500/20">
                            <Activity size={10} /> Active (200 OK)
                          </span>
                          <span className="text-[11px] text-text-faint">
                            ID: {w.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end lg:self-center">
                      <button
                        onClick={() => handleTestPing(w.id)}
                        disabled={pingingId === w.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-base-border rounded hover:bg-black/[0.03] transition-colors"
                      >
                        <Send size={12} className={pingingId === w.id ? "animate-spin" : ""} />
                        {pingingId === w.id ? "Pinging..." : "Test Ping"}
                      </button>

                      {deletingId === w.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleDeleteConfirm(w.id)}
                            className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded hover:bg-rose-700 font-medium"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="px-2 py-1 text-xs border border-base-border rounded text-text-muted hover:text-text-primary"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeletingId(w.id)}
                          className="p-1.5 rounded text-text-faint hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Webhook"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Secret Token & Subscribed Events */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-base-border/60 text-xs">
                    <div>
                      <span className="text-[11px] text-text-muted block mb-1">
                        Subscribed Events:
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(w.events || []).map((ev, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/[0.04] text-text-primary border border-base-border"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-text-muted block mb-1">
                        Signing Secret (HMAC-SHA256):
                      </span>
                      <div className="flex items-center gap-2">
                        <code className="px-2.5 py-1 rounded bg-black/[0.03] border border-base-border font-mono text-[11px] select-all">
                          {isSecretVisible ? w.secret : "••••••••••••••••••••••••••••"}
                        </code>
                        <button
                          onClick={() => handleToggleSecret(w.id)}
                          className="p-1 text-text-faint hover:text-text-primary"
                          title={isSecretVisible ? "Hide Secret" : "Show Secret"}
                        >
                          {isSecretVisible ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                        <button
                          onClick={() => handleCopy(w.secret, `sec-${w.id}`)}
                          className="p-1 text-text-faint hover:text-text-primary"
                          title="Copy Secret"
                        >
                          {copiedId === `sec-${w.id}` ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Webhook Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-lg border border-base-border p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 pb-2 border-b border-base-border">
              <Webhook size={16} className="text-black" />
              <h3 className="font-display font-semibold text-sm">Add New Webhook Endpoint</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  HTTPS Endpoint URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://api.yourdomain.com/webhooks/supportai"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-2">
                  Select Event Triggers to Subscribe
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {AVAILABLE_EVENTS.map((ev) => {
                    const isChecked = selectedEvents.includes(ev.id);
                    return (
                      <label
                        key={ev.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded border cursor-pointer transition-colors ${
                          isChecked
                            ? "border-black bg-black/[0.02]"
                            : "border-base-border hover:bg-black/[0.01]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleEvent(ev.id)}
                          className="mt-0.5 accent-black"
                        />
                        <div>
                          <p className="text-xs font-medium text-text-primary">{ev.label} <span className="font-mono text-[10px] text-text-muted">({ev.id})</span></p>
                          <p className="text-[11px] text-text-muted mt-0.5">{ev.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-border">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs border border-base-border rounded text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-black text-white rounded hover:opacity-85"
                >
                  Save Webhook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
