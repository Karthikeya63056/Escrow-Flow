import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "../components/shared/Sidebar";
import { Header } from "../components/shared/Header";
import { CommandPalette } from "../components/shared/CommandPalette";
import { AIPanel } from "../components/shared/AIPanel";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import { Router } from "./Router";
import { useUIStore } from "../store";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { motion } from "framer-motion";
import { useEffect } from "react";

function AppShell() {
  const { sidebarOpen, theme } = useUIStore();
  useKeyboardShortcuts();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen mesh-gradient">
      <Sidebar />
      <CommandPalette />
      <AIPanel />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "!bg-surface !text-white !border !border-white/10 !rounded-xl !shadow-xl",
          duration: 3000,
        }}
      />
      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarOpen ? 240 : 72 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen flex flex-col"
      >
        <Header />
        <main className="flex-1 p-6 overflow-x-hidden">
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </main>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
