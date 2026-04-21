/**
 * Event listeners — wire up side effects for events.
 * Import and call setupListeners() once at app init.
 */
import { on, EventTypes } from "./eventBus";
import toast from "react-hot-toast";

let initialized = false;

export function setupListeners() {
  if (initialized) return;
  initialized = true;

  // Toast on milestone approval
  on(EventTypes.MILESTONE_APPROVED, (evt) => {
    toast.success(`Milestone approved — ${evt.payload.milestone?.title || ""}`, { icon: "✅" });
  });

  // Toast on escrow funded
  on(EventTypes.ESCROW_FUNDED, (evt) => {
    toast.success(`Escrow funded — $${evt.payload.amount?.toLocaleString()}`, { icon: "💰" });
  });

  // Toast on dispute opened
  on(EventTypes.DISPUTE_OPENED, (evt) => {
    toast.error(`Dispute opened — ${evt.payload.reason || ""}`, { icon: "⚠️", duration: 5000 });
  });

  // Toast on funds released
  on(EventTypes.FUNDS_RELEASED, (evt) => {
    toast.success(`$${evt.payload.amount?.toLocaleString()} released`, { icon: "🎉" });
  });

  // Toast on funds streamed
  on(EventTypes.FUNDS_STREAMED, (evt) => {
    toast(`Streaming: $${evt.payload.amount?.toLocaleString()} released`, { icon: "💸", duration: 2000 });
  });

  // Log everything in dev
  if (import.meta.env.DEV) {
    on("*", (evt) => {
      console.log(`[Event] ${evt.type}`, evt.payload);
    });
  }
}
