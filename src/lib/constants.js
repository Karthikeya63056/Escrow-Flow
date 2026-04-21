// Escrow lifecycle states
export const ESCROW_STATES = {
  CREATED: "created",
  FUNDED: "funded",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  RELEASED: "released",
  DISPUTED: "disputed",
  REFUNDED: "refunded",
};

export const ESCROW_STATE_FLOW = ["created", "funded", "in_progress", "review", "released"];

export const MILESTONE_STATES = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const USER_ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  ARBITRATOR: "arbitrator",
  ADMIN: "admin",
};

export const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "Graphic Design",
  "Smart Contracts",
  "Content Writing",
  "Consulting",
  "Video Production",
  "Data Science",
  "DevOps",
  "QA Testing",
];

export const RISK_LEVELS = {
  LOW: { label: "Low", max: 20, color: "text-neon-green", bg: "bg-neon-green/10" },
  MEDIUM: { label: "Medium", max: 40, color: "text-warning", bg: "bg-warning/10" },
  HIGH: { label: "High", max: 100, color: "text-danger", bg: "bg-danger/10" },
};

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "ETH", symbol: "Ξ", name: "Ethereum" },
  { code: "BTC", symbol: "₿", name: "Bitcoin" },
];

export const KEYBOARD_SHORTCUTS = {
  COMMAND_PALETTE: { key: "k", meta: true, label: "Command Palette" },
  AI_PANEL: { key: "j", meta: true, label: "AI Copilot" },
  NEW_ESCROW: { key: "n", meta: true, label: "New Escrow" },
  SEARCH: { key: "/", meta: false, label: "Search" },
};
