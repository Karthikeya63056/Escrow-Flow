import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../store";

/**
 * Global keyboard shortcuts hook.
 * Mount once at the App level.
 */
export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { toggleCommandPalette, toggleAIPanel } = useUIStore();

  useEffect(() => {
    function handleKeyDown(e) {
      const meta = e.metaKey || e.ctrlKey;
      const target = e.target;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // Ctrl+K → Command Palette (always works)
      if (meta && e.key === "k") {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // Ctrl+J → AI Panel
      if (meta && e.key === "j") {
        e.preventDefault();
        toggleAIPanel();
        return;
      }

      // Don't trigger shortcuts when typing in inputs
      if (isInput) return;

      // Ctrl+N → New Escrow
      if (meta && e.key === "n") {
        e.preventDefault();
        navigate("/create");
        return;
      }

      // "/" → Focus search (triggers Command Palette)
      if (e.key === "/" && !meta) {
        e.preventDefault();
        toggleCommandPalette();
        return;
      }

      // "g" then "d" → Go to Dashboard (vim-style)
      // "g" then "e" → Go to Explorer
      // "g" then "p" → Go to Profile
      // Escape → Close all panels
      if (e.key === "Escape") {
        useUIStore.getState().setCommandPaletteOpen(false);
        useUIStore.getState().setAIPanelOpen(false);
        useUIStore.getState().setNotificationsOpen(false);
        return;
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, toggleCommandPalette, toggleAIPanel]);
}
