import { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  User,
  Bot,
  CheckCheck,
  Paperclip,
  Smile,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  FileText,
  UserCheck,
  UserX,
  Sliders,
} from "lucide-react";
import AICopilotBar from "./AICopilotBar";
import { SlackLogo, WhatsAppLogo, ShopifyLogo } from "../settings/IntegrationLogos";

const CANNED_MACROS = [
  { label: "Request ARN / Transaction Code", text: "Could you please provide the Acquirer Reference Number (ARN) or the last 4 digits of the payment card so we can trace this directly in our banking portal?" },
  { label: "SLA Resolution Confirmation", text: "I have investigated your account parameters and confirmed the issue is resolved. Please test this on your end and let me know if you run into anything else!" },
  { label: "Escalating to Engineering", text: "I have created an engineering investigation ticket with our core infrastructure team. We will update you with resolution logs within 2 hours." },
];

export default function ChatWorkspace({
  conversation,
  onSendMessage,
  onToggleHandover,
  onFetchDraft,
  onUpdateStatus,
}) {
  const [inputText, setInputText] = useState("");
  const [activeCitation, setActiveCitation] = useState(null);
  const [showMacros, setShowMacros] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center text-text-muted text-xs bg-base-bg">
        Select a conversation from the left queue to start triaging.
      </div>
    );
  }

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleApplyDraft = (draftText) => {
    setInputText(draftText);
  };

  const handleSendDraft = (draftText) => {
    onSendMessage(draftText);
  };

  const handleInsertMacro = (macroText) => {
    setInputText(macroText);
    setShowMacros(false);
  };

  const isAIHandled = conversation.handler === "AI Assistant";

  return (
    <div className="flex-1 flex flex-col h-full bg-white min-w-0">
      {/* Workspace Header */}
      <div className="px-5 py-3.5 border-b border-base-border flex items-center justify-between gap-4 shrink-0 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">
            {conversation.customer.avatar || conversation.customer.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-sm text-text-primary truncate">
                {conversation.customer.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/[0.05] border border-base-border font-mono text-text-muted">
                {conversation.customer.plan}
              </span>
            </div>
            <p className="text-xs text-text-muted truncate font-medium mt-0.5">
              {conversation.subject}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onToggleHandover(isAIHandled ? "Human Lead" : "AI Assistant")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
              isAIHandled
                ? "bg-black text-white hover:opacity-85"
                : "bg-purple-600 text-white hover:bg-purple-700 shadow-xs"
            }`}
          >
            {isAIHandled ? (
              <>
                <UserCheck size={13} /> Take Over from AI
              </>
            ) : (
              <>
                <Bot size={13} /> Hand Back to AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-black/[0.01]">
        {conversation.messages.map((msg) => {
          const isCustomer = msg.sender === "customer";
          const isAI = msg.sender === "ai";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCustomer ? "items-start" : isAI ? "items-start" : "items-end"}`}
            >
              {/* Sender label */}
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-text-faint">
                {isAI ? (
                  <span className="flex items-center gap-1 font-semibold text-text-primary">
                    <Bot size={12} className="text-black" /> SupportAI Assistant
                  </span>
                ) : isCustomer ? (
                  <span className="font-medium text-text-primary">{msg.authorName}</span>
                ) : (
                  <span className="font-medium text-text-primary">{msg.authorName} (Agent)</span>
                )}
                <span>·</span>
                <span className="font-mono">{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-lg p-3.5 text-xs leading-relaxed transition-all shadow-2xs ${
                  isCustomer
                    ? "bg-black/[0.04] text-text-primary border border-base-border"
                    : isAI
                    ? "bg-white text-text-primary border border-base-border ring-1 ring-black/5"
                    : "bg-black text-white"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* AI Vector Citations Embedded Card */}
                {isAI && msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-base-border/70 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-text-muted">
                      <span className="flex items-center gap-1 font-semibold text-text-primary">
                        <ShieldCheck size={11} className="text-emerald-600" />
                        Grounded in Knowledge Base
                      </span>
                      {msg.confidence && (
                        <span className="font-mono font-bold text-emerald-700">
                          {msg.confidence}% Accuracy Match
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      {msg.citations.map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveCitation(c)}
                          className="text-left p-2 rounded bg-black/[0.02] border border-base-border/80 hover:bg-black/[0.05] transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium font-mono text-[10px] text-text-primary group-hover:text-black">
                              {c.docTitle}
                            </span>
                            <span className="text-[10px] text-text-faint font-mono">
                              {c.section}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-muted line-clamp-1 mt-0.5 font-mono">
                            "{c.snippet}"
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* AI Copilot Suggestion Box */}
      <AICopilotBar
        conversationId={conversation.id}
        onApplyDraft={handleApplyDraft}
        onSendDraft={handleSendDraft}
        onFetchDraft={onFetchDraft}
      />

      {/* Composer Input Bar */}
      <div className="p-3.5 bg-white border-t border-base-border shrink-0 space-y-2">
        {/* Macros Ribbon */}
        {showMacros && (
          <div className="p-3 rounded-lg bg-black/[0.02] border border-base-border space-y-1.5 animate-in fade-in zoom-in-98 duration-150">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-semibold text-text-primary">Quick Canned Macros</span>
              <button onClick={() => setShowMacros(false)} className="text-text-faint hover:text-text-primary">
                <X size={12} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {CANNED_MACROS.map((macro, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInsertMacro(macro.text)}
                  className="text-left p-2 rounded bg-white border border-base-border hover:border-black text-[11px] transition-colors"
                >
                  <p className="font-semibold text-text-primary truncate">{macro.label}</p>
                  <p className="text-text-muted text-[10px] line-clamp-2 mt-0.5">{macro.text}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-2">
          <div className="relative">
            <textarea
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                isAIHandled
                  ? "AI is actively responding. Typing here will automatically assign the ticket to you…"
                  : "Reply as Human Agent (Enter to send, Shift+Enter for newline)…"
              }
              className="w-full p-3 pr-24 text-xs border border-base-border rounded-lg focus:outline-none focus:border-black resize-none bg-black/[0.01]"
            />

            <div className="absolute right-2.5 bottom-3 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowMacros(!showMacros)}
                className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-black/[0.04] transition-colors"
                title="Canned Macros"
              >
                <FileText size={14} />
              </button>

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-black text-white rounded hover:opacity-85 disabled:opacity-40 transition-opacity"
              >
                <Send size={12} />
                Send
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Citation Detail Modal */}
      {activeCitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-lg border border-base-border p-5 shadow-xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-base-border">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-black" />
                <h4 className="font-display font-semibold text-xs text-text-primary">
                  Knowledge Base Vector Grounding Citation
                </h4>
              </div>
              <button onClick={() => setActiveCitation(null)} className="text-text-faint hover:text-text-primary">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold text-text-primary">{activeCitation.docTitle}</p>
              <p className="text-[11px] text-text-muted font-mono">{activeCitation.section}</p>
            </div>

            <div className="p-3 rounded bg-black/[0.03] border border-base-border text-xs font-mono leading-relaxed text-text-primary">
              "{activeCitation.snippet}"
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveCitation(null)}
                className="px-3 py-1 text-xs font-medium bg-black text-white rounded hover:opacity-85"
              >
                Close Citation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
