import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { navItems } from "../constants/navItems";
import { getMe } from "../services/authService";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await getMe();
      if (data?.user) {
        setUser(data.user);
      }
    } catch (err) {
      // Guest or session not yet loaded
    }
  };

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-screen sticky top-0 border-r border-base-border bg-base-panel px-4 py-5">
      <div
        className="flex items-center gap-2.5 px-2 mb-8 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        <div className="h-7 w-7 rounded-md bg-black flex items-center justify-center">
          <span className="text-white font-bold text-xs">S</span>
        </div>
        <span className="font-display font-semibold tracking-tight">SupportAI</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {navItems.map(({ key, label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={`w-full group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-black/[0.06] text-text-primary font-medium"
                  : "text-text-muted hover:bg-black/[0.03] hover:text-text-primary"
              }`}
            >
              <Icon
                size={16}
                className={
                  isActive
                    ? "text-text-primary"
                    : "text-text-faint group-hover:text-text-primary transition-colors"
                }
              />
              {label}
              {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-black" />}
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="mt-4 panel p-3 flex items-center gap-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name || "User"}
              className="h-8 w-8 shrink-0 rounded-full border border-base-border object-cover"
            />
          ) : (
            <div className="h-8 w-8 shrink-0 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name || "Agent"}</p>
            <p className="text-xs text-text-faint truncate">{user.email || "Support Team"}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
