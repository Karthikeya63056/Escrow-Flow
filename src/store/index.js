import { create } from "zustand";
import { persist } from "zustand/middleware";
import { emit, EventTypes } from "../event-engine/eventBus";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: {
        id: "user-1",
        email: "alex@escrowflow.com",
        name: "Alex Morgan",
        avatar: null,
        role: "buyer",
        permissions: ["create_escrow", "fund_escrow", "approve_milestone", "open_dispute"],
      },
      isAuthenticated: true,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      hasPermission: (perm) => {
        const state = useAuthStore.getState();
        return state.user?.permissions?.includes(perm) ?? false;
      },
    }),
    { name: "escrowflow-auth" }
  )
);

export const useUIStore = create(
  persist(
    (set) => ({
      sidebarOpen: true,
      commandPaletteOpen: false,
      aiPanelOpen: false,
      notificationsOpen: false,
      theme: "dark",
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      toggleCommandPalette: () => set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
      toggleAIPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
      setAIPanelOpen: (open) => set({ aiPanelOpen: open }),
      toggleNotifications: () => set((s) => ({ notificationsOpen: !s.notificationsOpen })),
      setNotificationsOpen: (open) => set({ notificationsOpen: open }),
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },
      toggleTheme: () =>
        set((s) => {
          const next = s.theme === "dark" ? "light" : "dark";
          document.documentElement.setAttribute("data-theme", next);
          return { theme: next };
        }),
    }),
    { name: "escrowflow-ui", partialize: (s) => ({ theme: s.theme, sidebarOpen: s.sidebarOpen }) }
  )
);

export const useNotificationStore = create((set, get) => ({
  notifications: [
    { id: "n1", type: "success", title: "Milestone Approved", message: "Wireframes & Design System milestone has been approved", read: false, time: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: "n2", type: "info", title: "New Proposal", message: "Sarah Chen submitted work for Frontend Development", read: false, time: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: "n3", type: "warning", title: "Escrow Expiring", message: "Brand Identity Package escrow expires in 3 days", read: false, time: new Date(Date.now() - 24 * 3600000).toISOString() },
    { id: "n4", type: "success", title: "Escrow Funded", message: "$25,000 locked for Mobile App MVP", read: true, time: new Date(Date.now() - 48 * 3600000).toISOString() },
    { id: "n5", type: "danger", title: "Dispute Filed", message: "A dispute was raised for E-Commerce Platform", read: true, time: new Date(Date.now() - 72 * 3600000).toISOString() },
  ],
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
  addNotification: (notif) =>
    set((s) => ({
      notifications: [{ ...notif, id: `n-${Date.now()}`, read: false, time: new Date().toISOString() }, ...s.notifications],
    })),
  markAsRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    })),
  dismiss: (id) =>
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
}));

export const useEscrowStore = create((set, get) => ({
  escrows: [
    {
      id: "esc-001", title: "E-Commerce Platform Redesign",
      description: "Complete redesign of the storefront with modern UI, payment integration, and admin dashboard.",
      buyer: { id: "user-1", name: "Alex Morgan" }, seller: { id: "user-2", name: "Sarah Chen" }, arbitrator: { id: "user-3", name: "Mike Torres" }, observers: [],
      amount: 12500, funded: 12500, released: 3750, streamed: 0, status: "in_progress", category: "Web Development", riskScore: 12,
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(), deadline: new Date(Date.now() + 30 * 86400000).toISOString(),
      isPublic: true, tags: ["React", "E-Commerce", "UI/UX"], streamingEnabled: false,
      milestones: [
        { id: "m1", title: "Wireframes & Design System", amount: 3750, status: "approved", completedAt: new Date(Date.now() - 2 * 86400000).toISOString() },
        { id: "m2", title: "Frontend Development", amount: 5000, status: "submitted", completedAt: null },
        { id: "m3", title: "Backend Integration & QA", amount: 3750, status: "pending", completedAt: null },
      ],
      history: [
        { action: "created", by: "Alex Morgan", at: new Date(Date.now() - 7 * 86400000).toISOString() },
        { action: "funded", by: "Alex Morgan", at: new Date(Date.now() - 6 * 86400000).toISOString(), detail: "$12,500 locked" },
        { action: "milestone_approved", by: "Alex Morgan", at: new Date(Date.now() - 2 * 86400000).toISOString(), detail: "Wireframes & Design System — $3,750 released" },
        { action: "milestone_submitted", by: "Sarah Chen", at: new Date(Date.now() - 5 * 3600000).toISOString(), detail: "Frontend Development submitted for review" },
      ],
    },
    {
      id: "esc-002", title: "Mobile App MVP (iOS + Android)",
      description: "Cross-platform mobile app for fitness tracking with social features, gamification, and wearable sync.",
      buyer: { id: "user-1", name: "Alex Morgan" }, seller: { id: "user-4", name: "Priya Sharma" }, arbitrator: null, observers: [],
      amount: 25000, funded: 25000, released: 0, streamed: 0, status: "funded", category: "Mobile Development", riskScore: 28,
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), deadline: new Date(Date.now() + 60 * 86400000).toISOString(),
      isPublic: false, tags: ["React Native", "Mobile", "Fitness"], streamingEnabled: true,
      milestones: [
        { id: "m4", title: "UI/UX Design", amount: 5000, status: "pending", completedAt: null },
        { id: "m5", title: "Core Features", amount: 12000, status: "pending", completedAt: null },
        { id: "m6", title: "Testing & Launch", amount: 8000, status: "pending", completedAt: null },
      ],
      history: [
        { action: "created", by: "Alex Morgan", at: new Date(Date.now() - 2 * 86400000).toISOString() },
        { action: "funded", by: "Alex Morgan", at: new Date(Date.now() - 2 * 86400000).toISOString(), detail: "$25,000 locked" },
      ],
    },
    {
      id: "esc-003", title: "Smart Contract Audit",
      description: "Full security audit of DeFi protocol smart contracts on Ethereum including gas optimization study.",
      buyer: { id: "user-5", name: "DeFi Labs" }, seller: { id: "user-1", name: "Alex Morgan" }, arbitrator: { id: "user-3", name: "Mike Torres" }, observers: [{ id: "user-8", name: "InvestorDAO" }],
      amount: 8000, funded: 8000, released: 8000, streamed: 0, status: "released", category: "Smart Contracts", riskScore: 5,
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(), deadline: new Date(Date.now() - 5 * 86400000).toISOString(),
      isPublic: true, tags: ["Solidity", "Security", "Audit"], streamingEnabled: false,
      milestones: [
        { id: "m7", title: "Initial Review", amount: 3000, status: "approved", completedAt: new Date(Date.now() - 15 * 86400000).toISOString() },
        { id: "m8", title: "Deep Audit + Report", amount: 5000, status: "approved", completedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
      ],
      history: [
        { action: "created", by: "DeFi Labs", at: new Date(Date.now() - 30 * 86400000).toISOString() },
        { action: "funded", by: "DeFi Labs", at: new Date(Date.now() - 29 * 86400000).toISOString(), detail: "$8,000 locked" },
        { action: "milestone_approved", by: "DeFi Labs", at: new Date(Date.now() - 15 * 86400000).toISOString(), detail: "Initial Review — $3,000 released" },
        { action: "milestone_approved", by: "DeFi Labs", at: new Date(Date.now() - 7 * 86400000).toISOString(), detail: "Deep Audit + Report — $5,000 released" },
        { action: "completed", by: "System", at: new Date(Date.now() - 7 * 86400000).toISOString(), detail: "All funds released. Escrow complete." },
      ],
    },
    {
      id: "esc-004", title: "Brand Identity Package",
      description: "Logo, color palette, typography, and brand guidelines for tech startup. Includes social media kit.",
      buyer: { id: "user-1", name: "Alex Morgan" }, seller: { id: "user-6", name: "Luna Design Co" }, arbitrator: null, observers: [],
      amount: 3500, funded: 0, released: 0, streamed: 0, status: "created", category: "Graphic Design", riskScore: 45,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), deadline: new Date(Date.now() + 14 * 86400000).toISOString(),
      isPublic: false, tags: ["Branding", "Logo", "Design"], streamingEnabled: false,
      milestones: [
        { id: "m9", title: "Concept Exploration", amount: 1500, status: "pending", completedAt: null },
        { id: "m10", title: "Final Deliverables", amount: 2000, status: "pending", completedAt: null },
      ],
      history: [{ action: "created", by: "Alex Morgan", at: new Date(Date.now() - 1 * 86400000).toISOString() }],
    },
    {
      id: "esc-005", title: "Technical Blog Content Series",
      description: "10 in-depth technical articles on React, Node.js, and cloud architecture with code examples.",
      buyer: { id: "user-1", name: "Alex Morgan" }, seller: { id: "user-7", name: "DevWriter Pro" }, arbitrator: { id: "user-3", name: "Mike Torres" }, observers: [],
      amount: 4500, funded: 4500, released: 1500, streamed: 0, status: "in_progress", category: "Content Writing", riskScore: 8,
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(), deadline: new Date(Date.now() + 20 * 86400000).toISOString(),
      isPublic: true, tags: ["Writing", "Technical", "Blog"], streamingEnabled: false,
      milestones: [
        { id: "m11", title: "Articles 1-3", amount: 1500, status: "approved", completedAt: new Date(Date.now() - 7 * 86400000).toISOString() },
        { id: "m12", title: "Articles 4-7", amount: 1500, status: "submitted", completedAt: null },
        { id: "m13", title: "Articles 8-10 + Final Review", amount: 1500, status: "pending", completedAt: null },
      ],
      history: [],
    },
  ],

  activities: [
    { id: "a1", type: "milestone_approved", escrowId: "esc-001", message: "Milestone 'Wireframes' approved — $3,750 released", time: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: "a2", type: "milestone_submitted", escrowId: "esc-001", message: "Sarah Chen submitted 'Frontend Development' for review", time: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: "a3", type: "escrow_funded", escrowId: "esc-002", message: "Escrow funded — $25,000 locked for Mobile App MVP", time: new Date(Date.now() - 48 * 3600000).toISOString() },
    { id: "a4", type: "escrow_created", escrowId: "esc-004", message: "New escrow created — Brand Identity Package", time: new Date(Date.now() - 24 * 3600000).toISOString() },
    { id: "a5", type: "escrow_released", escrowId: "esc-003", message: "All funds released for Smart Contract Audit", time: new Date(Date.now() - 7 * 86400000).toISOString() },
    { id: "a6", type: "milestone_submitted", escrowId: "esc-005", message: "DevWriter Pro submitted Articles 4-7 for review", time: new Date(Date.now() - 12 * 3600000).toISOString() },
  ],

  filters: { status: "", category: "", riskLevel: "", search: "" },
  setFilters: (filters) => set((s) => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: { status: "", category: "", riskLevel: "", search: "" } }),

  getFilteredEscrows: () => {
    const { escrows, filters } = get();
    return escrows.filter((e) => {
      if (filters.status && e.status !== filters.status) return false;
      if (filters.category && e.category !== filters.category) return false;
      if (filters.riskLevel) {
        if (filters.riskLevel === "low" && e.riskScore > 20) return false;
        if (filters.riskLevel === "medium" && (e.riskScore <= 20 || e.riskScore > 40)) return false;
        if (filters.riskLevel === "high" && e.riskScore <= 40) return false;
      }
      if (filters.search && !e.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  },

  getEscrow: (id) => get().escrows.find((e) => e.id === id),

  updateEscrowStatus: (id, status) => {
    set((s) => ({ escrows: s.escrows.map((e) => (e.id === id ? { ...e, status } : e)) }));
    emit(EventTypes.ESCROW_DISPUTED, { escrowId: id, status });
  },

  fundEscrow: (id) => {
    const escrow = get().getEscrow(id);
    if (!escrow) return;
    set((s) => ({
      escrows: s.escrows.map((e) =>
        e.id === id ? { ...e, funded: e.amount, status: "funded", history: [...e.history, { action: "funded", by: "Alex Morgan", at: new Date().toISOString(), detail: `$${e.amount.toLocaleString()} locked` }] } : e
      ),
      activities: [{ id: `a-${Date.now()}`, type: "escrow_funded", escrowId: id, message: `Escrow funded — $${escrow.amount.toLocaleString()} locked for ${escrow.title}`, time: new Date().toISOString() }, ...s.activities],
    }));
    emit(EventTypes.ESCROW_FUNDED, { escrowId: id, amount: escrow.amount });
    emit(EventTypes.FUNDS_LOCKED, { escrowId: id, amount: escrow.amount });
    useNotificationStore.getState().addNotification({ type: "success", title: "Escrow Funded", message: `$${escrow.amount.toLocaleString()} locked for ${escrow.title}` });
  },

  approveMilestone: (escrowId, milestoneId) => {
    const escrow = get().getEscrow(escrowId);
    const ms = escrow?.milestones.find((m) => m.id === milestoneId);
    if (!ms) return;
    set((s) => ({
      escrows: s.escrows.map((e) => {
        if (e.id !== escrowId) return e;
        const allApproved = e.milestones.every((m) => m.id === milestoneId || m.status === "approved");
        return {
          ...e, released: e.released + ms.amount, status: allApproved ? "released" : e.status,
          milestones: e.milestones.map((m) => m.id === milestoneId ? { ...m, status: "approved", completedAt: new Date().toISOString() } : m),
          history: [...e.history, { action: "milestone_approved", by: "Alex Morgan", at: new Date().toISOString(), detail: `${ms.title} — $${ms.amount.toLocaleString()} released` }],
        };
      }),
      activities: [{ id: `a-${Date.now()}`, type: "milestone_approved", escrowId, message: `Milestone '${ms.title}' approved — $${ms.amount.toLocaleString()} released`, time: new Date().toISOString() }, ...s.activities],
    }));
    emit(EventTypes.MILESTONE_APPROVED, { escrowId, milestoneId, milestone: ms });
    emit(EventTypes.FUNDS_RELEASED, { escrowId, amount: ms.amount, milestone: ms.title });
    useNotificationStore.getState().addNotification({ type: "success", title: "Milestone Approved", message: `${ms.title} — $${ms.amount.toLocaleString()} released` });
  },

  addEscrow: (escrow) => {
    const id = `esc-${Date.now()}`;
    set((s) => ({
      escrows: [{ ...escrow, id, status: "created", funded: 0, released: 0, streamed: 0, observers: [], streamingEnabled: false, riskScore: Math.floor(Math.random() * 50), createdAt: new Date().toISOString(), history: [{ action: "created", by: "Alex Morgan", at: new Date().toISOString() }] }, ...s.escrows],
      activities: [{ id: `a-${Date.now()}`, type: "escrow_created", escrowId: id, message: `New escrow created — ${escrow.title}`, time: new Date().toISOString() }, ...s.activities],
    }));
    emit(EventTypes.ESCROW_CREATED, { escrowId: id, title: escrow.title, amount: escrow.amount });
    useNotificationStore.getState().addNotification({ type: "info", title: "Escrow Created", message: `${escrow.title} — $${escrow.amount.toLocaleString()}` });
  },
}));
