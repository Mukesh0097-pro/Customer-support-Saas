import { useState, useEffect } from "react";
import {
  Bell,
  Mail,
  Volume2,
  AlertTriangle,
  Check,
  Save,
  RotateCcw,
  MessageSquare,
  ShieldAlert,
} from "lucide-react";

export default function NotificationSettings({ notifications, onSave }) {
  const [form, setForm] = useState(notifications || {});
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (notifications) setForm(notifications);
  }, [notifications]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(form);
    setIsSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setForm(notifications || {});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alert Rules & Triggers Card */}
      <div className="panel p-6 bg-white border border-base-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-border">
          <div>
            <h3 className="font-display font-semibold text-sm text-text-primary">
              Notification Rules & Escalation Alerts
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Control when support teams are notified of ticket escalations, SLA breaches, and daily digests.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-base-border text-text-muted rounded hover:text-text-primary hover:bg-black/[0.02] transition-colors"
            >
              <RotateCcw size={13} />
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-black text-white rounded hover:opacity-85 disabled:opacity-50 transition-all shadow-sm"
            >
              {saved ? (
                <>
                  <Check size={13} className="text-emerald-400" />
                  Preferences Saved
                </>
              ) : (
                <>
                  <Save size={13} />
                  Save Notifications
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inbound Escalation Email Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Escalation Alert Email Destination
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <input
                type="email"
                value={form.escalationEmail || ""}
                onChange={(e) => setForm({ ...form, escalationEmail: e.target.value })}
                placeholder="ops-lead@company.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Alert Trigger Threshold (Confidence &lt; %)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="50"
                max="90"
                step="5"
                value={form.notifyOnConfidenceBelow ?? 75}
                onChange={(e) =>
                  setForm({ ...form, notifyOnConfidenceBelow: parseInt(e.target.value) })
                }
                className="flex-1 accent-black cursor-pointer"
              />
              <span className="font-mono font-bold text-xs bg-black/[0.04] px-2.5 py-1 rounded border border-base-border">
                {form.notifyOnConfidenceBelow ?? 75}%
              </span>
            </div>
          </div>
        </div>

        {/* Toggles Grid */}
        <div className="space-y-3 pt-2">
          {/* Toggle 1: SLA Breach Alert */}
          <div className="p-4 rounded-lg border border-base-border bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-rose-500/10 text-rose-600 border border-rose-500/20">
                <ShieldAlert size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-text-primary">
                  SLA Breach & Escalation Warning Alerts
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Send immediate notifications when a customer ticket is within 15 minutes of an SLA breach.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.slaBreachAlerts ?? true}
                onChange={(e) => setForm({ ...form, slaBreachAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>

          {/* Toggle 2: Urgent Human Escalations */}
          <div className="p-4 rounded-lg border border-base-border bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
                <AlertTriangle size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-text-primary">
                  Urgent Customer Frustration Alerts
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Trigger high-priority alerts whenever sentiment analysis flags extreme frustration.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.urgentEscalations ?? true}
                onChange={(e) => setForm({ ...form, urgentEscalations: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>

          {/* Toggle 3: Sound Alerts */}
          <div className="p-4 rounded-lg border border-base-border bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-black/[0.04] text-text-primary border border-base-border">
                <Volume2 size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-text-primary">
                  In-App Audio Chimes on Incoming Escalations
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Play an audio chime when an inbound ticket requires human agent intervention.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.soundAlerts ?? true}
                onChange={(e) => setForm({ ...form, soundAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>

          {/* Toggle 4: Daily Digest */}
          <div className="p-4 rounded-lg border border-base-border bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-black/[0.04] text-text-primary border border-base-border">
                <Bell size={16} />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-text-primary">
                  Daily AI Performance & Resolution Digest
                </h4>
                <p className="text-[11px] text-text-muted mt-0.5">
                  Receive a summary email at 08:00 AM outlining resolution rate and knowledge base coverage.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.dailyDigest ?? true}
                onChange={(e) => setForm({ ...form, dailyDigest: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>
        </div>
      </div>
    </form>
  );
}
