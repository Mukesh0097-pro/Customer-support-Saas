import { navItems } from "../constants/navItems";

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 border-r border-base-border bg-base-panel px-4 py-5">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="h-7 w-7 rounded-md bg-black flex items-center justify-center">
          <span className="text-white font-bold text-xs">S</span>
        </div>
        <span className="font-display font-semibold tracking-tight">SupportAI</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {navItems.map(({ key, label, icon: Icon, active }) => (
          <button
            key={key}
            className={`w-full group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
              ${active
                  ? "bg-black/[0.06] text-text-primary"
                  : "text-text-muted hover:bg-black/[0.03] hover:text-text-primary"
              }`}
          >
              <Icon size={16} className={active ? "text-text-primary" : "text-text-faint group-hover:text-text-primary transition-colors"} />
            {label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-black" />}
          </button>
        ))}
      </nav>

      <div className="mt-4 panel p-3 flex items-center gap-3">
        <div className="h-8 w-8 shrink-0 rounded-full bg-white text-black flex items-center justify-center text-xs font-semibold">
          MK
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">Mukesh</p>
          <p className="text-xs text-text-faint truncate">Workspace Admin</p>
        </div>
      </div>
    </aside>
  );
}
