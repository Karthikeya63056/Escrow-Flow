import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
}

export function formatDate(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export function formatRelative(date) {
  if (!date) return "";
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function shortenAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function getStatusColor(status) {
  const map = {
    created: "text-blue-400 bg-blue-400/10",
    funded: "text-neon bg-neon/10",
    in_progress: "text-yellow-400 bg-yellow-400/10",
    review: "text-purple-400 bg-purple-400/10",
    released: "text-neon-green bg-neon-green/10",
    disputed: "text-danger bg-danger/10",
    refunded: "text-gray-400 bg-gray-400/10",
    pending: "text-gray-400 bg-gray-400/10",
    submitted: "text-yellow-400 bg-yellow-400/10",
    approved: "text-neon-green bg-neon-green/10",
  };
  return map[status] || "text-gray-400 bg-gray-400/10";
}
