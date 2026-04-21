import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/FormElements";
import { useEscrowStore, useAuthStore } from "../../store";
import { useTrustStore, BADGE_META } from "../../systems/trustEngine";
import { formatCurrency, formatRelative } from "../../lib/utils";
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Lock, TrendingUp, Send,
  Copy, CheckCircle2, CreditCard, Star, Shield, Clock, Crown,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const balanceHistory = [
  { day: "Mon", value: 28000 }, { day: "Tue", value: 32000 }, { day: "Wed", value: 30000 },
  { day: "Thu", value: 35000 }, { day: "Fri", value: 33500 }, { day: "Sat", value: 37000 }, { day: "Sun", value: 36250 },
];

export default function WalletPage() {
  const { user } = useAuthStore();
  const allEscrows = useEscrowStore((s) => s.escrows);
  const trustUser = useTrustStore((s) => s.getUser("user-1"));
  const getTrustLevel = useTrustStore((s) => s.getTrustLevel);
  const [copied, setCopied] = useState(false);

  const totalLocked = allEscrows.reduce((s, e) => s + (e.funded - e.released), 0);
  const totalReleased = allEscrows.reduce((s, e) => s + e.released, 0);
  const totalVolume = allEscrows.reduce((s, e) => s + e.amount, 0);
  const available = totalReleased; // Simplified: released = available
  const trust = getTrustLevel(trustUser?.trustScore || 0);

  const transactions = allEscrows.flatMap((e) =>
    e.history.filter((h) => h.action === "funded" || h.action === "milestone_approved").map((h) => ({
      id: `${e.id}-${h.at}`,
      type: h.action === "funded" ? "locked" : "released",
      amount: h.action === "funded" ? e.amount : e.milestones.find((m) => h.detail?.includes(m.title))?.amount || 0,
      escrow: e.title,
      at: h.at,
      by: h.by,
    }))
  ).sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 10);

  const handleCopy = () => { navigator.clipboard.writeText("EF-" + user?.id?.toUpperCase()); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl mx-auto">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="text-sm text-gray-500 mt-1">Your funds, transactions, and financial overview</p>
      </motion.div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Available", value: formatCurrency(available), icon: Wallet, color: "text-neon-green", desc: "Ready to withdraw" },
          { label: "Locked in Escrow", value: formatCurrency(totalLocked), icon: Lock, color: "text-neon", desc: "Held in active escrows" },
          { label: "Total Released", value: formatCurrency(totalReleased), icon: ArrowUpRight, color: "text-neon-purple", desc: "All-time released" },
          { label: "Lifetime Volume", value: formatCurrency(totalVolume), icon: TrendingUp, color: "text-warning", desc: "Total transacted" },
        ].map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card className="group hover:neon-glow transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${s.color} bg-white/5 flex items-center justify-center`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-600 mt-1">{s.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Balance History</CardTitle>
              <Badge variant="neon">7 days</Badge>
            </CardHeader>
            <div className="h-[220px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={balanceHistory}>
                  <defs><linearGradient id="walletGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(34,197,94)" stopOpacity={0.3} /><stop offset="100%" stopColor="rgb(34,197,94)" stopOpacity={0} /></linearGradient></defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 13 }} formatter={(v) => [`$${v.toLocaleString()}`]} />
                  <Area type="monotone" dataKey="value" stroke="rgb(34,197,94)" strokeWidth={2} fill="url(#walletGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Account Info */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader><CardTitle>Account</CardTitle></CardHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/30 border border-white/5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-neon to-neon-purple flex items-center justify-center text-white font-bold">{user?.name?.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${trust.bg} ${trust.color} ${trust.border} border font-medium`}>{trust.label}</span>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Escrow ID</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs text-gray-300 bg-surface-2/50 px-3 py-2 rounded-lg font-mono">EF-{user?.id?.toUpperCase()}</code>
                  <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-all">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Badges</p>
                <div className="flex flex-wrap gap-1.5">
                  {(trustUser?.badges || []).map((b) => {
                    const meta = BADGE_META[b];
                    return meta ? (
                      <span key={b} className={`text-[10px] px-2 py-1 rounded-lg bg-white/5 ${meta.color} border border-white/5`}>
                        {meta.icon} {meta.label}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Plan</p>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-neon/5 border border-neon/20">
                  <Crown className="w-4 h-4 text-neon" />
                  <span className="text-sm text-neon font-medium">Pro Plan</span>
                  <span className="text-[10px] text-gray-500 ml-auto">$29/mo</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Transactions */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <span className="text-xs text-gray-500">{transactions.length} entries</span>
          </CardHeader>
          {transactions.length === 0 ? (
            <div className="py-12 text-center"><p className="text-gray-500 text-sm">No transactions yet. Create your first escrow!</p></div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tx.type === "locked" ? "bg-neon/10 text-neon" : "bg-neon-green/10 text-neon-green"}`}>
                    {tx.type === "locked" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{tx.type === "locked" ? "Funds Locked" : "Funds Released"}</p>
                    <p className="text-xs text-gray-500 truncate">{tx.escrow}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.type === "locked" ? "text-neon" : "text-neon-green"}`}>
                      {tx.type === "locked" ? "-" : "+"}{formatCurrency(tx.amount)}
                    </p>
                    <p className="text-[10px] text-gray-600">{formatRelative(tx.at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
}
