import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { getMe, logout } from "../services/authService";

export default function TopNav() {
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
      // Not signed in or guest
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-base-border bg-base-bg/95 backdrop-blur-sm">
      <div className="h-16 px-5 lg:px-8 flex items-center justify-between gap-4">
        {/* Workspace Brand / Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
            </span>
            <span className="text-xs font-medium text-emerald-700">AI Support Agent Active</span>
          </div>
        </div>

        {/* Right: Authenticated User & Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-base-border">
              <div className="flex items-center gap-2.5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full border border-base-border object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
                    {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium text-text-primary leading-tight">
                    {user.name || "Agent"}
                  </p>
                  <p className="text-[10px] text-text-faint truncate max-w-[140px]">
                    {user.email || ""}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 rounded-md border border-base-border text-text-muted hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition-colors ml-1"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => (window.location.href = "/login")}
              className="text-xs font-medium px-3 py-1.5 rounded border border-base-border hover:bg-black hover:text-white transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
