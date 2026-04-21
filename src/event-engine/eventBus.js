/**
 * Event Bus — Central nervous system of EscrowFlow.
 * Every action emits typed events. UI and services subscribe to react in real-time.
 */

const listeners = new Map();
const eventLog = [];

export const EventTypes = {
  // Escrow lifecycle
  ESCROW_CREATED: "escrow.created",
  ESCROW_FUNDED: "escrow.funded",
  ESCROW_ACTIVATED: "escrow.activated",
  ESCROW_COMPLETED: "escrow.completed",
  ESCROW_DISPUTED: "escrow.disputed",
  ESCROW_REFUNDED: "escrow.refunded",

  // Milestone
  MILESTONE_SUBMITTED: "milestone.submitted",
  MILESTONE_APPROVED: "milestone.approved",
  MILESTONE_REJECTED: "milestone.rejected",

  // Funds
  FUNDS_LOCKED: "funds.locked",
  FUNDS_RELEASED: "funds.released",
  FUNDS_STREAMED: "funds.streamed",

  // Dispute
  DISPUTE_OPENED: "dispute.opened",
  DISPUTE_MESSAGE: "dispute.message",
  DISPUTE_RESOLVED: "dispute.resolved",
  DISPUTE_ESCALATED: "dispute.escalated",

  // System
  NOTIFICATION: "system.notification",
  AI_SUGGESTION: "ai.suggestion",
  USER_ACTION: "user.action",
};

/**
 * Emit an event to all subscribers.
 */
export function emit(type, payload = {}) {
  const event = {
    type,
    payload,
    timestamp: new Date().toISOString(),
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };

  // Log every event
  eventLog.push(event);
  if (eventLog.length > 500) eventLog.shift();

  // Notify subscribers
  const typeListeners = listeners.get(type) || [];
  typeListeners.forEach((cb) => {
    try {
      cb(event);
    } catch (err) {
      console.error(`[EventBus] Error in listener for ${type}:`, err);
    }
  });

  // Wildcard listeners
  const wildcardListeners = listeners.get("*") || [];
  wildcardListeners.forEach((cb) => {
    try {
      cb(event);
    } catch (err) {
      console.error(`[EventBus] Error in wildcard listener:`, err);
    }
  });

  return event;
}

/**
 * Subscribe to an event type. Returns an unsubscribe function.
 */
export function on(type, callback) {
  if (!listeners.has(type)) listeners.set(type, []);
  listeners.get(type).push(callback);

  return () => {
    const list = listeners.get(type);
    if (list) {
      const idx = list.indexOf(callback);
      if (idx > -1) list.splice(idx, 1);
    }
  };
}

/**
 * Subscribe once — auto-unsubscribe after first event.
 */
export function once(type, callback) {
  const unsub = on(type, (event) => {
    unsub();
    callback(event);
  });
  return unsub;
}

/**
 * Get the full event log (for debugging / activity playback).
 */
export function getEventLog() {
  return [...eventLog];
}

/**
 * Clear the event log.
 */
export function clearEventLog() {
  eventLog.length = 0;
}

export default { emit, on, once, getEventLog, clearEventLog, EventTypes };
