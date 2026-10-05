import { useState } from "react";
import {
  FileText,
  UploadCloud,
  Trash2,
  Eye,
  Search,
  CheckCircle2,
  Layers,
  X,
  FileCode,
  File,
} from "lucide-react";

export default function DocumentManager({ documents, onAddDocument, onDeleteDocument }) {
  const [search, setSearch] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocForChunks, setSelectedDocForChunks] = useState(null);

  // Form states
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState("markdown");
  const [docContent, setDocContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!docName.trim()) return;

    setIsSubmitting(true);
    await onAddDocument({
      name: docName.endsWith(`.${docType === "markdown" ? "md" : docType}`)
        ? docName
        : `${docName}.${docType === "markdown" ? "md" : docType}`,
      type: docType,
      content: docContent || "Sample ingested documentation for SupportAI vector context.",
    });

    setDocName("");
    setDocContent("");
    setIsSubmitting(false);
    setShowUploadModal(false);
  };

  const getFileIcon = (type) => {
    if (type === "markdown" || type === "md") return <FileCode size={16} className="text-black" />;
    if (type === "pdf") return <FileText size={16} className="text-rose-600" />;
    return <File size={16} className="text-text-muted" />;
  };

  return (
    <div className="panel p-5 bg-white border border-base-border space-y-4">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-base-border">
        <div>
          <h3 className="font-display font-semibold text-sm">Indexed Files & Documentation</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Uploaded files are chunked, tokenized, and embedded into vector search index.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              type="text"
              placeholder="Search document…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-base-border rounded bg-black/[0.01] focus:outline-none focus:border-black"
            />
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-black text-white rounded hover:opacity-85 transition-opacity whitespace-nowrap"
          >
            <UploadCloud size={14} />
            Ingest Document
          </button>
        </div>
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/[0.02] border-b border-base-border text-text-faint uppercase font-semibold text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Document Name</th>
              <th className="py-2.5 px-3">File Size</th>
              <th className="py-2.5 px-3">Vector Chunks</th>
              <th className="py-2.5 px-3">Tokens</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Last Synced</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-border/50">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-text-muted">
                  No documents found matching search.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-black/[0.03] border border-base-border shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{doc.name}</p>
                        <p className="text-[10px] text-text-faint uppercase">{doc.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-text-muted font-mono">{doc.size}</td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => setSelectedDocForChunks(doc)}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-text-primary px-2 py-0.5 rounded border border-base-border hover:bg-black/[0.04] transition-colors"
                    >
                      <Layers size={12} className="text-text-muted" />
                      {doc.chunksCount} chunks
                    </button>
                  </td>
                  <td className="py-3 px-3 text-text-muted tabular-nums font-mono">
                    {doc.tokensCount?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <CheckCircle2 size={12} />
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-text-faint">{doc.lastSynced}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedDocForChunks(doc)}
                        title="Inspect Vector Chunks"
                        className="p-1.5 border border-base-border rounded hover:bg-black/[0.04] text-text-muted hover:text-black transition-colors"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        title="Delete Document"
                        className="p-1.5 border border-base-border rounded hover:bg-rose-50 text-text-faint hover:text-rose-600 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL: Ingest / Upload Document */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-base-border rounded-card p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-base-border">
              <div className="flex items-center gap-2">
                <UploadCloud size={18} className="text-black" />
                <h4 className="font-display font-semibold text-base">Ingest Knowledge Document</h4>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-text-faint hover:text-black p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. return_and_cancellation_policy.md"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">
                    Document Format
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white"
                  >
                    <option value="markdown">Markdown (.md)</option>
                    <option value="pdf">PDF (.pdf)</option>
                    <option value="text">Plain Text (.txt)</option>
                    <option value="csv">CSV Data (.csv)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-primary mb-1">
                    Chunk Strategy
                  </label>
                  <div className="px-3 py-2 text-xs border border-base-border rounded bg-black/[0.02] text-text-muted">
                    512 Tokens / 15% Overlap
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-primary mb-1">
                  Document Content (or paste raw text)
                </label>
                <textarea
                  rows={5}
                  placeholder="Paste documentation body here to generate vector chunks automatically…"
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-border">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium border border-base-border rounded hover:bg-black/[0.02]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-medium bg-black text-white rounded hover:opacity-85 disabled:opacity-50"
                >
                  {isSubmitting ? "Generating Vectors…" : "Index Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Inspect Vector Chunks */}
      {selectedDocForChunks && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white border border-base-border rounded-card shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-base-border shrink-0">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-black" />
                <div>
                  <h4 className="font-display font-semibold text-sm">
                    Vector Chunks: {selectedDocForChunks.name}
                  </h4>
                  <p className="text-xs text-text-faint">
                    {selectedDocForChunks.chunks?.length || 0} chunk(s) · {selectedDocForChunks.tokensCount} total tokens
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocForChunks(null)}
                className="text-text-faint hover:text-black p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chunks List */}
            <div className="p-5 overflow-y-auto space-y-3 flex-1">
              {(selectedDocForChunks.chunks || []).map((chunk, idx) => (
                <div
                  key={chunk.id || idx}
                  className="p-3.5 rounded border border-base-border bg-black/[0.015] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-[11px] bg-black text-white px-2 py-0.5 rounded">
                      Chunk #{chunk.chunkIndex || idx + 1}
                    </span>
                    <span className="font-mono text-text-faint text-[11px]">
                      {chunk.tokens} tokens · ID: {chunk.id}
                    </span>
                  </div>
                  <p className="text-xs text-text-primary leading-relaxed bg-white p-3 rounded border border-base-border/70 font-mono">
                    {chunk.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-base-border bg-black/[0.01] flex justify-end shrink-0">
              <button
                onClick={() => setSelectedDocForChunks(null)}
                className="px-4 py-1.5 text-xs font-medium bg-black text-white rounded hover:opacity-85"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
