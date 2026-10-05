import { useState } from "react";
import {
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  ShieldAlert,
  Terminal,
  Code2,
  Clock,
  Eye,
  EyeOff,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function ApiKeysManager({ apiKeys = [], onCreateKey, onRevokeKey }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyScope, setNewKeyScope] = useState("Full Admin");
  const [createdKeyData, setCreatedKeyData] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [codeTab, setCodeTab] = useState("curl");
  const [revokingId, setRevokingId] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    const res = await onCreateKey(newKeyName.trim(), newKeyScope);
    if (res?.apiKey) {
      setCreatedKeyData(res.apiKey);
    }
    setNewKeyName("");
    setIsCreating(false);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRevokeConfirm = async (id) => {
    await onRevokeKey(id);
    setRevokingId(null);
  };

  const curlCode = `curl -X POST https://api.supportai.com/v1/chat/completions \\
  -H "Authorization: Bearer sk_live_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "How do I reset my password?",
    "user_id": "cust_98214"
  }'`;

  const nodeCode = `import axios from "axios";

const response = await axios.post(
  "https://api.supportai.com/v1/chat/completions",
  {
    message: "How do I reset my password?",
    user_id: "cust_98214",
  },
  {
    headers: {
      Authorization: "Bearer sk_live_your_api_key_here",
    },
  }
);
console.log(response.data);`;

  const pythonCode = `import requests

url = "https://api.supportai.com/v1/chat/completions"
headers = {
    "Authorization": "Bearer sk_live_your_api_key_here",
    "Content-Type": "application/json"
}
payload = {
    "message": "How do I reset my password?",
    "user_id": "cust_98214"
}

res = requests.post(url, headers=headers, json=payload)
print(res.json())`;

  return (
    <div className="space-y-6">
      {/* Top Banner if new key generated */}
      {createdKeyData && (
        <div className="panel p-5 bg-emerald-500/5 border border-emerald-500/30 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Key size={18} />
              <h4 className="text-xs font-semibold">API Key Created Successfully</h4>
            </div>
            <button
              onClick={() => setCreatedKeyData(null)}
              className="text-xs text-text-faint hover:text-text-primary"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-text-muted">
            Please copy this secret key now. <span className="font-semibold text-text-primary">You will not be able to see it again!</span>
          </p>

          <div className="flex items-center gap-2 bg-white p-2.5 rounded border border-emerald-500/30 font-mono text-xs">
            <span className="flex-1 truncate select-all text-text-primary font-medium">
              {createdKeyData.rawKey || createdKeyData.keyPrefix}
            </span>
            <button
              onClick={() => handleCopy(createdKeyData.rawKey || createdKeyData.keyPrefix, "new-key")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
            >
              {copiedId === "new-key" ? (
                <>
                  <Check size={13} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy Secret
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Keys List Panel */}
      <div className="panel p-6 bg-white border border-base-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-base-border">
          <div>
            <h3 className="font-display font-semibold text-sm text-text-primary">
              API Keys & Authentication Tokens
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Manage developer tokens to authenticate backend ingestions, custom web widgets, and automated RAG pipelines.
            </p>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-black text-white rounded hover:opacity-85 transition-opacity self-start sm:self-auto"
          >
            <Plus size={14} />
            Generate New Key
          </button>
        </div>

        {/* Keys Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-base-border text-text-muted font-medium">
                <th className="pb-3 pr-4">Key Identifier / Name</th>
                <th className="pb-3 px-4">Token Token Prefix</th>
                <th className="pb-3 px-4">Permission Scope</th>
                <th className="pb-3 px-4">Created Date</th>
                <th className="pb-3 px-4">Last Activity</th>
                <th className="pb-3 pl-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-base-border/70">
              {apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-muted text-xs">
                    No active API keys found. Click "Generate New Key" above to create one.
                  </td>
                </tr>
              ) : (
                apiKeys.map((k) => (
                  <tr key={k.id} className="hover:bg-black/[0.015] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-black/[0.04] text-text-primary">
                          <Key size={13} />
                        </div>
                        <span className="font-medium text-text-primary">{k.name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-0.5 rounded bg-black/[0.03] border border-base-border font-mono text-[11px]">
                          {k.keyPrefix}
                        </code>
                        <button
                          onClick={() => handleCopy(k.keyPrefix, k.id)}
                          title="Copy prefix"
                          className="text-text-faint hover:text-text-primary transition-colors"
                        >
                          {copiedId === k.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-black/[0.05] border border-base-border font-medium text-text-primary">
                        <Lock size={10} className="text-text-faint" />
                        {k.scope || "Full Admin"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-text-muted font-mono text-[11px]">
                      {k.createdAt || "Recent"}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-text-muted text-[11px]">
                        <Clock size={11} className="text-text-faint" />
                        {k.lastUsed || "Never"}
                      </span>
                    </td>

                    <td className="py-3.5 pl-4 text-right">
                      {revokingId === k.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleRevokeConfirm(k.id)}
                            className="px-2 py-1 text-[11px] bg-rose-600 text-white rounded hover:bg-rose-700 font-medium"
                          >
                            Revoke
                          </button>
                          <button
                            onClick={() => setRevokingId(null)}
                            className="px-2 py-1 text-[11px] border border-base-border rounded text-text-muted hover:text-text-primary"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRevokingId(k.id)}
                          className="p-1.5 rounded text-text-faint hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Revoke Key"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Developer SDK Quick Integration Snippets */}
      <div className="panel p-6 bg-white border border-base-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-base-border">
          <div className="flex items-center gap-2">
            <Code2 size={16} className="text-black" />
            <h4 className="font-display font-semibold text-xs text-text-primary">
              Developer Authentication Code Samples
            </h4>
          </div>

          <div className="flex items-center gap-1 bg-black/[0.04] p-1 rounded-md">
            {["curl", "node", "python"].map((tab) => (
              <button
                key={tab}
                onClick={() => setCodeTab(tab)}
                className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                  codeTab === tab
                    ? "bg-white shadow-xs font-semibold text-text-primary"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {tab === "curl" ? "cURL" : tab === "node" ? "Node.js" : "Python"}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-lg bg-zinc-950 p-4 font-mono text-xs text-zinc-100 overflow-x-auto">
          <button
            onClick={() =>
              handleCopy(
                codeTab === "curl" ? curlCode : codeTab === "node" ? nodeCode : pythonCode,
                "snippet"
              )
            }
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white text-[11px] transition-colors"
          >
            {copiedId === "snippet" ? (
              <>
                <Check size={12} className="text-emerald-400" /> Copied
              </>
            ) : (
              <>
                <Copy size={12} /> Copy Code
              </>
            )}
          </button>
          <pre className="leading-relaxed">
            {codeTab === "curl" ? curlCode : codeTab === "node" ? nodeCode : pythonCode}
          </pre>
        </div>
      </div>

      {/* Create Key Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-lg border border-base-border p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 pb-2 border-b border-base-border">
              <Key size={16} className="text-black" />
              <h3 className="font-display font-semibold text-sm">Generate New API Key</h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Key Name / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mobile App Backend, Zapier Automation"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Permission Scope
                </label>
                <select
                  value={newKeyScope}
                  onChange={(e) => setNewKeyScope(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white"
                >
                  <option value="Full Admin">Full Admin (All read/write capabilities)</option>
                  <option value="Ticket Ingest Only">Ticket Ingest Only (Create & update tickets)</option>
                  <option value="Read-Only RAG">Read-Only RAG (Query knowledge base citations)</option>
                </select>
              </div>

              <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 text-amber-800 text-[11px] flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>
                  Never share production keys publicly. Keys will be displayed in plain text exactly once upon generation.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs border border-base-border rounded text-text-muted hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-medium bg-black text-white rounded hover:opacity-85"
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
