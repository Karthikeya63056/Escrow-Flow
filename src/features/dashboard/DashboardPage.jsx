import { motion } from "framer-motion";
import { useEscrowStore, useAuthStore } from "../../store";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/FormElements";
import { Button } from "../../components/ui/Button";
import { formatCurrency, formatRelative, getStatusColor } from "../../lib/utils";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, ArrowDownRight, Wallet, ShieldCheck, TrendingUp,
  Clock, ExternalLink, PlusCircle, Activity,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const chartData = [
  { name: "Jan", value: 4000 }, { name: "Feb", value: 7000 }, { name: "Mar", value: 5500 },
  { name: "Apr", value: 9000 }, { name: "May", value: 12000 }, { name: "Jun", value: 15000 },
  { name: "Jul", value: 18500 },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { escrows, activities } = useEscrowStore();

  const totalLocked = escrows.reduce((s, e) => s + (e.funded - e.released), 0);
  const totalReleased = escrows.reduce((s, e) => s + e.released, 0);
  const activeCount = escrows.filter((e) => !["released", "refunded"].includes(e.status)).length;

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
          { label: "Total Locked", value: formatCurrency(totalLocked), icon: Wallet, iconColor: "text-neon bg-neon/10", change: "+12.5%", up: true },
          { label: "Total Released", value: formatCurrency(totalReleased), icon: ArrowUpRight, iconColor: "text-neon-green bg-neon-green/10", change: "+8.2%", up: true },
          { label: "Active Escrows", value: activeCount, icon: Activity, iconColor: "text-neon-purple bg-neon-purple/10", change: "+2", up: true },
          { label: "Risk Score", value: "Low", icon: ShieldCheck, iconColor: "text-neon-green bg-neon-green/10", change: "-3.4%", up: false },
        ].map((stat) => (
          <motion.div key={stat.label} variants={item}>
            <Card className="group">
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
                {stat.up ? <TrendingUp className="w-3 h-3 text-neon-green" /> : <ArrowDownRight className="w-3 h-3 text-danger" />}
                <span className={`text-xs font-medium ${stat.up ? "text-neon-green" : "text-danger"}`}>{stat.change}</span>
                <span className="text-xs text-gray-600 ml-1">vs last month</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Escrow Volume</CardTitle>
              <Badge variant="neon">+24%</Badge>
            </CardHeader>
            <div className="h-[220px] -mx-2">
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
                    itemStyle={{ color: "#00f3ff" }}
                    formatter={(val) => [`$${val.toLocaleString()}`]}
                  />
                  <Area type="monotone" dataKey="value" stroke="rgb(0,243,255)" strokeWidth={2} fill="url(#neonGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={item}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <Clock className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <div className="space-y-4">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-neon mt-2 flex-shrink-0 animate-pulse-slow" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 leading-snug">{act.message}</p>
                    <p className="text-xs text-gray-600 mt-1">{formatRelative(act.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Escrow List */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Your Escrows</CardTitle>
            <Link to="/escrows" className="text-xs text-gray-500 hover:text-neon transition-colors">View all →</Link>
          </CardHeader>
          <div className="space-y-3">
            {escrows.map((esc) => (
              <Link key={esc.id} to={`/escrows/${esc.id}`}>
                <motion.div whileHover={{ x: 4 }} className="flex items-center gap-4 p-4 rounded-xl bg-surface-2/30 hover:bg-surface-2/60 border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-white truncate">{esc.title}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${getStatusColor(esc.status)}`}>
                        {esc.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{esc.buyer.name} → {esc.seller.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{formatCurrency(esc.amount)}</p>
                    <p className="text-[10px] text-gray-600">{esc.milestones.filter((m) => m.status === "approved").length}/{esc.milestones.length} milestones</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-neon transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
