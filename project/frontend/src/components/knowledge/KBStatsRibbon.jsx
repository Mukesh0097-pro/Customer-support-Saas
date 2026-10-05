import { Database, Layers, Cpu, Zap, RefreshCw } from "lucide-react";

export default function KBStatsRibbon({ stats, onReindex, isReindexing }) {
  if (!stats) return null;

  return (
    <div className="panel p-4 bg-black/[0.015] border border-base-border mb-6">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        {/* Left Badge */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-black text-white flex items-center justify-center shrink-0">
            <Database size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-semibold text-sm">RAG Knowledge Core</h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {stats.vectorIndexHealth || "100% Synced"}
              </span>
            </div>
            <p className="text-xs text-text-muted mt-0.5">
              Vector dimension: 1536 · Embeddings: text-embedding-3-small
            </p>
          </div>
        </div>

        {/* Center: Metric tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 px-3 rounded-md bg-white border border-base-border/80">
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-text-faint shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-faint font-medium">Data Sources</p>
              <p className="font-display tabular-nums text-xs font-bold text-text-primary">
                {stats.totalSources ?? 0} Ingested
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-base-border/60 pl-3">
            <Database size={14} className="text-text-faint shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-faint font-medium">Vector Chunks</p>
              <p className="font-display tabular-nums text-xs font-bold text-text-primary">
                {stats.totalChunks ?? 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-base-border/60 pl-3">
            <Cpu size={14} className="text-text-faint shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-faint font-medium">Indexed Tokens</p>
              <p className="font-display tabular-nums text-xs font-bold text-text-primary">
                {(stats.totalTokens || 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-base-border/60 pl-3">
            <Zap size={14} className="text-text-faint shrink-0" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-faint font-medium">Retrieval Latency</p>
              <p className="font-display tabular-nums text-xs font-bold text-emerald-600">
                {stats.avgLatency || "35 ms"}
              </p>
            </div>
          </div>
        </div>

        {/* Right Re-index button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReindex}
            disabled={isReindexing}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-base-border rounded bg-white hover:bg-black/[0.03] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={13} className={isReindexing ? "animate-spin text-black" : "text-text-muted"} />
            {isReindexing ? "Re-indexing Vectors…" : "Sync & Re-index"}
          </button>
        </div>
      </div>
    </div>
  );
}
