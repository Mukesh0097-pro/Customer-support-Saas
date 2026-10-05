import { useState } from "react";
import {
  CreditCard,
  Zap,
  Check,
  Download,
  Clock,
  Sparkles,
  Database,
  Users,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";

const PLAN_TIERS = [
  {
    name: "Starter",
    price: "$49 / month",
    conversationsLimit: 2000,
    tokensLimit: 1000000,
    features: ["2,000 AI Conversations / mo", "1M Vector Tokens", "2 Team Seats", "Standard SLA (24h)"],
  },
  {
    name: "Growth",
    price: "$199 / month",
    conversationsLimit: 5000,
    tokensLimit: 2500000,
    features: ["5,000 AI Conversations / mo", "2.5M Vector Tokens", "5 Team Seats", "Priority SLA (2h)", "Shopify & Zendesk Sync"],
  },
  {
    name: "Enterprise Scale",
    price: "$499 / month",
    conversationsLimit: 10000,
    tokensLimit: 5000000,
    popular: true,
    features: ["10,000 AI Conversations / mo", "5M Vector Tokens", "15 Team Seats", "Strict Anti-Hallucination Guard", "Instant Human Handover", "Dedicated Support Manager"],
  },
  {
    name: "Custom Dedicated",
    price: "$1,299 / month",
    conversationsLimit: 50000,
    tokensLimit: 25000000,
    features: ["50,000+ AI Conversations / mo", "25M+ Vector Tokens", "Unlimited Seats", "Custom Fine-Tuned Weights", "Private VPC Hosting"],
  },
];

const INVOICES = [
  { id: "INV-2026-081", date: "Aug 1, 2026", period: "Aug 1 - Aug 31, 2026", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-071", date: "Jul 1, 2026", period: "Jul 1 - Jul 31, 2026", amount: "$499.00", status: "Paid" },
  { id: "INV-2026-061", date: "Jun 1, 2026", period: "Jun 1 - Jun 30, 2026", amount: "$499.00", status: "Paid" },
];

export default function BillingManager({ billing = {}, onUpgradePlan }) {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const handleSelectPlan = async (tier) => {
    if (tier.name === billing.currentPlan) return;
    if (onUpgradePlan) {
      await onUpgradePlan({
        planName: tier.name,
        price: tier.price,
        conversationsLimit: tier.conversationsLimit,
        tokensLimit: tier.tokensLimit,
      });
    }
    setIsUpgrading(false);
  };

  const handleDownloadInvoice = (id) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1500);
  };

  const convPercent = Math.min(
    100,
    Math.round(((billing.conversationsUsed || 4218) / (billing.conversationsLimit || 10000)) * 100)
  );

  const tokenPercent = Math.min(
    100,
    Math.round(((billing.tokensUsed || 1420000) / (billing.tokensLimit || 5000000)) * 100)
  );

  const storagePercent = Math.min(
    100,
    Math.round(((billing.storageUsedMB || 64.2) / (billing.storageLimitMB || 500)) * 100)
  );

  const seatsPercent = Math.min(
    100,
    Math.round(((billing.seatsUsed || 4) / (billing.seatsLimit || 15)) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Current Plan Hero Banner */}
      <div className="panel p-6 bg-black text-white border border-black shadow-md rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-mono uppercase tracking-wider font-semibold">
              Active Subscription
            </span>
            <span className="text-xs text-white/70">Auto-renews on {billing.renewalDate || "Sept 1, 2026"}</span>
          </div>
          <h3 className="font-display font-bold text-xl tracking-tight">
            {billing.currentPlan || "Enterprise Scale"}
          </h3>
          <p className="text-sm text-white/80 font-mono">
            {billing.price || "$499 / month"} · High-Performance RAG & AI Resolution Engine
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUpgrading(!isUpgrading)}
            className="px-4 py-2 text-xs font-semibold bg-white text-black rounded hover:bg-white/90 transition-all shadow-sm flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            {isUpgrading ? "Close Plan Comparison" : "Change Subscription Plan"}
          </button>
        </div>
      </div>

      {/* Usage Quotas Progress Grid */}
      <div className="panel p-6 bg-white border border-base-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-base-border">
          <h4 className="font-display font-semibold text-xs text-text-primary">
            Current Billing Cycle Usage & Quotas
          </h4>
          <span className="text-[11px] text-text-faint font-mono">Resets in 18 days</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-1">
          {/* Metric 1: Conversations */}
          <div className="space-y-2 p-3.5 rounded bg-black/[0.015] border border-base-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <MessageSquare size={13} className="text-text-faint" />
                Conversations
              </span>
              <span className="font-mono font-bold text-text-primary text-[11px]">
                {billing.conversationsUsed?.toLocaleString() || "4,218"} / {billing.conversationsLimit?.toLocaleString() || "10,000"}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${convPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-text-faint block text-right font-mono">
              {convPercent}% utilized
            </span>
          </div>

          {/* Metric 2: Vector Tokens */}
          <div className="space-y-2 p-3.5 rounded bg-black/[0.015] border border-base-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <Zap size={13} className="text-text-faint" />
                Vector Tokens
              </span>
              <span className="font-mono font-bold text-text-primary text-[11px]">
                {((billing.tokensUsed || 1420000) / 1000000).toFixed(2)}M / {((billing.tokensLimit || 5000000) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${tokenPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-text-faint block text-right font-mono">
              {tokenPercent}% utilized
            </span>
          </div>

          {/* Metric 3: Vector Storage */}
          <div className="space-y-2 p-3.5 rounded bg-black/[0.015] border border-base-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <Database size={13} className="text-text-faint" />
                Vector Storage
              </span>
              <span className="font-mono font-bold text-text-primary text-[11px]">
                {billing.storageUsedMB || 64.2}MB / {billing.storageLimitMB || 500}MB
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-text-faint block text-right font-mono">
              {storagePercent}% utilized
            </span>
          </div>

          {/* Metric 4: Team Seats */}
          <div className="space-y-2 p-3.5 rounded bg-black/[0.015] border border-base-border">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted flex items-center gap-1.5 font-medium">
                <Users size={13} className="text-text-faint" />
                Team Seats
              </span>
              <span className="font-mono font-bold text-text-primary text-[11px]">
                {billing.seatsUsed || 4} / {billing.seatsLimit || 15} Seats
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-black/10 overflow-hidden">
              <div
                className="h-full bg-black rounded-full transition-all duration-500"
                style={{ width: `${seatsPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-text-faint block text-right font-mono">
              {seatsPercent}% filled
            </span>
          </div>
        </div>
      </div>

      {/* Plan Tiers Comparison (Expandable) */}
      {isUpgrading && (
        <div className="panel p-6 bg-white border border-base-border space-y-6 animate-in fade-in zoom-in-98 duration-200">
          <div className="text-center max-w-lg mx-auto space-y-1">
            <h3 className="font-display font-bold text-base text-text-primary">
              Upgrade or Adjust Your SupportAI Plan
            </h3>
            <p className="text-xs text-text-muted">
              Choose the right resolution capacity for your customer volume. Prorated upgrades take effect instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLAN_TIERS.map((tier, idx) => {
              const isCurrent = tier.name === billing.currentPlan;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-lg border flex flex-col justify-between space-y-4 transition-all relative ${
                    isCurrent
                      ? "border-black ring-1 ring-black bg-black/[0.015] shadow-xs"
                      : "border-base-border hover:border-black/30"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-4 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black text-white uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}

                  <div>
                    <h4 className="font-display font-bold text-sm text-text-primary">{tier.name}</h4>
                    <p className="text-base font-bold font-mono text-text-primary mt-1">{tier.price}</p>

                    <div className="space-y-2 mt-4 text-xs">
                      {tier.features.map((feat, fidx) => (
                        <div key={fidx} className="flex items-start gap-2 text-text-muted">
                          <Check size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(tier)}
                    disabled={isCurrent}
                    className={`w-full py-2 text-xs font-semibold rounded transition-all ${
                      isCurrent
                        ? "bg-black/[0.06] text-text-faint cursor-default"
                        : "bg-black text-white hover:opacity-85"
                    }`}
                  >
                    {isCurrent ? "Current Active Plan" : `Switch to ${tier.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Method & Invoices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Method Card */}
        <div className="panel p-6 bg-white border border-base-border space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2 pb-3 border-b border-base-border">
            <CreditCard size={16} className="text-black" />
            <h4 className="font-display font-semibold text-xs text-text-primary">
              Payment Method
            </h4>
          </div>

          <div className="p-4 rounded-lg bg-black/[0.02] border border-base-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-text-primary">Visa ending in 4242</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 font-medium border border-emerald-500/20">
                Default
              </span>
            </div>
            <p className="text-[11px] text-text-muted">Expires 08/2028 · Mukesh Kumar</p>
          </div>

          <button
            type="button"
            className="w-full py-2 text-xs font-medium border border-base-border rounded hover:bg-black/[0.02] transition-colors"
          >
            Update Payment Card
          </button>
        </div>

        {/* Invoice Receipts Table */}
        <div className="panel p-6 bg-white border border-base-border space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-base-border">
            <h4 className="font-display font-semibold text-xs text-text-primary">
              Billing Invoices History
            </h4>
            <span className="text-[11px] text-text-muted">All prices in USD</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-base-border text-text-muted font-medium">
                  <th className="pb-2 pr-4">Invoice #</th>
                  <th className="pb-2 px-4">Billing Period</th>
                  <th className="pb-2 px-4">Amount</th>
                  <th className="pb-2 px-4">Status</th>
                  <th className="pb-2 pl-4 text-right">PDF Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-border/70">
                {INVOICES.map((inv) => (
                  <tr key={inv.id} className="hover:bg-black/[0.015]">
                    <td className="py-3 pr-4 font-mono font-medium text-text-primary text-[11px]">
                      {inv.id}
                    </td>
                    <td className="py-3 px-4 text-text-muted text-[11px]">
                      {inv.period}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-text-primary text-[11px]">
                      {inv.amount}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-medium border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(inv.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] text-text-muted hover:text-text-primary border border-base-border rounded hover:bg-black/[0.02] transition-colors"
                      >
                        <Download size={11} className={downloadingId === inv.id ? "animate-bounce" : ""} />
                        {downloadingId === inv.id ? "Downloading..." : "Download"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
