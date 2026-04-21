import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEscrowStore, useAuthStore } from "../../store";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { formatCurrency, formatDate, formatRelative, getStatusColor } from "../../lib/utils";
import { ESCROW_STATE_FLOW } from "../../lib/constants";
import toast from "react-hot-toast";
import {
  ArrowLeft, CheckCircle2, Clock, AlertTriangle, DollarSign,
  User, Shield, FileText, GitCommit, Sparkles,
} from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const actionIcons = {
  created: FileText,
  funded: DollarSign,
  milestone_approved: CheckCircle2,
  milestone_submitted: Clock,
  completed: CheckCircle2,
  disputed: AlertTriangle,
};

export default function EscrowDetailPage() {
  const { id } = useParams();
  const { getEscrow, approveMilestone, updateEscrowStatus } = useEscrowStore();
  const { user } = useAuthStore();
  const escrow = getEscrow(id);

  if (!escrow) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-4xl opacity-40">🔍</p>
        <p className="text-gray-400 text-lg">Escrow not found</p>
        <Link to="/"><Button variant="secondary">← Back to Dashboard</Button></Link>
      </div>
    );
  }

  const completedMilestones = escrow.milestones.filter((m) => m.status === "approved").length;
  const progress = Math.round((completedMilestones / escrow.milestones.length) * 100);
  const currentStateIndex = ESCROW_STATE_FLOW.indexOf(escrow.status);

  const handleApprove = (ms) => {
    approveMilestone(escrow.id, ms.id);
    toast.success(`Milestone "${ms.title}" approved — ${formatCurrency(ms.amount)} released!`);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/" className="text-xs text-gray-500 hover:text-neon transition-colors flex items-center gap-1 mb-3">
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">{escrow.title}</h1>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">{escrow.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(escrow.status)}`}>
            {escrow.status.replace("_", " ").toUpperCase()}
          </span>
          {escrow.status === "in_progress" && user?.id === escrow.buyer.id && (
            <Button variant="danger" size="sm" onClick={() => { updateEscrowStatus(escrow.id, "disputed"); toast.error("Dispute opened"); }}>
              <AlertTriangle className="w-3.5 h-3.5" /> Dispute
            </Button>
          )}
        </div>
      </motion.div>

      {/* State Machine */}
      <motion.div variants={item}>
        <Card>
          <CardHeader><CardTitle>Escrow Lifecycle</CardTitle></CardHeader>
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute top-5 left-8 right-8 h-0.5 bg-white/5" />
            <div className="absolute top-5 left-8 h-0.5 bg-gradient-to-r from-neon to-neon-purple transition-all duration-700" style={{ width: `${Math.max(0, (currentStateIndex / (ESCROW_STATE_FLOW.length - 1)) * 100)}%`, maxWidth: "calc(100% - 64px)" }} />
            {ESCROW_STATE_FLOW.map((state, i) => {
              const isActive = i === currentStateIndex;
              const isDone = i < currentStateIndex;
              return (
                <div key={state} className="relative flex flex-col items-center z-10 flex-1">
                  <motion.div
                    initial={false}
                    animate={{ scale: isActive ? 1.2 : 1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      isDone ? "bg-neon/20 border-neon text-neon" :
                      isActive ? "bg-neon border-neon text-bg shadow-[0_0_20px_rgba(0,243,255,0.4)]" :
                      "bg-surface-2 border-white/10 text-gray-500"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </motion.div>
                  <p className={`text-[10px] mt-2 font-medium ${isActive ? "text-neon" : isDone ? "text-gray-400" : "text-gray-600"}`}>
                    {state.replace("_", " ")}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total", value: formatCurrency(escrow.amount), icon: DollarSign, color: "text-neon" },
          { label: "Released", value: formatCurrency(escrow.released), icon: CheckCircle2, color: "text-neon-green" },
          { label: "Locked", value: formatCurrency(escrow.funded - escrow.released), icon: Shield, color: "text-neon-purple" },
          { label: "Progress", value: `${progress}%`, icon: Clock, color: "text-warning" },
        ].map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color} bg-white/5`}>
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parties */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader><CardTitle>Parties</CardTitle></CardHeader>
            <div className="space-y-3">
              {[
                { role: "Buyer", person: escrow.buyer, color: "from-neon to-blue-500" },
                { role: "Seller", person: escrow.seller, color: "from-neon-purple to-pink-500" },
                { role: "Arbitrator", person: escrow.arbitrator, color: "from-yellow-400 to-orange-500" },
              ].map((p) => (
                <div key={p.role} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/30 border border-white/5">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {p.person?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{p.person?.name || "Not assigned"}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Risk Score</span>
                <span className={`text-sm font-bold ${escrow.riskScore <= 20 ? "text-neon-green" : escrow.riskScore <= 40 ? "text-warning" : "text-danger"}`}>
                  {escrow.riskScore}%
                </span>
              </div>
              <div className="w-full h-2 bg-surface-2 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${escrow.riskScore}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full rounded-full ${escrow.riskScore <= 20 ? "bg-neon-green" : escrow.riskScore <= 40 ? "bg-warning" : "bg-danger"}`}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Milestones */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
              <span className="text-xs text-gray-500">{completedMilestones}/{escrow.milestones.length}</span>
            </CardHeader>
            <div className="w-full h-2 bg-surface-2 rounded-full mb-5 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-r from-neon to-neon-purple" />
            </div>
            <div className="space-y-3">
              {escrow.milestones.map((ms, i) => {
                const isApproved = ms.status === "approved";
                const isSubmitted = ms.status === "submitted";
                return (
                  <motion.div
                    key={ms.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${
                      isApproved ? "bg-neon-green/5 border-neon-green/20" :
                      isSubmitted ? "bg-yellow-500/5 border-yellow-500/20" :
                      "bg-surface-2/30 border-white/5"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isApproved ? "bg-neon-green/20 text-neon-green" :
                      isSubmitted ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-white/5 text-gray-500"
                    }`}>
                      {isApproved ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{ms.title}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {isApproved ? `Completed ${formatDate(ms.completedAt)}` : ms.status.toUpperCase()}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-white">{formatCurrency(ms.amount)}</p>
                    {isSubmitted && user?.id === escrow.buyer.id && (
                      <Button size="sm" onClick={() => handleApprove(ms)}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                      </Button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Activity History */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-gray-500" />
              <CardTitle>Activity History</CardTitle>
            </div>
          </CardHeader>
          {(!escrow.history || escrow.history.length === 0) ? (
            <p className="text-sm text-gray-500 py-4">No history yet</p>
          ) : (
            <div className="relative pl-6">
              <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/5" />
              {escrow.history.map((h, i) => {
                const Icon = actionIcons[h.action] || FileText;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="relative flex gap-4 pb-6 last:pb-0"
                  >
                    <div className="absolute -left-6 top-0.5 w-6 h-6 rounded-full bg-surface-2 border border-white/10 flex items-center justify-center z-10">
                      <Icon className="w-3 h-3 text-neon" />
                    </div>
                    <div className="flex-1 min-w-0 ml-2">
                      <p className="text-sm text-white font-medium">{h.action.replace("_", " ")} <span className="text-gray-500 font-normal">by {h.by}</span></p>
                      {h.detail && <p className="text-xs text-gray-400 mt-0.5">{h.detail}</p>}
                      <p className="text-[10px] text-gray-600 mt-1">{formatRelative(h.at)}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
