/**
 * Demo Mode — Auto-play escrow lifecycle for investors and demos.
 * Simulates: Create → Fund → Milestone Submit → Approve → Complete
 */
import { create } from "zustand";
import { emit, EventTypes } from "../event-engine/eventBus";

const DEMO_STEPS = [
  { delay: 0, label: "Creating escrow...", action: "create", event: EventTypes.ESCROW_CREATED },
  { delay: 2000, label: "Locking funds ($8,000)...", action: "fund", event: EventTypes.ESCROW_FUNDED },
  { delay: 3500, label: "Seller submits Milestone 1...", action: "submit_m1", event: EventTypes.MILESTONE_SUBMITTED },
  { delay: 5000, label: "Buyer approves Milestone 1 — $3,000 released", action: "approve_m1", event: EventTypes.MILESTONE_APPROVED },
  { delay: 7000, label: "Seller submits Milestone 2...", action: "submit_m2", event: EventTypes.MILESTONE_SUBMITTED },
  { delay: 8500, label: "Buyer approves Milestone 2 — $5,000 released", action: "approve_m2", event: EventTypes.MILESTONE_APPROVED },
  { delay: 10000, label: "All funds released. Escrow complete! 🎉", action: "complete", event: EventTypes.ESCROW_COMPLETED },
  { delay: 11500, label: "Trust scores updated. Ratings exchanged.", action: "trust", event: EventTypes.NOTIFICATION },
];

export const useDemoStore = create((set, get) => ({
  isPlaying: false,
  currentStep: -1,
  steps: DEMO_STEPS,
  timers: [],

  startDemo: () => {
    const { stopDemo } = get();
    stopDemo();
    set({ isPlaying: true, currentStep: -1 });

    const timers = DEMO_STEPS.map((step, i) => {
      return setTimeout(() => {
        set({ currentStep: i });
        emit(step.event, { demo: true, step: step.action, label: step.label });

        if (i === DEMO_STEPS.length - 1) {
          setTimeout(() => set({ isPlaying: false }), 2000);
        }
      }, step.delay);
    });

    set({ timers });
  },

  stopDemo: () => {
    const { timers } = get();
    timers.forEach(clearTimeout);
    set({ isPlaying: false, currentStep: -1, timers: [] });
  },
}));
