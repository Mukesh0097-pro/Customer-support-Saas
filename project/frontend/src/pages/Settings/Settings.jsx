import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Sparkles,
  Key,
  Webhook,
  Users,
  Layers,
  CreditCard,
  Bell,
  RefreshCw,
  CheckCircle2,
  Code,
} from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import GeneralSettings from "../../components/settings/GeneralSettings";
import AIAgentConfig from "../../components/settings/AIAgentConfig";
import WidgetCustomizer from "../../components/settings/WidgetCustomizer";
import ApiKeysManager from "../../components/settings/ApiKeysManager";
import WebhooksManager from "../../components/settings/WebhooksManager";
import TeamManager from "../../components/settings/TeamManager";
import IntegrationsDirectory from "../../components/settings/IntegrationsDirectory";
import BillingManager from "../../components/settings/BillingManager";
import NotificationSettings from "../../components/settings/NotificationSettings";
import {
  fetchSettings,
  saveWorkspaceSettings,
  saveAgentConfig,
  saveNotificationSettings,
  createApiKey,
  revokeApiKey,
  addWebhook,
  deleteWebhook,
  testWebhookPing,
  inviteTeamMember,
  updateTeamMember,
  removeTeamMember,
  toggleIntegration,
  updateIntegration,
  upgradeBillingPlan,
} from "../../services/settingsService";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  // Settings State Store
  const [workspace, setWorkspace] = useState(null);
  const [agent, setAgent] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [billing, setBilling] = useState(null);
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadSettings = async () => {
    setLoading(true);
    const data = await fetchSettings();
    setWorkspace(data.workspace || {});
    setAgent(data.agent || {});
    setApiKeys(data.apiKeys || []);
    setWebhooks(data.webhooks || []);
    setTeamMembers(data.teamMembers || []);
    setIntegrations(data.integrations || []);
    setBilling(data.billing || {});
    setNotifications(data.notifications || {});
    setLoading(false);
  };

  // Handlers
  const handleSaveWorkspace = async (data) => {
    const res = await saveWorkspaceSettings(data);
    if (res.workspace) setWorkspace(res.workspace);
    showToast("Workspace profile saved successfully");
  };

  const handleSaveAgent = async (data) => {
    const res = await saveAgentConfig(data);
    if (res.agent) setAgent(res.agent);
    showToast("AI Agent configuration updated");
  };

  const handleSaveNotifications = async (data) => {
    const res = await saveNotificationSettings(data);
    if (res.notifications) setNotifications(res.notifications);
    showToast("Notification rules saved");
  };

  const handleCreateApiKey = async (name, scope) => {
    const res = await createApiKey(name, scope);
    if (res.apiKey) {
      setApiKeys((prev) => [res.apiKey, ...prev]);
      showToast("API Key generated");
    }
    return res;
  };

  const handleRevokeApiKey = async (id) => {
    await revokeApiKey(id);
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    showToast("API Key revoked");
  };

  const handleAddWebhook = async (webhookData) => {
    const res = await addWebhook(webhookData);
    if (res.webhook) {
      setWebhooks((prev) => [res.webhook, ...prev]);
      showToast("Webhook endpoint added");
    }
  };

  const handleDeleteWebhook = async (id) => {
    await deleteWebhook(id);
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    showToast("Webhook removed");
  };

  const handleTestPing = async (id) => {
    return await testWebhookPing(id);
  };

  const handleInviteMember = async (memberData) => {
    const res = await inviteTeamMember(memberData);
    if (res.member) {
      setTeamMembers((prev) => [...prev, res.member]);
      showToast(`Invitation sent to ${memberData.email}`);
    }
  };

  const handleUpdateRole = async (id, data) => {
    const res = await updateTeamMember(id, data);
    if (res.member) {
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...res.member } : m))
      );
      showToast("Team role updated");
    }
  };

  const handleRemoveMember = async (id) => {
    await removeTeamMember(id);
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    showToast("Team member removed");
  };

  const handleToggleIntegration = async (id) => {
    const res = await toggleIntegration(id);
    if (res.integrations) {
      setIntegrations(res.integrations);
    } else {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, connected: !item.connected } : item
        )
      );
    }
    showToast("Integration updated");
  };

  const handleUpdateIntegration = async (id, data) => {
    const res = await updateIntegration(id, data);
    if (res.integrations) {
      setIntegrations(res.integrations);
    } else {
      setIntegrations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...data } : item))
      );
    }
    showToast("Integration configuration saved");
  };

  const handleUpgradePlan = async (planData) => {
    const res = await upgradeBillingPlan(planData);
    if (res.billing) {
      setBilling(res.billing);
      showToast(`Plan updated to ${planData.planName}`);
    }
  };

  const tabs = [
    { id: "general", label: "General & Brand", icon: Building2 },
    { id: "widget", label: "Embed Widget", icon: Code },
    { id: "agent", label: "AI Reasoning & Safety", icon: Sparkles },
    { id: "team", label: "Team & Roles", icon: Users, count: teamMembers.length },
    {
      id: "integrations",
      label: "Integrations",
      icon: Layers,
      count: integrations.filter((i) => i.connected).length,
    },
    { id: "api-keys", label: "API Keys", icon: Key, count: apiKeys.length },
    { id: "webhooks", label: "Webhooks", icon: Webhook, count: webhooks.length },
    { id: "notifications", label: "Alerts & Policy", icon: Bell },
  ];

  return (
    <DashboardLayout>
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border border-white/20 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={15} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon size={20} className="text-black" />
            <h1 className="font-display text-xl font-semibold tracking-tight">
              Settings & Workspace Governance
            </h1>
          </div>
          <p className="text-sm text-text-muted mt-0.5">
            Manage your workspace parameters, AI model behaviors, developer integrations, security tokens, and subscription tiers.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={loadSettings}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-base-border rounded bg-white hover:bg-black/[0.02] text-text-muted hover:text-text-primary transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Sync Status
          </button>
        </div>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-base-border mb-6 overflow-x-auto pb-0.5 scrollbar-none">
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

      {/* Main Tab Views */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw size={24} className="animate-spin text-black" />
          <p className="text-xs text-text-muted">Loading workspace configuration…</p>
        </div>
      ) : (
        <div>
          {activeTab === "general" && (
            <GeneralSettings workspace={workspace} onSave={handleSaveWorkspace} />
          )}

          {activeTab === "widget" && (
            <WidgetCustomizer onShowToast={showToast} />
          )}

          {activeTab === "agent" && (
            <AIAgentConfig agent={agent} onSave={handleSaveAgent} />
          )}

          {activeTab === "api-keys" && (
            <ApiKeysManager
              apiKeys={apiKeys}
              onCreateKey={handleCreateApiKey}
              onRevokeKey={handleRevokeApiKey}
            />
          )}

          {activeTab === "webhooks" && (
            <WebhooksManager
              webhooks={webhooks}
              onAddWebhook={handleAddWebhook}
              onDeleteWebhook={handleDeleteWebhook}
              onTestPing={handleTestPing}
            />
          )}

          {activeTab === "team" && (
            <TeamManager
              teamMembers={teamMembers}
              onInviteMember={handleInviteMember}
              onUpdateRole={handleUpdateRole}
              onRemoveMember={handleRemoveMember}
            />
          )}

          {activeTab === "integrations" && (
            <IntegrationsDirectory
              integrations={integrations}
              onToggleIntegration={handleToggleIntegration}
              onUpdateIntegration={handleUpdateIntegration}
            />
          )}

          {activeTab === "billing" && (
            <BillingManager
              billing={billing}
              onUpgradePlan={handleUpgradePlan}
            />
          )}

          {activeTab === "notifications" && (
            <NotificationSettings
              notifications={notifications}
              onSave={handleSaveNotifications}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
