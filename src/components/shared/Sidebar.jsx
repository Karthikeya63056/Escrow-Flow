import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useUIStore } from "../../store";
import {
  LayoutDashboard, FileText, PlusCircle, Shield, User,
  ChevronLeft, ChevronRight, Sparkles, Search, Globe,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/explore", icon: Globe, label: "Explorer" },
  { to: "/create", icon: PlusCircle, label: "New Escrow" },
  { to: "/disputes", icon: Shield, label: "Disputes" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar, toggleCommandPalette, toggleAIPanel } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 72 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 bottom-0 z-30 glass-strong flex flex-col border-r border-white/5"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon to-neon-purple flex items-center justify-center flex-shrink-0">
          <span className="text-bg font-black text-lg">E</span>
        </div>
        {sidebarOpen && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold neon-text whitespace-nowrap"
          >
            EscrowFlow
          </motion.span>
        )}
      </div>

      {/* Quick actions */}
      <div className="px-3 py-4 space-y-1">
        <button
          onClick={toggleCommandPalette}
          className="w-full flex items-center gap-3 px-3 h-9 rounded-xl text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all text-sm"
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          {sidebarOpen && <span>Search...</span>}
          {sidebarOpen && <kbd className="ml-auto text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded">⌘K</kbd>}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 h-10 rounded-xl transition-all text-sm font-medium ${
                isActive
                  ? "bg-neon/10 text-neon shadow-[0_0_10px_rgba(0,243,255,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{label}</motion.span>}
          </NavLink>
        ))}
      </nav>

      {/* AI Button */}
      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={toggleAIPanel}
          className="w-full flex items-center gap-3 px-3 h-10 rounded-xl text-neon-purple hover:bg-neon-purple/10 transition-all text-sm font-medium"
        >
          <Sparkles className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>AI Assistant</span>}
        </button>
      </div>

      {/* Collapse */}
      <div className="px-3 pb-4">
        <button onClick={toggleSidebar} className="w-full flex items-center justify-center h-8 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all">
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
