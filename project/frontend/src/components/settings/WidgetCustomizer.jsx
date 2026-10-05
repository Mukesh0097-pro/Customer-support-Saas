import { useState } from "react";
import {
  Code,
  Copy,
  Check,
  Sparkles,
  Palette,
  Layout,
  MessageSquare,
  Globe,
  Sliders,
  Send,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

const COLOR_PRESETS = [
  { name: "Obsidian Black", hex: "#000000" },
  { name: "Royal Indigo", hex: "#4f46e5" },
  { name: "Ocean Blue", hex: "#0284c7" },
  { name: "Emerald Mint", hex: "#059669" },
  { name: "Purple Violet", hex: "#7c3aed" },
  { name: "Crimson Rose", hex: "#e11d48" },
];

export default function WidgetCustomizer({ onShowToast }) {
  // Widget Customization State
  const [botName, setBotName] = useState("SupportAI Assistant");
  const [greeting, setGreeting] = useState("Hi there! 👋 How can I help you today?");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [position, setPosition] = useState("right"); // 'right' | 'left'
  const [copied, setCopied] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState("html"); // 'html' | 'wordpress' | 'shopify' | 'nextjs'

  // Interactive Live Preview State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMessages, setPreviewMessages] = useState([
    {
      id: "demo-greet",
      sender: "bot",
      text: greeting,
      citations: [],
    },
  ]);
  const [previewInput, setPreviewInput] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  // Computed Script Snippet
  const scriptSnippet = `<!-- SupportAI Chatbot Widget -->
<script 
  src="${window.location.origin}/widget.js" 
  data-api-base="http://localhost:5000/api"
  data-bot-name="${botName}"
  data-greeting="${greeting.replace(/"/g, '&quot;')}"
  data-primary-color="${primaryColor}"
  data-position="${position}"
  defer>
</script>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptSnippet);
    setCopied(true);
    if (onShowToast) onShowToast("Embed code copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendPreview = async (textToSend) => {
    const text = textToSend || previewInput;
    if (!text.trim() || previewLoading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: text.trim(),
    };

    setPreviewMessages((prev) => [...prev, userMsg]);
    setPreviewInput("");
    setPreviewLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply || "Thank you for reaching out.",
        citations: data.citations || [],
      };
      setPreviewMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setPreviewMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "bot",
          text: "I'm having trouble connecting to the live engine right now.",
        },
      ]);
    } finally {
      setPreviewLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="panel p-5 bg-black/[0.015] border border-base-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-black text-white flex items-center justify-center">
              <Code size={13} />
            </div>
            <h2 className="font-display font-semibold text-sm">
              Website Chatbot Widget Generator
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold border border-emerald-500/20">
              Live Ready
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Embed your AI customer support assistant on any website with a single line of JavaScript.
          </p>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md bg-black text-white hover:opacity-85 transition-all shadow-sm shrink-0"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? "Copied Snippet!" : "Copy 1-Line Code"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Customizer Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Embed Code Snippet Box */}
          <div className="panel p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code size={15} className="text-text-primary" />
                <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-text-primary">
                  1. Your 1-Line Embed Snippet
                </h3>
              </div>
              <button
                onClick={handleCopyCode}
                className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1 font-medium transition-colors"
              >
                {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>

            <div className="relative group">
              <pre className="p-3.5 rounded-lg bg-zinc-950 text-zinc-200 text-xs font-mono overflow-x-auto leading-relaxed border border-zinc-800">
                {scriptSnippet}
              </pre>
            </div>
            <p className="text-[11px] text-text-muted">
              Paste this tag directly before the closing <code className="px-1 py-0.5 rounded bg-black/[0.04] font-mono text-text-primary">&lt;/body&gt;</code> tag on any website.
            </p>
          </div>

          {/* 2. Brand & Appearance */}
          <div className="panel p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Palette size={15} className="text-text-primary" />
              <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-text-primary">
                2. Brand & Appearance
              </h3>
            </div>

            {/* Bot Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-primary">Chatbot Name</label>
              <input
                type="text"
                value={botName}
                onChange={(e) => setBotName(e.target.value)}
                placeholder="e.g. SupportAI Assistant"
                className="w-full rounded-md border border-base-border px-3 py-2 text-xs text-text-primary placeholder:text-text-faint focus:border-black/40 outline-none"
              />
            </div>

            {/* Greeting */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-primary">Welcome Message</label>
              <textarea
                rows={2}
                value={greeting}
                onChange={(e) => {
                  setGreeting(e.target.value);
                  setPreviewMessages((prev) => [
                    { ...prev[0], text: e.target.value },
                    ...prev.slice(1),
                  ]);
                }}
                className="w-full rounded-md border border-base-border px-3 py-2 text-xs text-text-primary placeholder:text-text-faint focus:border-black/40 outline-none resize-none"
              />
            </div>

            {/* Brand Color */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-text-primary">Brand Color</label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => setPrimaryColor(preset.hex)}
                    className={`h-7 w-7 rounded-full flex items-center justify-center transition-transform ${
                      primaryColor.toLowerCase() === preset.hex.toLowerCase()
                        ? "scale-110 ring-2 ring-black ring-offset-2"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: preset.hex }}
                    title={preset.name}
                  >
                    {primaryColor.toLowerCase() === preset.hex.toLowerCase() && (
                      <Check size={12} className="text-white" />
                    )}
                  </button>
                ))}
                <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-base-border">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-7 w-7 rounded border border-base-border cursor-pointer p-0"
                  />
                  <span className="text-xs font-mono text-text-muted">{primaryColor}</span>
                </div>
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2 pt-2 border-t border-base-border/60">
              <label className="text-xs font-medium text-text-primary">Screen Position</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPosition("right")}
                  className={`py-2 px-3 text-xs font-medium rounded-md border flex items-center justify-center gap-2 transition-all ${
                    position === "right"
                      ? "border-black bg-black text-white"
                      : "border-base-border text-text-muted hover:border-black/30"
                  }`}
                >
                  <Layout size={13} />
                  <span>Bottom Right</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPosition("left")}
                  className={`py-2 px-3 text-xs font-medium rounded-md border flex items-center justify-center gap-2 transition-all ${
                    position === "left"
                      ? "border-black bg-black text-white"
                      : "border-base-border text-text-muted hover:border-black/30"
                  }`}
                >
                  <Layout size={13} className="rotate-180" />
                  <span>Bottom Left</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Platform Installation Guides */}
          <div className="panel p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Globe size={15} className="text-text-primary" />
              <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-text-primary">
                3. Platform Installation Guides
              </h3>
            </div>

            {/* Guide Tabs */}
            <div className="flex items-center gap-2 border-b border-base-border pb-2">
              {[
                { id: "html", label: "Standard HTML" },
                { id: "wordpress", label: "WordPress" },
                { id: "shopify", label: "Shopify" },
                { id: "nextjs", label: "Next.js / React" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuide(g.id)}
                  className={`text-xs font-medium px-2.5 py-1 rounded transition-colors ${
                    selectedGuide === g.id
                      ? "bg-black text-white"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-text-muted space-y-2 pt-1">
              {selectedGuide === "html" && (
                <p>
                  Open your <code className="font-mono text-text-primary">index.html</code> file and paste the snippet right above the closing <code className="font-mono text-text-primary">&lt;/body&gt;</code> tag.
                </p>
              )}
              {selectedGuide === "wordpress" && (
                <p>
                  Go to <strong>WP Admin &gt; Settings &gt; Insert Headers and Footers</strong> (or your theme footer settings) and paste the code into the <strong>Scripts in Footer</strong> box.
                </p>
              )}
              {selectedGuide === "shopify" && (
                <p>
                  In your Shopify admin, navigate to <strong>Online Store &gt; Themes &gt; Edit code</strong>. Open <code className="font-mono text-text-primary">theme.liquid</code> and paste before <code className="font-mono text-text-primary">&lt;/body&gt;</code>.
                </p>
              )}
              {selectedGuide === "nextjs" && (
                <p>
                  In Next.js App Router, add <code className="font-mono text-text-primary">&lt;Script src="{window.location.origin}/widget.js" /&gt;</code> to your root <code className="font-mono text-text-primary">app/layout.jsx</code>.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Live Sandbox Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-3 sticky top-20">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-xs uppercase tracking-wider text-text-primary">
              Live Widget Simulator
            </h3>
            <span className="text-[11px] text-text-faint">
              Click bubble to test chat
            </span>
          </div>

          {/* Mock Browser Container */}
          <div className="panel overflow-hidden border border-base-border shadow-lg rounded-xl bg-zinc-100 flex flex-col h-[580px] relative">
            {/* Mock Browser Topbar */}
            <div className="bg-zinc-200/80 px-3 py-2 border-b border-zinc-300 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
              </div>
              <div className="flex-1 bg-white rounded text-[10px] text-zinc-500 font-mono py-0.5 px-3 truncate text-center border border-zinc-300">
                https://your-client-website.com
              </div>
            </div>

            {/* Mock Client Website Content */}
            <div className="flex-1 p-5 bg-white space-y-4 overflow-hidden relative">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="h-4 w-24 bg-zinc-200 rounded" />
                <div className="flex items-center gap-2">
                  <div className="h-3 w-10 bg-zinc-100 rounded" />
                  <div className="h-3 w-10 bg-zinc-100 rounded" />
                  <div className="h-3 w-10 bg-zinc-100 rounded" />
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="h-6 w-3/4 bg-zinc-800 rounded-md" />
                <div className="h-3 w-full bg-zinc-200 rounded" />
                <div className="h-3 w-5/6 bg-zinc-100 rounded" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="h-20 bg-zinc-50 border border-zinc-200/60 rounded-lg p-2 space-y-1">
                  <div className="h-3 w-12 bg-zinc-200 rounded" />
                  <div className="h-2 w-full bg-zinc-100 rounded" />
                </div>
                <div className="h-20 bg-zinc-50 border border-zinc-200/60 rounded-lg p-2 space-y-1">
                  <div className="h-3 w-12 bg-zinc-200 rounded" />
                  <div className="h-2 w-full bg-zinc-100 rounded" />
                </div>
              </div>

              {/* OVERLAY: Simulated Chat Widget Inside Mock Window */}
              <div
                className={`absolute bottom-4 ${
                  position === "left" ? "left-4 items-start" : "right-4 items-end"
                } z-20 flex flex-col`}
              >
                {/* Chat Window Popup */}
                {previewOpen && (
                  <div className="w-[310px] h-[390px] bg-white rounded-2xl shadow-2xl border border-zinc-200 flex flex-col mb-3 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {/* Header */}
                    <div
                      className="px-3.5 py-3 text-white flex items-center justify-between transition-colors"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                          {botName.slice(0, 1)}
                        </div>
                        <div>
                          <div className="font-semibold text-xs leading-none">{botName}</div>
                          <div className="text-[9px] opacity-80 mt-0.5 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />
                            Online
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setPreviewOpen(false)}
                        className="text-white/80 hover:text-white text-xs p-1"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Messages Container */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-zinc-50 text-xs">
                      {previewMessages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex flex-col max-w-[85%] ${
                            m.sender === "user" ? "ml-auto items-end" : "items-start"
                          }`}
                        >
                          <div
                            className={`p-2.5 rounded-xl text-xs ${
                              m.sender === "user"
                                ? "text-white rounded-br-none"
                                : "bg-white text-zinc-800 border border-zinc-200 rounded-bl-none shadow-sm"
                            }`}
                            style={{
                              backgroundColor: m.sender === "user" ? primaryColor : "#ffffff",
                            }}
                          >
                            {m.text}

                            {m.citations && m.citations.length > 0 && (
                              <div className="mt-1.5 flex flex-wrap gap-1">
                                {m.citations.map((c, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200"
                                  >
                                    📄 {c.title}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {previewLoading && (
                        <div className="p-2.5 bg-white border border-zinc-200 rounded-xl rounded-bl-none shadow-sm w-fit text-zinc-400 text-xs">
                          AI is thinking…
                        </div>
                      )}
                    </div>

                    {/* Suggestion Chips */}
                    {previewMessages.length === 1 && (
                      <div className="p-2 bg-zinc-50 border-t border-zinc-100 flex flex-wrap gap-1">
                        {["What is the refund policy?", "How do I use API?"].map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleSendPreview(chip)}
                            className="text-[10px] bg-white border border-zinc-200 text-zinc-700 px-2 py-1 rounded-full hover:bg-zinc-100 transition-colors"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input Bar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendPreview();
                      }}
                      className="p-2 bg-white border-t border-zinc-200 flex items-center gap-1.5"
                    >
                      <input
                        type="text"
                        value={previewInput}
                        onChange={(e) => setPreviewInput(e.target.value)}
                        placeholder="Ask a question…"
                        className="flex-1 text-xs border border-zinc-200 rounded-full px-3 py-1.5 outline-none focus:border-zinc-400"
                      />
                      <button
                        type="submit"
                        disabled={!previewInput.trim() || previewLoading}
                        className="h-7 w-7 rounded-full text-white flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-40"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Send size={12} />
                      </button>
                    </form>
                  </div>
                )}

                {/* Floating Bubble Button */}
                <button
                  type="button"
                  onClick={() => setPreviewOpen(!previewOpen)}
                  className="h-12 w-12 rounded-full text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageSquare size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
