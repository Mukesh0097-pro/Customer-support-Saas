import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { fetchConversations } from "../services/conversationService";

const statusStyles = {
  Resolved: "text-signal-up bg-emerald-500/10 border-emerald-500/20",
  Open: "text-signal-down bg-rose-500/10 border-rose-500/20",
  Escalated: "text-rose-600 bg-rose-500/10 border-rose-500/20",
  "In Progress": "text-signal-warn bg-amber-500/10 border-amber-500/20",
};

const priorityStyles = {
  Low: "text-text-faint",
  Medium: "text-text-muted",
  High: "text-text-primary font-semibold",
};

export default function RecentConversations() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    try {
      setLoading(true);
      const data = await fetchConversations();
      if (data?.conversations) {
        setConversations(data.conversations.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to load recent conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel p-5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-semibold text-sm">Recent Conversations</h3>
            <p className="text-xs text-text-muted mt-0.5">Latest support requests</p>
          </div>
          <button
            onClick={() => navigate("/conversations")}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
          >
            <span>View all</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-text-faint">
            Loading conversations…
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-12 text-center text-xs text-text-faint">
            No conversations found.
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => {
              const statusClass = statusStyles[conv.status] || "text-text-muted bg-black/[0.04]";
              const priorityClass = priorityStyles[conv.priority] || "text-text-muted";
              return (
                <div
                  key={conv.id}
                  onClick={() => navigate("/conversations")}
                  className="p-3 rounded-lg border border-base-border/70 hover:border-black/20 hover:bg-black/[0.015] transition-all cursor-pointer flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-6 w-6 rounded-full bg-black text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
                        {conv.customer?.avatar || conv.customer?.name?.[0] || "C"}
                      </div>
                      <span className="text-xs font-semibold text-text-primary truncate">
                        {conv.customer?.name}
                      </span>
                      <span className="text-[10px] text-text-faint font-mono">
                        ({conv.channel})
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusClass}`}
                    >
                      {conv.status}
                    </span>
                  </div>

                  <p className="text-xs text-text-muted line-clamp-1">
                    {conv.subject}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-text-faint pt-1 border-t border-base-border/40">
                    <span>Handled by: <strong className="font-medium text-text-primary">{conv.handler}</strong></span>
                    <span className="tabular-nums">{conv.lastMessageTime || conv.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-base-border">
        <button
          onClick={() => navigate("/conversations")}
          className="w-full py-2 text-xs font-medium text-center rounded border border-base-border bg-black/[0.02] hover:bg-black text-text-primary hover:text-white transition-all"
        >
          Open Live Inbox
        </button>
      </div>
    </div>
  );
}
