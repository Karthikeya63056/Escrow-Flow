import { useAuthStore, useUIStore, useNotificationStore } from "../../store";
import { NotificationCenter } from "./NotificationCenter";
import { Bell, Search, Sun, Moon } from "lucide-react";

export function Header() {
  const { user } = useAuthStore();
  const { toggleCommandPalette, toggleNotifications, theme, toggleTheme } = useUIStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount());

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 glass-strong sticky top-0 z-20">
      <button
        onClick={toggleCommandPalette}
        className="flex items-center gap-2 h-9 px-4 rounded-xl bg-surface-2/50 border border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10 transition-all text-sm min-w-[200px]"
      >
        <Search className="w-4 h-4" />
        <span>Search anything...</span>
        <kbd className="ml-auto text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </button>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={toggleNotifications}
            className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-neon text-bg text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationCenter />
        </div>

        {/* User */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10 ml-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon to-neon-purple flex items-center justify-center text-bg text-sm font-bold shadow-[0_0_12px_rgba(0,243,255,0.3)]">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">{user?.name}</p>
            <p className="text-xs text-gray-500 mt-0.5 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
