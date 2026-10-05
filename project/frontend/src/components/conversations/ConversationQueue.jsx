import { useState } from "react";
import {
  Search,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  UserCheck,
  ShoppingBag,
  Globe,
  Mail,
  Zap,
} from "lucide-react";
import { SlackLogo, WhatsAppLogo, ShopifyLogo } from "../settings/IntegrationLogos";

export default function ConversationQueue({
  conversations = [],
  selectedId,
  onSelectConversation,
  stats,
  statusFilter,
  setStatusFilter,
  channelFilter,
  setChannelFilter,
  searchQuery,
  setSearchQuery,
}) {
  const getChannelBadge = (channel) => {
    switch (channel?.toLowerCase()) {
      case "slack":
        return <SlackLogo className="w-3.5 h-3.5" />;
      case "whatsapp":
        return <WhatsAppLogo className="w-3.5 h-3.5" />;
      case "shopify":
        return <ShopifyLogo className="w-3.5 h-3.5" />;
      case "email":
        return <Mail size={13} className="text-blue-500" />;
      default:
        return <Globe size={13} className="text-emerald-600" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 font-semibold border border-rose-500/20">High</span>;
      case "medium":
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 font-medium border border-amber-500/20">Med</span>;
      default:
        return <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 font-medium border border-emerald-500/20">Low</span>;
    }
  };

  const tabs = [
    { id: "all", label: "All", count: stats?.total || conversations.length },
    { id: "ai-active", label: "AI Active", count: stats?.aiActive },
    { id: "escalated", label: "Escalated", count: stats?.escalated },
    { id: "resolved", label: "Resolved", count: stats?.resolved },
    { id: "vip", label: "VIP Tiers" },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-base-border w-full lg:w-[360px] xl:w-[380px] shrink-0">
      {/* Top Search & Filter Bar */}
      <div className="p-3.5 border-b border-base-border space-y-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
          <input
            type="text"
            placeholder="Search tickets, customers, ARN…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-base-border rounded bg-black/[0.02] focus:outline-none focus:border-black"
          />
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-black text-white"
                    : "bg-black/[0.03] text-text-muted hover:text-text-primary hover:bg-black/[0.06]"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-black/10 text-text-muted"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversations Scroll Queue */}
      <div className="flex-1 overflow-y-auto divide-y divide-base-border/70">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-xs">
            No conversations matching your filters.
          </div>
        ) : (
          conversations.map((conv) => {
            const isSelected = selectedId === conv.id;
            const lastMsg = conv.messages[conv.messages.length - 1];
            const isUrgentSLA = conv.slaDueInMinutes > 0 && conv.slaDueInMinutes <= 15;

            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left p-3.5 transition-all flex flex-col gap-2 relative ${
                  isSelected
                    ? "bg-black/[0.03] border-l-3 border-l-black"
                    : "hover:bg-black/[0.015]"
                }`}
              >
                {/* Header row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      {conv.customer.avatar || conv.customer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="font-semibold text-xs text-text-primary truncate">
                      {conv.customer.name}
                    </span>
                    <div className="shrink-0" title={`Channel: ${conv.channel}`}>
                      {getChannelBadge(conv.channel)}
                    </div>
                  </div>

                  <span className="text-[10px] text-text-faint font-mono shrink-0">
                    {conv.lastMessageTime}
                  </span>
                </div>

                {/* Subject & Preview */}
                <p className="text-xs font-medium text-text-primary line-clamp-1">
                  {conv.subject}
                </p>
                <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">
                  {lastMsg?.text || "No messages yet"}
                </p>

                {/* Footer Badges */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getPriorityBadge(conv.priority)}
                    
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium ${
                        conv.handler === "AI Assistant"
                          ? "bg-black/[0.06] text-text-primary"
                          : "bg-purple-500/10 text-purple-700 border border-purple-500/20"
                      }`}
                    >
                      {conv.handler}
                    </span>

                    {conv.sentiment === "Frustrated" && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 font-medium border border-rose-500/20 flex items-center gap-1">
                        <AlertTriangle size={9} /> Frustrated
                      </span>
                    )}
                  </div>

                  {conv.slaDueInMinutes > 0 && conv.status !== "Resolved" && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded flex items-center gap-1 ${
                        isUrgentSLA
                          ? "bg-rose-500 text-white font-bold animate-pulse"
                          : "bg-black/[0.04] text-text-muted"
                      }`}
                    >
                      <Clock size={10} />
                      {conv.slaDueInMinutes}m SLA
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
