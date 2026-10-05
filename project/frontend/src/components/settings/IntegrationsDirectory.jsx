import { useState } from "react";
import {
  Plug,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings2,
  Search,
} from "lucide-react";
import {
  SlackLogo,
  DiscordLogo,
  ZendeskLogo,
  ShopifyLogo,
  WhatsAppLogo,
  StripeLogo,
  JiraLogo,
  MicrosoftTeamsLogo,
  IntercomLogo,
  SalesforceLogo,
  HubspotLogo,
} from "./IntegrationLogos";

export default function IntegrationsDirectory({
  integrations = [],
  onToggleIntegration,
  onUpdateIntegration,
}) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [configModal, setConfigModal] = useState(null);
  const [configChannel, setConfigChannel] = useState("");

  const categories = ["All", "Communication", "Ticketing", "E-Commerce", "Payments", "Engineering", "CRM"];

  const filteredIntegrations = integrations.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenConfig = (item) => {
    setConfigModal(item);
    setConfigChannel(item.channel || "");
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    if (!configModal) return;
    if (onUpdateIntegration) {
      await onUpdateIntegration(configModal.id, { channel: configChannel });
    }
    setConfigModal(null);
  };

  const renderBrandLogo = (id) => {
    const lower = id.toLowerCase();
    if (lower.includes("slack")) return <SlackLogo className="w-6 h-6" />;
    if (lower.includes("discord")) return <DiscordLogo className="w-6 h-6" />;
    if (lower.includes("zendesk")) return <ZendeskLogo className="w-6 h-6" />;
    if (lower.includes("shopify")) return <ShopifyLogo className="w-6 h-6" />;
    if (lower.includes("whatsapp")) return <WhatsAppLogo className="w-6 h-6" />;
    if (lower.includes("stripe")) return <StripeLogo className="w-6 h-6" />;
    if (lower.includes("jira")) return <JiraLogo className="w-6 h-6" />;
    if (lower.includes("team")) return <MicrosoftTeamsLogo className="w-6 h-6" />;
    if (lower.includes("intercom")) return <IntercomLogo className="w-6 h-6" />;
    if (lower.includes("salesforce")) return <SalesforceLogo className="w-6 h-6" />;
    if (lower.includes("hubspot")) return <HubspotLogo className="w-6 h-6" />;
    return <Plug size={20} className="text-text-primary" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="panel p-6 bg-white border border-base-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-border">
          <div>
            <h3 className="font-display font-semibold text-sm text-text-primary">
              Connected Apps & Ecosystem Directory
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Link communication channels, ticketing systems, CRM records, and e-commerce stores to empower your AI.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-muted">
              {integrations.filter((i) => i.connected).length} of {integrations.length} Active
            </span>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-black text-white"
                    : "bg-black/[0.03] text-text-muted hover:text-text-primary hover:bg-black/[0.06]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              type="text"
              placeholder="Search integrations…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-base-border rounded focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((item) => {
          return (
            <div
              key={item.id}
              className={`panel p-5 bg-white border transition-all flex flex-col justify-between space-y-4 ${
                item.connected ? "border-black/30 shadow-xs" : "border-base-border hover:border-black/20"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg flex items-center justify-center p-1.5 bg-black/[0.03] border border-base-border/80 shadow-2xs shrink-0">
                      {renderBrandLogo(item.id)}
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-xs text-text-primary">
                        {item.name}
                      </h4>
                      <span className="text-[10px] text-text-faint font-mono">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      item.connected
                        ? "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20"
                        : "bg-black/[0.04] text-text-faint"
                    }`}
                  >
                    {item.connected ? (
                      <>
                        <CheckCircle2 size={10} /> Connected
                      </>
                    ) : (
                      "Not Connected"
                    )}
                  </span>
                </div>

                <p className="text-xs text-text-muted mt-3 leading-relaxed">
                  {item.description}
                </p>

                {item.connected && item.channel && (
                  <div className="mt-3 p-2 rounded bg-black/[0.02] border border-base-border/70 text-[11px] font-mono text-text-primary truncate">
                    Target: {item.channel}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-base-border/70">
                {item.connected ? (
                  <button
                    onClick={() => handleOpenConfig(item)}
                    className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary font-medium"
                  >
                    <Settings2 size={13} />
                    Configure
                  </button>
                ) : (
                  <span className="text-[11px] text-text-faint">Ready to pair</span>
                )}

                <button
                  onClick={() => onToggleIntegration(item.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                    item.connected
                      ? "border border-base-border text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                      : "bg-black text-white hover:opacity-85"
                  }`}
                >
                  {item.connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {configModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-lg border border-base-border p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 pb-2 border-b border-base-border">
              <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                {renderBrandLogo(configModal.id)}
              </div>
              <h3 className="font-display font-semibold text-sm">
                Configure {configModal.name} Integration
              </h3>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Destination Channel / Identifier
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. #support-escalations, acme-store.myshopify.com"
                  value={configChannel}
                  onChange={(e) => setConfigChannel(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black font-mono text-[11px]"
                />
              </div>

              <div className="p-3 rounded bg-black/[0.02] border border-base-border text-[11px] text-text-muted">
                Updates are propagated across active customer chat sessions in real-time.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-border">
                <button
                  type="button"
                  onClick={() => setConfigModal(null)}
                  className="px-3 py-1.5 text-xs border border-base-border rounded text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-black text-white rounded hover:opacity-85"
                >
                  Save Configuration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
