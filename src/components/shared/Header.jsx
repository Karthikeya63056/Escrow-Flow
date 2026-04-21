import { useAuthStore, useUIStore } from "../../store";
import { Bell, Search } from "lucide-react";

export function Header() {
  const { user } = useAuthStore();
  const { toggleCommandPalette } = useUIStore();

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

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-neon animate-pulse" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon to-neon-purple flex items-center justify-center text-bg text-sm font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white leading-none">{user?.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
