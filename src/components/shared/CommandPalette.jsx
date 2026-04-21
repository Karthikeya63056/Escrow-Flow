import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore, useEscrowStore } from "../../store";
import { AnimatePresence, motion } from "framer-motion";
import { Search, FileText, PlusCircle, Shield, User, LayoutDashboard, Sparkles, X } from "lucide-react";

const staticCommands = [
  { id: "dash", label: "Go to Dashboard", icon: LayoutDashboard, action: "/" },
  { id: "create", label: "Create New Escrow", icon: PlusCircle, action: "/create" },
  { id: "disputes", label: "Open Disputes", icon: Shield, action: "/disputes" },
  { id: "profile", label: "View Profile", icon: User, action: "/profile" },
  { id: "ai", label: "Open AI Assistant", icon: Sparkles, action: "ai" },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, setAIPanelOpen } = useUIStore();
  const { escrows } = useEscrowStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const close = useCallback(() => { setCommandPaletteOpen(false); setQuery(""); }, [setCommandPaletteOpen]);

  const run = useCallback((cmd) => {
    close();
    if (cmd.action === "ai") { setAIPanelOpen(true); return; }
    navigate(cmd.action);
  }, [close, navigate, setAIPanelOpen]);

  const escrowResults = escrows
    .filter((e) => e.title.toLowerCase().includes(query.toLowerCase()))
    .map((e) => ({ id: e.id, label: e.title, icon: FileText, action: `/escrows/${e.id}` }));

  const allResults = [
    ...staticCommands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    ...escrowResults,
  ];

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[60] w-full max-w-xl"
          >
            <div className="glass-strong rounded-2xl shadow-2xl overflow-hidden border border-white/10">
              <div className="flex items-center gap-3 px-4 h-14 border-b border-white/5">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  autoFocus
                  placeholder="Search escrows, navigate, or run commands..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 focus:outline-none"
                />
                <button onClick={close} className="text-gray-500 hover:text-gray-300 p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-2">
                {allResults.length === 0 ? (
                  <p className="text-center text-gray-500 text-sm py-8">No results found</p>
                ) : (
                  allResults.map((cmd) => {
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => run(cmd)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <Icon className="w-4 h-4 text-gray-500" />
                        <span>{cmd.label}</span>
                      </button>
                    );
                  })
                )}
              </div>
              <div className="px-4 py-2 border-t border-white/5 flex items-center gap-4 text-[10px] text-gray-600">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>Esc Close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
