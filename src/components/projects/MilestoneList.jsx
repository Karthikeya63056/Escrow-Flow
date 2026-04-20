import { useState } from "react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { MILESTONE_STATUS } from "../../lib/constants";
import { useEscrow } from "../../hooks/useEscrow";
import { Button } from "../common/Button";
import { motion } from "framer-motion";

export function MilestoneList({ milestones, clientId, freelancerId, isClient }) {
  const { approveMilestone, processing } = useEscrow();
  const [activeId, setActiveId] = useState(null);

  const handleApprove = async (milestone) => {
    setActiveId(milestone.id);
    await approveMilestone(milestone.id, milestone.amount, freelancerId, clientId);
    setActiveId(null);
  };

  if (!milestones || milestones.length === 0) {
    return <p className="text-gray-500">No milestones defined.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">Milestones</h3>
      {milestones.map((milestone, index) => {
        const isApproved = milestone.status === MILESTONE_STATUS.APPROVED;
        const isSubmitted = milestone.status === MILESTONE_STATUS.SUBMITTED;
        const isPending = milestone.status === MILESTONE_STATUS.PENDING;
        return (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border rounded-lg p-4 transition-colors ${
              isApproved
                ? "border-green-500/50 bg-green-500/5"
                : isSubmitted
                ? "border-yellow-500/50 bg-yellow-500/5"
                : "border-white/10 bg-darkBg"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-sm text-gray-500 font-mono mr-2">#{index + 1}</span>
                <span className="font-semibold text-white">{milestone.title}</span>
              </div>
              <span className="font-bold text-neonPurple">{formatCurrency(milestone.amount)}</span>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isApproved
                      ? "bg-green-500/20 text-green-400"
                      : isSubmitted
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {milestone.status.toUpperCase()}
                </span>
                {milestone.due_date && (
                  <span className="text-xs text-gray-500">Due: {formatDate(milestone.due_date)}</span>
                )}
              </div>

              <div>
                {isClient && isSubmitted && (
                  <Button
                    size="sm"
                    variant="primary"
                    isLoading={processing && activeId === milestone.id}
                    onClick={() => handleApprove(milestone)}
                  >
                    Approve & Release
                  </Button>
                )}
                {!isClient && isPending && (
                  <Button size="sm" variant="secondary">
                    Submit Work
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
