import { Search, Bell, ChevronDown } from "lucide-react";

export default function TopNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-base-border bg-base-bg/90 backdrop-blur-sm">
      <div className="h-16 px-5 lg:px-8 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-faint" />
          <input
            type="text"
            placeholder="Search conversations, docs, customers…"
            className="w-full rounded-md bg-black/[0.02] border border-base-border pl-10 pr-4 py-2 text-sm placeholder:text-text-faint focus:border-black/30 outline-none transition-colors"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-md border border-base-border px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-black animate-pulse-ring" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black" />
            </span>
            <span className="text-xs font-medium text-text-muted">AI Online</span>
          </div>

          <button className="hidden md:flex items-center gap-2 rounded-md border border-base-border px-3 py-1.5 text-xs font-medium hover:bg-black/[0.03] transition-colors">
            Acme Inc.
            <ChevronDown size={14} className="text-text-faint" />
          </button>

          <button className="relative h-9 w-9 rounded-md border border-base-border flex items-center justify-center hover:bg-black/[0.03] transition-colors">
            <Bell size={16} className="text-text-muted" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-black" />
          </button>

          <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold cursor-pointer">
            MK
          </div>
        </div>
      </div>
    </header>
  );
}
