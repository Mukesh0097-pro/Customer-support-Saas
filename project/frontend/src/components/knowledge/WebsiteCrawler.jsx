import { useState } from "react";
import { Globe, Plus, Trash2, ExternalLink, CheckCircle2, RefreshCw } from "lucide-react";

export default function WebsiteCrawler({ urls, onAddUrl, onDeleteUrl }) {
  const [targetUrl, setTargetUrl] = useState("");
  const [crawlDepth, setCrawlDepth] = useState("2");
  const [syncFreq, setSyncFreq] = useState("Daily");
  const [isCrawling, setIsCrawling] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) return;

    setIsCrawling(true);
    await onAddUrl({
      url: targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`,
      depth: crawlDepth,
      syncFrequency: syncFreq,
    });

    setTargetUrl("");
    setIsCrawling(false);
  };

  return (
    <div className="panel p-5 bg-white border border-base-border space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-base-border">
        <div>
          <h3 className="font-display font-semibold text-sm">Website & Documentation Crawler</h3>
          <p className="text-xs text-text-muted mt-0.5">
            Automatically crawl help centers, product docs, and sitemaps on a recurring schedule.
          </p>
        </div>
      </div>

      {/* URL Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-4 rounded border border-base-border bg-black/[0.015] grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
      >
        <div className="md:col-span-6">
          <label className="block text-xs font-medium text-text-primary mb-1">
            Target Documentation URL or Domain
          </label>
          <div className="relative">
            <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" />
            <input
              type="text"
              required
              placeholder="e.g. https://docs.yourcompany.com"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-text-primary mb-1">
            Crawl Depth
          </label>
          <select
            value={crawlDepth}
            onChange={(e) => setCrawlDepth(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white"
          >
            <option value="1">1 (Single Page)</option>
            <option value="2">2 (Subpaths)</option>
            <option value="3">3 (Full Domain)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-text-primary mb-1">
            Auto-Sync
          </label>
          <select
            value={syncFreq}
            onChange={(e) => setSyncFreq(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-base-border rounded focus:outline-none focus:border-black bg-white"
          >
            <option value="Hourly">Hourly</option>
            <option value="Every 6 hours">Every 6 hrs</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isCrawling}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-black text-white rounded hover:opacity-85 disabled:opacity-50 transition-opacity"
          >
            {isCrawling ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                Crawling…
              </>
            ) : (
              <>
                <Plus size={14} />
                Add URL
              </>
            )}
          </button>
        </div>
      </form>

      {/* Crawled URLs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-black/[0.02] border-b border-base-border text-text-faint uppercase font-semibold text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Target URL</th>
              <th className="py-2.5 px-3">Crawl Depth</th>
              <th className="py-2.5 px-3">Pages Indexed</th>
              <th className="py-2.5 px-3">Sync Schedule</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Last Synced</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-border/50">
            {urls.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-text-muted">
                  No active web crawlers configured.
                </td>
              </tr>
            ) : (
              urls.map((u) => (
                <tr key={u.id} className="hover:bg-black/[0.01] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-text-muted shrink-0" />
                      <a
                        href={u.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-text-primary hover:underline flex items-center gap-1"
                      >
                        {u.url}
                        <ExternalLink size={11} className="text-text-faint" />
                      </a>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono">Depth {u.depth}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-medium">{u.pagesIndexed} pages</span>
                  </td>
                  <td className="py-3 px-3 text-text-muted">{u.syncFrequency}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                      <CheckCircle2 size={12} />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-text-faint">{u.lastSynced}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onDeleteUrl(u.id)}
                      title="Remove Web Target"
                      className="p-1.5 border border-base-border rounded hover:bg-rose-50 text-text-faint hover:text-rose-600 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
