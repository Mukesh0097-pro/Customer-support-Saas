import { useState } from "react";
import {
  Sparkles,
  Send,
  Zap,
  Cpu,
  Layers,
  FileText,
  Copy,
  Check,
  Code,
  ShieldCheck,
  Search,
} from "lucide-react";
import { runRAGQueryTest } from "../../services/kbService";

const SAMPLE_QUERIES = [
  "What is the refund and cancellation window?",
  "How do I authenticate API requests with Bearer tokens?",
  "What are the API rate limits for Enterprise accounts?",
  "Is customer conversation data encrypted at rest?",
  "How do I connect Slack to my support workspace?",
];

export default function RAGSimulator() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeView, setActiveView] = useState("response"); // 'response' | 'prompt' | 'raw'
  const [copied, setCopied] = useState(false);

  const handleTest = async (queryText) => {
    const q = queryText || query;
    if (!q.trim()) return;

    setLoading(true);
    const data = await runRAGQueryTest(q);
    setResults(data);
    setLoading(false);
  };

  const handleCopyPrompt = () => {
    if (!results?.augmentedPrompt) return;
    navigator.clipboard.writeText(results.augmentedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Search Simulator Card */}
      <div className="panel p-5 bg-white border border-base-border space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-black" />
            <h3 className="font-display font-semibold text-sm">
              Live RAG Retrieval Sandbox & Query Simulator
            </h3>
          </div>
          <p className="text-xs text-text-muted mt-0.5">
            Test how the AI support agent performs semantic vector retrieval, ranks matching chunks, and generates synthesized answers.
          </p>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTest(query);
          }}
          className="space-y-3"
        >
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a customer support question to test vector retrieval…"
              className="w-full pl-4 pr-24 py-3 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-black/[0.01]"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white rounded hover:opacity-85 disabled:opacity-50 transition-opacity"
            >
              {loading ? (
                <span>Retrieving…</span>
              ) : (
                <>
                  <span>Simulate</span>
                  <Send size={12} />
                </>
              )}
            </button>
          </div>

          {/* Quick Query Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-text-faint font-medium flex items-center gap-1">
              <Search size={11} />
              Try sample query:
            </span>
            {SAMPLE_QUERIES.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(sq);
                  handleTest(sq);
                }}
                className="text-[11px] px-2.5 py-1 rounded bg-black/[0.03] text-text-muted hover:bg-black hover:text-white transition-all text-left truncate max-w-xs"
              >
                {sq}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Results View */}
      {results && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
          {/* Left Column: Retrieved Chunks (5 Cols) */}
          <div className="xl:col-span-5 panel p-4 bg-white border border-base-border space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-base-border">
              <div className="flex items-center gap-2">
                <Layers size={15} className="text-black" />
                <h4 className="font-display font-semibold text-xs">
                  Top Retrieved Vector Chunks
                </h4>
              </div>
              <span className="text-[10px] font-mono text-text-faint">
                {results.retrievedChunks?.length || 0} Matches
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
              {(results.retrievedChunks || []).map((chunk, idx) => {
                const matchPct = Math.round((chunk.similarityScore || 0.85) * 100);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded border border-base-border/80 bg-black/[0.015] hover:border-black/30 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <FileText size={13} className="text-text-muted shrink-0" />
                        <span className="font-mono text-[11px] font-semibold text-text-primary truncate">
                          {chunk.source}
                        </span>
                      </div>

                      {/* Cosine Similarity Pill */}
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          matchPct >= 90
                            ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                            : matchPct >= 75
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : "bg-black/[0.05] text-text-muted"
                        }`}
                      >
                        {matchPct}% Match
                      </span>
                    </div>

                    <p className="text-xs text-text-muted bg-white p-2.5 rounded border border-base-border/50 font-mono leading-relaxed">
                      {chunk.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-text-faint font-mono pt-1">
                      <span>Chunk #{chunk.chunkIndex || idx + 1}</span>
                      <span>Cosine: {chunk.similarityScore}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: AI Synthesized Output & Augmented Context (7 Cols) */}
          <div className="xl:col-span-7 panel p-4 bg-white border border-base-border space-y-3 flex flex-col justify-between">
            <div>
              {/* Header with Sub-tabs */}
              <div className="flex items-center justify-between pb-2 border-b border-base-border">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-black" />
                  <h4 className="font-display font-semibold text-xs">
                    Synthesized AI Response
                  </h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveView("response")}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                      activeView === "response"
                        ? "bg-black text-white"
                        : "bg-black/[0.03] text-text-muted hover:bg-black/[0.06]"
                    }`}
                  >
                    AI Answer
                  </button>
                  <button
                    onClick={() => setActiveView("prompt")}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                      activeView === "prompt"
                        ? "bg-black text-white"
                        : "bg-black/[0.03] text-text-muted hover:bg-black/[0.06]"
                    }`}
                  >
                    Augmented Prompt
                  </button>
                </div>
              </div>

              {/* View 1: AI Answer */}
              {activeView === "response" && (
                <div className="py-3 space-y-3">
                  <div className="p-4 rounded-md bg-black/[0.02] border border-base-border space-y-3">
                    <p className="text-xs text-text-primary leading-relaxed">
                      {results.synthesizedAnswer}
                    </p>

                    <div className="pt-2 border-t border-base-border/60 flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="text-text-faint font-medium">Source Citations:</span>
                      {results.retrievedChunks?.map((c, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-base-border text-text-primary font-mono text-[10px]"
                        >
                          <FileText size={10} />
                          {c.source}#chunk-{c.chunkIndex || i + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Augmented Prompt */}
              {activeView === "prompt" && (
                <div className="py-3 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-text-faint">
                    <span>LLM System Injection Context:</span>
                    <button
                      onClick={handleCopyPrompt}
                      className="flex items-center gap-1 hover:text-black transition-colors"
                    >
                      {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      {copied ? "Copied" : "Copy Prompt"}
                    </button>
                  </div>
                  <pre className="p-3 bg-black/[0.02] border border-base-border rounded text-[11px] font-mono text-text-muted overflow-x-auto whitespace-pre-wrap max-h-[360px]">
                    {results.augmentedPrompt}
                  </pre>
                </div>
              )}
            </div>

            {/* Retrieval Telemetry Footer */}
            <div className="pt-3 border-t border-base-border grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded bg-black/[0.02] border border-base-border/50">
                <p className="text-[10px] text-text-faint uppercase">Latency</p>
                <p className="font-semibold text-emerald-600 mt-0.5">{results.latencyMs} ms</p>
              </div>
              <div className="p-2 rounded bg-black/[0.02] border border-base-border/50">
                <p className="text-[10px] text-text-faint uppercase">Tokens</p>
                <p className="font-semibold text-text-primary mt-0.5">{results.tokensUsed} tokens</p>
              </div>
              <div className="p-2 rounded bg-black/[0.02] border border-base-border/50">
                <p className="text-[10px] text-text-faint uppercase">Model</p>
                <p className="font-semibold text-text-primary mt-0.5 truncate">{results.embeddingModel}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
