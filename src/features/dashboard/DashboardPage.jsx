import { memo } from "react";
import { motion } from "framer-motion";
import { useEscrowStore, useAuthStore } from "../../store";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge, Input, Select } from "../../components/ui/FormElements";
import { Button } from "../../components/ui/Button";
import { formatCurrency, formatRelative, getStatusColor } from "../../lib/utils";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, Wallet, ShieldCheck, TrendingUp,
  Clock, ExternalLink, PlusCircle, Activity, Filter,
  Search, X, Eye, BarChart3,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, PieChart, Pie, Cell } from "recharts";
import { ESCROW_STATES, PROJECT_CATEGORIES } from "../../lib/constants";

const chartData = [
  { name: "Jan", value: 4000 }, { name: "Feb", value: 7000 }, { name: "Mar", value: 5500 },
  { name: "Apr", value: 9000 }, { name: "May", value: 12000 }, { name: "Jun", value: 15000 },
  { name: "Jul", value: 18500 },
];

const NEON_COLORS = ["#00f3ff", "#8b5cf6", "#22c55e", "#eab308", "#ef4444"];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

const EscrowRow = memo(({ esc }) => (
  <Link to={`/escrows/${esc.id}`}>
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-surface-2/30 hover:bg-surface-2/60 border border-white/5 hover:border-white/10 transition-all group cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="text-sm font-semibold text-white truncate">{esc.title}</p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(esc.status)}`}>
            {esc.status.replace("_", " ")}
          </span>
          {esc.riskScore > 30 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-danger/10 text-danger font-medium">⚠ Risk</span>
          )}
        </div>
        <p className="text-xs text-gray-500">{esc.buyer.name} → {esc.seller.name}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-bold text-white">{formatCurrency(esc.amount)}</p>
        <p className="text-[10px] text-gray-600">{esc.milestones.filter((m) => m.status === "approved").length}/{esc.milestones.length} done</p>
      </div>
      <Eye className="w-4 h-4 text-gray-600 group-hover:text-neon transition-colors flex-shrink-0" />
    </motion.div>
  </Link>
));
EscrowRow.displayName = "EscrowRow";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { activities, filters, setFilters, resetFilters, getFilteredEscrows } = useEscrowStore();
  const escrows = getFilteredEscrows();
  const allEscrows = useEscrowStore((s) => s.escrows);

  const totalLocked = allEscrows.reduce((s, e) => s + (e.funded - e.released), 0);
  const totalReleased = allEscrows.reduce((s, e) => s + e.released, 0);
  const activeCount = allEscrows.filter((e) => !["released", "refunded"].includes(e.status)).length;
  const successRate = allEscrows.length > 0 ? Math.round((allEscrows.filter((e) => e.status === "released").length / allEscrows.length) * 100) : 0;

  const hasFilters = filters.status || filters.category || filters.riskLevel || filters.search;

  // Pie chart data for status distribution
  const statusCounts = {};
  allEscrows.forEach((e) => { statusCounts[e.status] = (statusCounts[e.status] || 0) + 1; });
  const pieData = Object.entries(statusCounts).map(([name, value]) => ({ name: name.replace("_", " "), value }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Welcome */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="neon-text">{user?.name?.split(" ")[0]}</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your escrows</p>
        </div>
        <Link to="/create">
          <Button><PlusCircle className="w-4 h-4" />New Escrow</Button>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Value Locked", value: formatCurrency(totalLocked), icon: Wallet, iconColor: "text-neon bg-neon/10", change: "+12.5%", up: true },
          { label: "Total Released", value: formatCurrency(totalReleased), icon: ArrowUpRight, iconColor: "text-neon-green bg-neon-green/10", change: "+8.2%", up: true },
          { label: "Active Escrows", value: activeCount, icon: Activity, iconColor: "text-neon-purple bg-neon-purple/10", change: `${allEscrows.length} total`, up: true },
          { label: "Success Rate", value: `${successRate}%`, icon: ShieldCheck, iconColor: "text-neon-green bg-neon-green/10", change: "All time", up: true },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="group hover:neon-glow transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconColor}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                <TrendingUp className="w-3 h-3 text-neon-green" />
                <span className="text-xs text-gray-500">{stat.change}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-gray-500" />
                <CardTitle>Escrow Volume</CardTitle>
              </div>
              <Badge variant="neon">+24%</Badge>
            </CardHeader>
            <div className="h-[200px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="neonGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(0,243,255)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="rgb(0,243,255)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#4b5563", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 13 }}
                    labelStyle={{ color: "#9ca3af" }}
                    formatter={(val) => [`$${val.toLocaleString()}`]}
                  />
                  <Area type="monotone" dataKey="value" stroke="rgb(0,243,255)" strokeWidth={2} fill="url(#neonGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Status Pie */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Status Split</CardTitle>
            </CardHeader>
            <div className="h-[180px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={NEON_COLORS[i % NEON_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(17,24,39,0.95)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {pieData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1 text-[10px] text-gray-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: NEON_COLORS[i % NEON_COLORS.length] }} />
                  {d.name}
                </span>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters + Escrow List */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Your Escrows</CardTitle>
            <div className="flex items-center gap-2">
              {hasFilters && (
                <button onClick={resetFilters} className="text-xs text-danger hover:text-red-400 flex items-center gap-1">
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
              <Filter className="w-4 h-4 text-gray-500" />
            </div>
          </CardHeader>

          {/* Filter bar */}
          <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="flex-1 min-w-[180px]">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Search escrows..."
                  value={filters.search}
                  onChange={(e) => setFilters({ search: e.target.value })}
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-surface-2/50 border border-white/5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon/30"
                />
              </div>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
              className="h-9 px-3 rounded-lg bg-surface-2/50 border border-white/5 text-sm text-gray-300 focus:outline-none"
            >
              <option value="">All Status</option>
              {Object.values(ESCROW_STATES).map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ category: e.target.value })}
              className="h-9 px-3 rounded-lg bg-surface-2/50 border border-white/5 text-sm text-gray-300 focus:outline-none"
            >
              <option value="">All Categories</option>
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters({ riskLevel: e.target.value })}
              className="h-9 px-3 rounded-lg bg-surface-2/50 border border-white/5 text-sm text-gray-300 focus:outline-none"
            >
              <option value="">All Risk</option>
              <option value="low">Low (0-20)</option>
              <option value="medium">Medium (21-40)</option>
              <option value="high">High (41+)</option>
            </select>
          </div>

          {/* Escrow rows */}
          {escrows.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-4xl mb-3 opacity-40">🔍</p>
              <p className="text-gray-500 text-sm">{hasFilters ? "No escrows match your filters" : "No escrows yet"}</p>
              {hasFilters && (
                <button onClick={resetFilters} className="text-xs text-neon mt-2 hover:text-cyan-300">Clear filters</button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {escrows.map((esc) => <EscrowRow key={esc.id} esc={esc} />)}
            </div>
          )}
        </Card>
      </motion.div>

      {/* Activity Feed */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <CardTitle>Activity Feed</CardTitle>
            </div>
          </CardHeader>
          <div className="space-y-3">
            {activities.slice(0, 6).map((act) => (
              <div key={act.id} className="flex gap-3 items-start p-3 rounded-xl hover:bg-white/[0.02] transition-colors">
                <div className="w-2 h-2 rounded-full bg-neon mt-2 flex-shrink-0 animate-pulse-slow" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 leading-snug">{act.message}</p>
                  <p className="text-xs text-gray-600 mt-1">{formatRelative(act.time)}</p>
                </div>
                <Link to={`/escrows/${act.escrowId}`} className="text-gray-600 hover:text-neon transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
