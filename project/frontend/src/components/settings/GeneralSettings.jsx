import { useState, useEffect } from "react";
import {
  Building2,
  Globe,
  Mail,
  Clock,
  Check,
  Save,
  Languages,
  Shield,
  UploadCloud,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function GeneralSettings({ workspace, onSave }) {
  const [form, setForm] = useState(workspace || {});
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (workspace) setForm(workspace);
  }, [workspace]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(form);
    setIsSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setForm(workspace || {});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Brand & Organization Card */}
      <div className="panel p-6 bg-white border border-base-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-border">
          <div>
            <h3 className="font-display font-semibold text-sm text-text-primary">
              Workspace Profile & Localization
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Configure company identity, support portal branding, timezone, and operating hours.
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
                  Saved Successfully
                </>
              ) : (
                <>
                  <Save size={13} />
                  Save Workspace
                </>
              )}
            </button>
          </div>
        </div>

        {/* Workspace Brand Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-black/[0.015] border border-base-border">
          <div className="h-14 w-14 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg shadow-sm border border-black/10 shrink-0">
            {form.name ? form.name.slice(0, 2).toUpperCase() : "AC"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-display font-semibold text-sm truncate">
                {form.name || "Acme Support Core"}
              </h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 font-medium">
                Verified Workspace
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5 font-mono truncate">
              https://{form.subdomain || "acme.supportai.com"}
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-base-border rounded bg-white hover:bg-black/[0.02] transition-colors"
          >
            <UploadCloud size={13} className="text-text-faint" />
            Update Logo
          </button>
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Workspace / Company Name
            </label>
            <div className="relative">
              <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <input
                type="text"
                required
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Acme Corporation"
                className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Support Subdomain URL
            </label>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <input
                type="text"
                required
                value={form.subdomain || ""}
                onChange={(e) => setForm({ ...form, subdomain: e.target.value })}
                placeholder="company.supportai.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black font-mono text-[11px] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Primary Inbound Support Email
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <input
                type="email"
                required
                value={form.supportEmail || ""}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                placeholder="support@company.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Default Timezone
            </label>
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <select
                value={form.timezone || "UTC-05:00 (Eastern Time)"}
                onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white transition-colors"
              >
                <option value="UTC-05:00 (Eastern Time)">UTC-05:00 (Eastern Time - New York)</option>
                <option value="UTC-08:00 (Pacific Time)">UTC-08:00 (Pacific Time - San Francisco)</option>
                <option value="UTC+00:00 (London, GMT)">UTC+00:00 (London, GMT)</option>
                <option value="UTC+01:00 (Central European Time)">UTC+01:00 (Central European Time - Paris)</option>
                <option value="UTC+05:30 (India Standard Time)">UTC+05:30 (India Standard Time - IST)</option>
                <option value="UTC+08:00 (Singapore / Hong Kong)">UTC+08:00 (Singapore / Hong Kong)</option>
                <option value="UTC+09:00 (Tokyo, JST)">UTC+09:00 (Tokyo, JST)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              AI Support Operating Schedule
            </label>
            <div className="relative">
              <Clock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <select
                value={form.operatingHours || "24/7 (Continuous AI Coverage)"}
                onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white transition-colors"
              >
                <option value="24/7 (Continuous AI Coverage)">24/7 (Continuous AI Coverage - Recommended)</option>
                <option value="Business Hours Only (9am - 6pm)">Business Hours Only (9am - 6pm)</option>
                <option value="After Hours & Weekends Only">After Hours & Weekends Only</option>
                <option value="Custom Schedule">Custom Shift Schedule</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Primary System Language
            </label>
            <div className="relative">
              <Languages size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <select
                value={form.language || "English (US)"}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white transition-colors"
              >
                <option value="English (US)">English (United States)</option>
                <option value="English (UK)">English (United Kingdom)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="French (Français)">French (Français)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
                <option value="Japanese (日本語)">Japanese (日本語)</option>
                <option value="Portuguese (Português)">Portuguese (Português)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Data Residency Card */}
      <div className="panel p-6 bg-white border border-base-border space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-base-border">
          <Shield size={16} className="text-black" />
          <h4 className="font-display font-semibold text-xs text-text-primary">
            Data Residency & Compliance Status
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3.5 rounded bg-black/[0.015] border border-base-border">
            <p className="text-[11px] text-text-muted font-medium">Vector Storage Region</p>
            <p className="text-xs font-semibold text-text-primary mt-1">AWS us-east-1 (N. Virginia)</p>
            <p className="text-[10px] text-emerald-600 font-mono mt-0.5">● Encrypted AES-256</p>
          </div>

          <div className="p-3.5 rounded bg-black/[0.015] border border-base-border">
            <p className="text-[11px] text-text-muted font-medium">SOC-2 & GDPR Compliance</p>
            <p className="text-xs font-semibold text-text-primary mt-1">Certified Compliant</p>
            <p className="text-[10px] text-emerald-600 font-mono mt-0.5">● Audit Log Enabled</p>
          </div>

          <div className="p-3.5 rounded bg-black/[0.015] border border-base-border">
            <p className="text-[11px] text-text-muted font-medium">Data Retention Policy</p>
            <p className="text-xs font-semibold text-text-primary mt-1">90 Days Rolling Storage</p>
            <p className="text-[10px] text-text-muted font-mono mt-0.5">Auto-anonymized PII</p>
          </div>
        </div>
      </div>
    </form>
  );
}
