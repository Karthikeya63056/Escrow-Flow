export const ESCROW_STATES = {
  CREATED: "created",
  FUNDED: "funded",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  RELEASED: "released",
  DISPUTED: "disputed",
  REFUNDED: "refunded",
};

export const ESCROW_STATE_FLOW = [
  ESCROW_STATES.CREATED,
  ESCROW_STATES.FUNDED,
  ESCROW_STATES.IN_PROGRESS,
  ESCROW_STATES.REVIEW,
  ESCROW_STATES.RELEASED,
];

export const MILESTONE_STATUS = {
  PENDING: "pending",
  SUBMITTED: "submitted",
  APPROVED: "approved",
  DISPUTED: "disputed",
};

export const ROLES = {
  BUYER: "buyer",
  SELLER: "seller",
  ARBITRATOR: "arbitrator",
};

export const PROJECT_CATEGORIES = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "Video Editing",
  "Smart Contracts",
  "Consulting",
  "Other",
];

export const RISK_LEVELS = {
  LOW: { label: "Low Risk", color: "text-neon-green", bg: "bg-neon-green/10" },
  MEDIUM: { label: "Medium Risk", color: "text-warning", bg: "bg-warning/10" },
  HIGH: { label: "High Risk", color: "text-danger", bg: "bg-danger/10" },
};
