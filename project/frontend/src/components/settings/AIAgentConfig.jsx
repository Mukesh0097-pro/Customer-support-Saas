import { useState, useEffect } from "react";
import {
  Sparkles,
  ShieldCheck,
  Sliders,
  AlertTriangle,
  Check,
  Save,
  Cpu,
  Plus,
  X,
  RotateCcw,
  BookOpen,
  Zap,
  Info,
} from "lucide-react";

const PROMPT_PRESETS = [
  {
    name: "SaaS Technical Support",
    model: "GPT-4o Resolution Engine",
    tone: "Technical & Concise",
    temperature: 0.2,
    threshold: 85,
    prompt:
      "You are the SupportAI tier-1 technical engineer. Provide direct, highly accurate, and code-grounded troubleshooting steps based strictly on indexed documentation. Cite doc sections and escalate API failures with stack traces to human engineers.",
  },
  {
    name: "Empathetic Helpdesk",
    model: "Claude 3.5 Sonnet Matrix",
    tone: "Empathetic & Professional",
    temperature: 0.3,
    threshold: 80,
    prompt:
      "You are the SupportAI automated customer support assistant for Acme Inc. Be polite, warm, and concise. Always ground answers strictly in the indexed knowledge base citations. If the customer expresses frustration, empathize and offer immediate escalation.",
  },
  {
    name: "E-Commerce & Orders",
    model: "GPT-4o Resolution Engine",
    tone: "Friendly & Casual",
    temperature: 0.25,
    threshold: 82,
    prompt:
      "You are the SupportAI shopping assistant. Assist customers with tracking orders, return policies, refund timelines, and product sizing based on verified store policies. Ask for order numbers when missing.",
  },
];

export default function AIAgentConfig({ agent, onSave }) {
  const [form, setForm] = useState(agent || {});
  const [newBannedTopic, setNewBannedTopic] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (agent) setForm(agent);
  }, [agent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(form);
    setIsSubmitting(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setForm(agent || {});
  };

  const handleApplyPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      model: preset.model,
      tone: preset.tone,
      temperature: preset.temperature,
      confidenceThreshold: preset.threshold,
      systemPrompt: preset.prompt,
    }));
  };

  const handleAddTopic = () => {
    if (!newBannedTopic.trim()) return;
    const current = form.bannedTopics || [];
    if (!current.includes(newBannedTopic.trim())) {
      setForm({ ...form, bannedTopics: [...current, newBannedTopic.trim()] });
    }
    setNewBannedTopic("");
  };

  const handleRemoveTopic = (index) => {
    const current = form.bannedTopics || [];
    setForm({ ...form, bannedTopics: current.filter((_, i) => i !== index) });
  };

  const handleQuickAddBanned = (topic) => {
    const current = form.bannedTopics || [];
    if (!current.includes(topic)) {
      setForm({ ...form, bannedTopics: [...current, topic] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Presets Ribbon */}
      <div className="panel p-4 bg-white border border-base-border">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-black" />
            <span className="text-xs font-semibold text-text-primary">
              Persona & Directives Quick Presets
            </span>
          </div>
          <span className="text-[11px] text-text-faint">Click preset to autofill configuration</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROMPT_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="text-left p-3 rounded border border-base-border bg-black/[0.015] hover:border-black hover:bg-black/[0.03] transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary group-hover:text-black">
                  {p.name}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/[0.06] font-mono text-text-muted">
                  {p.tone.split(" ")[0]}
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
                {p.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Persona & Model Card */}
      <div className="panel p-6 bg-white border border-base-border space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-border">
          <div>
            <h3 className="font-display font-semibold text-sm text-text-primary">
              AI Agent Persona & Reasoning Engine
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Configure underlying LLM models, conversational tone, confidence thresholds, and safety guardrails.
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
                  Save AI Settings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Model & Tone Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Primary LLM Resolution Engine
            </label>
            <div className="relative">
              <Cpu size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <select
                value={form.model || "GPT-4o Resolution Engine"}
                onChange={(e) => setForm({ ...form, model: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white transition-colors"
              >
                <option value="GPT-4o Resolution Engine">OpenAI GPT-4o (High Speed & 99.4% Precision)</option>
                <option value="Claude 3.5 Sonnet Matrix">Anthropic Claude 3.5 Sonnet (Nuanced Multi-Turn Reasoning)</option>
                <option value="Gemini 1.5 Pro Ultra">Google Gemini 1.5 Pro (Massive Context Retrieval)</option>
                <option value="Llama-3.1 70B Fast">Meta Llama 3.1 70B Fast (Self-Hosted Private VPC)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Conversational Tone & Style
            </label>
            <div className="relative">
              <Sparkles size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
              <select
                value={form.tone || "Empathetic & Professional"}
                onChange={(e) => setForm({ ...form, tone: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white transition-colors"
              >
                <option value="Empathetic & Professional">Empathetic & Professional (Recommended)</option>
                <option value="Friendly & Casual">Friendly & Casual (Warm & Approachable)</option>
                <option value="Technical & Concise">Technical & Concise (Direct Developer Tone)</option>
                <option value="Formal & Executive">Formal & Executive (Corporate Inbound)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded-lg bg-black/[0.015] border border-base-border">
          {/* Temperature */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-text-primary flex items-center gap-1.5">
                <Sliders size={13} className="text-text-faint" />
                Creativity & Temperature
              </span>
              <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-base-border text-xs">
                {form.temperature ?? 0.3}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={form.temperature ?? 0.3}
              onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-faint">
              <span>Precise / Strict (0.0)</span>
              <span>Balanced (0.3)</span>
              <span>Creative (1.0)</span>
            </div>
          </div>

          {/* Auto-escalation threshold */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-text-primary flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-amber-500" />
                Auto-Escalation Confidence Threshold
              </span>
              <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-base-border text-xs">
                {form.confidenceThreshold ?? 82}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="1"
              value={form.confidenceThreshold ?? 82}
              onChange={(e) => setForm({ ...form, confidenceThreshold: parseInt(e.target.value) })}
              className="w-full accent-black cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-faint">
              <span>Permissive (50%)</span>
              <span>Standard (82%)</span>
              <span>High Precision (95%)</span>
            </div>
          </div>
        </div>

        {/* Hallucination Safety Guard */}
        <div className="p-4 rounded-lg border border-base-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                Strict Vector Grounding & Anti-Hallucination Guard
              </h4>
              <p className="text-[11px] text-text-muted mt-0.5">
                When active, the AI will refuse to guess and gracefully escalate if no matching vector citations exist in your Knowledge Base.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0 self-end sm:self-center">
            <input
              type="checkbox"
              checked={form.hallucinationGuard ?? true}
              onChange={(e) => setForm({ ...form, hallucinationGuard: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-black/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
          </label>
        </div>

        {/* System Prompt Directives */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-text-primary">
              System Instructions & Persona Directives
            </label>
            <span className="text-[11px] text-text-faint font-mono">
              {(form.systemPrompt || "").length} characters
            </span>
          </div>
          <textarea
            rows={5}
            value={form.systemPrompt || ""}
            onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
            placeholder="Define custom behavior, greeting rules, escalation triggers, and knowledge base citation instructions..."
            className="w-full p-3 text-xs border border-base-border rounded focus:outline-none focus:border-black font-mono leading-relaxed bg-black/[0.01] transition-colors"
          />
        </div>

        {/* Banned Topics & Restricted Phrases */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1">
              Banned Topics & Restricted Keywords
            </label>
            <p className="text-[11px] text-text-muted mb-2">
              If a customer query touches any restricted keywords, the agent will immediately trigger human handover.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. refund without receipt, competitor names, credentials…"
              value={newBannedTopic}
              onChange={(e) => setNewBannedTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTopic())}
              className="flex-1 px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={handleAddTopic}
              className="flex items-center gap-1 px-3.5 py-2 text-xs font-medium bg-black text-white rounded hover:opacity-85 transition-opacity"
            >
              <Plus size={13} />
              Add Keyword
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-text-faint flex items-center gap-1">
              <Info size={10} /> Quick Add:
            </span>
            {["Payment disputes", "Lawsuit & Legal", "Database passwords", "Competitor comparisons"].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickAddBanned(preset)}
                className="text-[10px] px-2 py-0.5 rounded bg-black/[0.03] text-text-muted hover:bg-black/[0.08] hover:text-text-primary transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>

          {/* Active Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {(form.bannedTopics || []).map((topic, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-black/[0.04] border border-base-border text-text-primary font-medium group"
              >
                {topic}
                <button
                  type="button"
                  onClick={() => handleRemoveTopic(i)}
                  className="text-text-faint hover:text-rose-600 transition-colors"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
