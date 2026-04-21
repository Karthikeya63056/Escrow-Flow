/**
 * Plugin System — Extensible architecture for third-party integrations.
 */
import { create } from "zustand";

export const AVAILABLE_PLUGINS = [
  {
    id: "github-verify",
    name: "GitHub Verification",
    description: "Verify seller identity via GitHub account. Validates code contributions and account age.",
    icon: "🔗",
    category: "Verification",
    author: "EscrowFlow",
    version: "1.2.0",
    installed: true,
    enabled: true,
    config: { minAccountAge: 90, minRepos: 5 },
  },
  {
    id: "stripe-payments",
    name: "Stripe Payments",
    description: "Process escrow payments via Stripe. Supports cards, ACH, and wire transfers.",
    icon: "💳",
    category: "Payments",
    author: "EscrowFlow",
    version: "2.0.1",
    installed: true,
    enabled: true,
    config: { testMode: true },
  },
  {
    id: "kyc-verify",
    name: "KYC Identity Check",
    description: "Automated identity verification using government IDs and biometric checks.",
    icon: "🪪",
    category: "Verification",
    author: "TrustLayer",
    version: "3.1.0",
    installed: true,
    enabled: false,
    config: {},
  },
  {
    id: "ai-risk",
    name: "AI Risk Analyzer",
    description: "Machine learning model that predicts dispute probability and flags risky contracts.",
    icon: "🤖",
    category: "AI",
    author: "EscrowFlow",
    version: "1.0.0",
    installed: true,
    enabled: true,
    config: { sensitivityLevel: "medium" },
  },
  {
    id: "slack-notify",
    name: "Slack Notifications",
    description: "Get escrow updates in your Slack workspace. Supports channels and DMs.",
    icon: "📢",
    category: "Integrations",
    author: "Community",
    version: "1.4.0",
    installed: false,
    enabled: false,
    config: {},
  },
  {
    id: "crypto-escrow",
    name: "Crypto Payments",
    description: "Enable escrow payments in ETH, BTC, USDC via smart contracts on Ethereum and Polygon.",
    icon: "₿",
    category: "Payments",
    author: "Web3Labs",
    version: "0.9.0",
    installed: false,
    enabled: false,
    config: {},
  },
];

export const usePluginStore = create((set, get) => ({
  plugins: AVAILABLE_PLUGINS,

  getPlugin: (id) => get().plugins.find((p) => p.id === id),
  getEnabled: () => get().plugins.filter((p) => p.installed && p.enabled),
  getByCategory: (cat) => get().plugins.filter((p) => p.category === cat),

  togglePlugin: (id) =>
    set((s) => ({
      plugins: s.plugins.map((p) =>
        p.id === id && p.installed ? { ...p, enabled: !p.enabled } : p
      ),
    })),

  installPlugin: (id) =>
    set((s) => ({
      plugins: s.plugins.map((p) =>
        p.id === id ? { ...p, installed: true, enabled: true } : p
      ),
    })),

  uninstallPlugin: (id) =>
    set((s) => ({
      plugins: s.plugins.map((p) =>
        p.id === id ? { ...p, installed: false, enabled: false } : p
      ),
    })),
}));
