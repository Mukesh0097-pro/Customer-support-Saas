import { useState, useEffect } from "react";
import {
  Sparkles,
  Zap,
  Check,
  Send,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Sliders,
  ChevronDown,
  Info,
} from "lucide-react";

export default function AICopilotBar({
  conversationId,
  onApplyDraft,
  onSendDraft,
  onFetchDraft,
}) {
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState("Empathetic");

  useEffect(() => {
    if (conversationId) {
      loadDraft();
    }
  }, [conversationId]);

  const loadDraft = async () => {
    setLoading(true);
    const res = await onFetchDraft(conversationId);
    if (res?.draft) {
      setDraft(res.draft);
    }
    setLoading(false);
  };

  if (!draft && !loading) return null;

  return (
    <div className="p-3.5 bg-black/[0.02] border-t border-base-border space-y-2.5 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-black text-white flex items-center justify-center">
            <Sparkles size={11} />
          </div>
          <span className="text-xs font-semibold text-text-primary">
            AI Copilot Real-Time Grounded Recommendation
          </span>
          {draft?.confidence && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold border border-emerald-500/20">
              {draft.confidence}% Confidence
            </span>
          )}
        </div>

        <button
          onClick={loadDraft}
          disabled={loading}
          className="text-xs text-text-muted hover:text-text-primary flex items-center gap-1"
          title="Regenerate Draft"
        >
          <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
          <span className="text-[11px]">Regenerate</span>
        </button>
      </div>

      {loading ? (
        <div className="py-3 flex items-center gap-2 text-xs text-text-muted">
          <RefreshCw size={13} className="animate-spin text-black" />
          <span>Searching vector embeddings & generating draft…</span>
        </div>
      ) : (
        draft && (
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-base-border text-xs leading-relaxed text-text-primary shadow-2xs font-body">
              {draft.text}
            </div>

            {/* Citations Preview */}
            {draft.citations && draft.citations.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-text-muted flex-wrap">
                <span className="flex items-center gap-1 text-text-faint font-medium">
                  <BookOpen size={11} /> Source:
                </span>
                {draft.citations.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-black/[0.04] text-text-primary font-mono text-[10px] border border-base-border"
                  >
                    {c.docTitle} ({c.section})
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                {["Empathetic", "Concise", "Technical"].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                      selectedTone === tone
                        ? "bg-black text-white font-medium"
                        : "text-text-muted hover:bg-black/[0.04]"
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onApplyDraft(draft.text)}
                  className="px-3 py-1 text-xs border border-base-border rounded hover:bg-black/[0.03] text-text-primary font-medium transition-colors"
                >
                  Insert & Edit
                </button>

                <button
                  type="button"
                  onClick={() => onSendDraft(draft.text)}
                  className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-black text-white rounded hover:opacity-85 transition-opacity"
                >
                  <Send size={11} />
                  Send Directly
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
