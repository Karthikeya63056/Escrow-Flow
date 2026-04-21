import { motion } from "framer-motion";
import { useEscrowStore } from "../../store";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/FormElements";
import { formatCurrency, formatDate, getStatusColor } from "../../lib/utils";
import { Link } from "react-router-dom";
import { Globe, Shield, ExternalLink, Lock, Eye } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function EscrowExplorerPage() {
  const { escrows } = useEscrowStore();
  const publicEscrows = escrows.filter((e) => e.isPublic);

  const totalLocked = publicEscrows.reduce((s, e) => s + (e.funded - e.released), 0);
  const totalVolume = publicEscrows.reduce((s, e) => s + e.amount, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <Globe className="w-6 h-6 text-neon" />
          <h1 className="text-2xl font-bold text-white">Escrow Explorer</h1>
        </div>
        <p className="text-sm text-gray-500">Public escrow contracts on the platform</p>
      </motion.div>

      {/* Global stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Public Escrows", value: publicEscrows.length, color: "text-neon" },
          { label: "Total Volume", value: formatCurrency(totalVolume), color: "text-neon-purple" },
          { label: "Value Locked", value: formatCurrency(totalLocked), color: "text-neon-green" },
        ].map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Escrow list */}
      <motion.div variants={item} className="space-y-3">
        {publicEscrows.length === 0 ? (
          <Card className="text-center py-12">
            <Lock className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No public escrows available</p>
          </Card>
        ) : (
          publicEscrows.map((esc, i) => (
            <motion.div key={esc.id} variants={item}>
              <Card hover className="group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon/20 to-neon-purple/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-neon" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold text-white">{esc.title}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(esc.status)}`}>
                        {esc.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">{esc.description}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="text-[10px] text-gray-600">{esc.buyer.name} → {esc.seller.name}</span>
                      <span className="text-[10px] text-gray-600">•</span>
                      <span className="text-[10px] text-gray-600">{formatDate(esc.createdAt)}</span>
                      {esc.tags?.map((t) => (
                        <Badge key={t} className="text-[9px] px-1.5 py-0">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold neon-text">{formatCurrency(esc.amount)}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {esc.milestones.filter((m) => m.status === "approved").length}/{esc.milestones.length} milestones
                    </p>
                  </div>
                  <Link to={`/escrows/${esc.id}`} className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-neon group-hover:bg-neon/10 transition-all">
                      <Eye className="w-4 h-4" />
                    </div>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}
