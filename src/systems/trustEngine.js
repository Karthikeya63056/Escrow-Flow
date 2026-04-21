/**
 * Trust Engine — Reputation scoring, trust graph, and risk assessment.
 * Every user action feeds into a trust score that compounds over time.
 */
import { create } from "zustand";

const TRUST_WEIGHTS = {
  escrow_completed: 15,
  escrow_funded_on_time: 5,
  milestone_approved_on_time: 8,
  dispute_lost: -20,
  dispute_won: 3,
  dispute_settled: -5,
  fast_response: 3,
  slow_response: -2,
  counterpart_rating: 10, // multiplied by rating (0-1)
};

function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

export const useTrustStore = create((set, get) => ({
  users: {
    "user-1": {
      id: "user-1", name: "Alex Morgan", avatar: null,
      trustScore: 92, level: "platinum",
      stats: { completed: 14, disputed: 1, funded: 18, totalVolume: 142000, avgResponseTime: 2.4 },
      history: [
        { event: "escrow_completed", delta: +15, score: 92, at: new Date(Date.now() - 7 * 86400000).toISOString(), detail: "Smart Contract Audit" },
        { event: "milestone_approved_on_time", delta: +8, score: 77, at: new Date(Date.now() - 14 * 86400000).toISOString(), detail: "Articles 1-3 approved" },
        { event: "escrow_funded_on_time", delta: +5, score: 69, at: new Date(Date.now() - 20 * 86400000).toISOString(), detail: "Mobile App MVP funded" },
        { event: "fast_response", delta: +3, score: 64, at: new Date(Date.now() - 25 * 86400000).toISOString(), detail: "Responded within 2 hours" },
      ],
      ratings: [
        { by: "Sarah Chen", score: 5, comment: "Excellent buyer. Clear requirements and fast approvals.", at: new Date(Date.now() - 8 * 86400000).toISOString() },
        { by: "DeFi Labs", score: 5, comment: "Thorough audit work. Highly recommend.", at: new Date(Date.now() - 30 * 86400000).toISOString() },
        { by: "Priya Sharma", score: 4, comment: "Good to work with. Sometimes slow on reviews.", at: new Date(Date.now() - 45 * 86400000).toISOString() },
      ],
      badges: ["early_adopter", "high_volume", "zero_disputes_streak", "fast_payer"],
      verified: true,
    },
    "user-2": {
      id: "user-2", name: "Sarah Chen", avatar: null,
      trustScore: 88, level: "gold",
      stats: { completed: 11, disputed: 0, funded: 0, totalVolume: 95000, avgResponseTime: 4.1 },
      history: [],
      ratings: [{ by: "Alex Morgan", score: 5, comment: "Incredible developer. Delivers beyond expectations.", at: new Date(Date.now() - 5 * 86400000).toISOString() }],
      badges: ["top_seller", "zero_disputes"],
      verified: true,
    },
    "user-3": {
      id: "user-3", name: "Mike Torres", avatar: null,
      trustScore: 95, level: "platinum",
      stats: { completed: 0, disputed: 0, funded: 0, totalVolume: 0, avgResponseTime: 1.2 },
      history: [],
      ratings: [],
      badges: ["certified_arbitrator", "fast_resolver"],
      verified: true,
    },
    "user-4": {
      id: "user-4", name: "Priya Sharma", avatar: null,
      trustScore: 72, level: "silver",
      stats: { completed: 6, disputed: 2, funded: 0, totalVolume: 48000, avgResponseTime: 8.5 },
      history: [],
      ratings: [],
      badges: [],
      verified: false,
    },
  },

  getUser: (id) => get().users[id] || null,

  getTrustLevel: (score) => {
    if (score >= 90) return { level: "platinum", color: "text-neon", bg: "bg-neon/10", border: "border-neon/30", label: "Platinum" };
    if (score >= 75) return { level: "gold", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", label: "Gold" };
    if (score >= 50) return { level: "silver", color: "text-gray-300", bg: "bg-gray-300/10", border: "border-gray-300/30", label: "Silver" };
    return { level: "bronze", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/30", label: "Bronze" };
  },

  getRiskAssessment: (userId) => {
    const user = get().getUser(userId);
    if (!user) return { risk: "unknown", score: 50, factors: [] };
    const factors = [];
    if (user.trustScore < 50) factors.push({ type: "danger", text: "Low trust score" });
    if (user.stats.disputed > 2) factors.push({ type: "danger", text: "Multiple disputes" });
    if (!user.verified) factors.push({ type: "warning", text: "Unverified identity" });
    if (user.stats.avgResponseTime > 8) factors.push({ type: "warning", text: "Slow response time" });
    if (user.stats.completed > 10) factors.push({ type: "success", text: "Experienced user" });
    if (user.badges.includes("zero_disputes")) factors.push({ type: "success", text: "Zero disputes" });
    const riskScore = clamp(100 - user.trustScore, 0, 100);
    return { risk: riskScore > 40 ? "high" : riskScore > 20 ? "medium" : "low", score: riskScore, factors };
  },

  updateTrust: (userId, event, detail) => {
    const delta = TRUST_WEIGHTS[event] || 0;
    set((s) => ({
      users: {
        ...s.users,
        [userId]: s.users[userId] ? {
          ...s.users[userId],
          trustScore: clamp(s.users[userId].trustScore + delta, 0, 100),
          history: [{ event, delta, score: clamp(s.users[userId].trustScore + delta, 0, 100), at: new Date().toISOString(), detail }, ...s.users[userId].history],
        } : s.users[userId],
      },
    }));
  },

  addRating: (userId, by, score, comment) => {
    set((s) => ({
      users: {
        ...s.users,
        [userId]: s.users[userId] ? {
          ...s.users[userId],
          ratings: [{ by, score, comment, at: new Date().toISOString() }, ...s.users[userId].ratings],
        } : s.users[userId],
      },
    }));
  },
}));

export const BADGE_META = {
  early_adopter: { label: "Early Adopter", icon: "🚀", color: "text-neon-purple" },
  high_volume: { label: "High Volume", icon: "💎", color: "text-neon" },
  zero_disputes_streak: { label: "Zero Disputes", icon: "🛡️", color: "text-neon-green" },
  fast_payer: { label: "Fast Payer", icon: "⚡", color: "text-yellow-400" },
  top_seller: { label: "Top Seller", icon: "🏆", color: "text-yellow-400" },
  zero_disputes: { label: "Clean Record", icon: "✅", color: "text-neon-green" },
  certified_arbitrator: { label: "Certified Arbitrator", icon: "⚖️", color: "text-neon" },
  fast_resolver: { label: "Fast Resolver", icon: "🔥", color: "text-orange-400" },
};
