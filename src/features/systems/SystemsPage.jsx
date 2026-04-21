import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/FormElements";
import { on, getEventLog } from "../../event-engine/eventBus";
import { useDemoStore } from "../../systems/demoMode";
import { usePluginStore } from "../../systems/pluginSystem";
import { useTrustStore, BADGE_META } from "../../systems/trustEngine";
import { formatRelative } from "../../lib/utils";
import {
  Play, Square, Radio, Zap, Shield, Star, CheckCircle2,
  AlertTriangle, TrendingUp, Download, ToggleLeft, ToggleRight,
  Terminal, Filter, Pause, Eye,
} from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

// ─── EVENT STREAM PANEL ───
function EventStream() {
  const [events, setEvents] = useState(getEventLog().slice(-20));
  const [filter, setFilter] = useState("all");
  const scrollRef = useRef(null);

  useEffect(() => {
    const unsub = on("*", () => {
      setEvents(getEventLog().slice(-30));
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [events]);

  const filtered = filter === "all" ? events : events.filter((e) => e.type.startsWith(filter));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-neon-green" />
          <CardTitle>Event Stream</CardTitle>
          <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        </div>
      </CardHeader>
      <div className="flex gap-1 mb-3 flex-wrap">
        {["all", "escrow", "milestone", "funds", "dispute", "system"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[10px] px-2 py-1 rounded-lg transition-all ${filter === f ? "bg-neon/10 text-neon border border-neon/20" : "bg-surface-2/50 text-gray-500 border border-white/5 hover:text-gray-300"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1 min-h-0 font-mono text-[11px]">
        {filtered.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No events yet. Interact with the app or start Demo Mode.</p>
        ) : (
          filtered.map((evt) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.02] group"
            >
              <span className="text-gray-600 flex-shrink-0">{new Date(evt.timestamp).toLocaleTimeString()}</span>
              <span className={`flex-shrink-0 ${evt.type.startsWith("escrow") ? "text-neon" : evt.type.startsWith("milestone") ? "text-neon-purple" : evt.type.startsWith("funds") ? "text-neon-green" : evt.type.startsWith("dispute") ? "text-warning" : "text-gray-400"}`}>
                {evt.type}
              </span>
              {evt.payload?.demo && <span className="text-[9px] px-1 py-0.5 rounded bg-neon-purple/10 text-neon-purple">DEMO</span>}
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}

// ─── DEMO MODE PANEL ───
function DemoPanel() {
  const { isPlaying, currentStep, steps, startDemo, stopDemo } = useDemoStore();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-neon-purple" />
          <CardTitle>Demo Mode</CardTitle>
        </div>
        <Button
          size="sm"
          onClick={isPlaying ? stopDemo : startDemo}
          className={isPlaying ? "bg-danger/10 text-danger border-danger/20 shadow-none" : ""}
        >
          {isPlaying ? <><Square className="w-3.5 h-3.5" /> Stop</> : <><Play className="w-3.5 h-3.5" /> Start Demo</>}
        </Button>
      </CardHeader>
      <p className="text-xs text-gray-500 mb-4">Auto-play a full escrow lifecycle: Create → Fund → Milestones → Complete</p>
      <div className="space-y-2">
        {steps.map((step, i) => {
          const isDone = currentStep >= i;
          const isActive = currentStep === i;
          return (
            <motion.div
              key={i}
              animate={isActive ? { scale: [1, 1.02, 1] } : {}}
              transition={{ duration: 0.5 }}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                isActive ? "border-neon/30 bg-neon/5 shadow-[0_0_15px_rgba(0,243,255,0.1)]" :
                isDone ? "border-neon-green/20 bg-neon-green/5" :
                "border-white/5 bg-surface-2/30"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isDone ? "bg-neon-green/20 text-neon-green" : isActive ? "bg-neon/20 text-neon animate-pulse" : "bg-white/5 text-gray-600"
              }`}>
                {isDone && !isActive ? <CheckCircle2 className="w-3 h-3" /> : i + 1}
              </div>
              <span className={`text-xs ${isActive ? "text-white font-medium" : isDone ? "text-gray-400" : "text-gray-600"}`}>
                {step.label}
              </span>
              {isActive && <Radio className="w-3 h-3 text-neon animate-pulse ml-auto" />}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── PLUGIN MARKETPLACE ───
function PluginMarketplace() {
  const { plugins, togglePlugin, installPlugin, uninstallPlugin } = usePluginStore();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          <CardTitle>Plugin Marketplace</CardTitle>
        </div>
        <span className="text-xs text-gray-500">{plugins.filter((p) => p.enabled).length} active</span>
      </CardHeader>
      <div className="space-y-3">
        {plugins.map((p) => (
          <div key={p.id} className={`p-4 rounded-xl border transition-all ${p.enabled ? "border-neon-green/20 bg-neon-green/5" : "border-white/5 bg-surface-2/30"}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-white">{p.name}</p>
                    <span className="text-[9px] text-gray-500">v{p.version}</span>
                  </div>
                  <p className="text-[10px] text-gray-500">by {p.author} · {p.category}</p>
                </div>
              </div>
              {p.installed ? (
                <button onClick={() => togglePlugin(p.id)} className={`p-1 rounded-lg transition-all ${p.enabled ? "text-neon-green" : "text-gray-600"}`}>
                  {p.enabled ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              ) : (
                <Button size="sm" variant="secondary" onClick={() => installPlugin(p.id)}>
                  <Download className="w-3 h-3" /> Install
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">{p.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── TRUST LEADERBOARD ───
function TrustLeaderboard() {
  const { users, getTrustLevel } = useTrustStore();
  const sorted = Object.values(users).sort((a, b) => b.trustScore - a.trustScore);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-neon" />
          <CardTitle>Trust Leaderboard</CardTitle>
        </div>
      </CardHeader>
      <div className="space-y-3">
        {sorted.map((u, i) => {
          const trust = getTrustLevel(u.trustScore);
          return (
            <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/30 border border-white/5">
              <span className="text-lg font-bold text-gray-600 w-6 text-center">{i + 1}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-neon to-neon-purple flex items-center justify-center text-white text-sm font-bold`}>
                {u.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{u.name}</p>
                  {u.verified && <CheckCircle2 className="w-3.5 h-3.5 text-neon" />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${trust.bg} ${trust.color} ${trust.border} border font-medium`}>
                    {trust.label}
                  </span>
                  <span className="text-[10px] text-gray-500">{u.stats.completed} deals · ${(u.stats.totalVolume / 1000).toFixed(0)}K volume</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${trust.color}`}>{u.trustScore}</p>
                <p className="text-[10px] text-gray-600">trust</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── RULE BUILDER ───
function RuleBuilder() {
  const [rules] = useState([
    { id: 1, active: true, condition: "milestone.approved", action: "Release 30% of locked funds", icon: "💰" },
    { id: 2, active: true, condition: "deadline.passed", action: "Auto-refund to buyer", icon: "⏰" },
    { id: 3, active: false, condition: "dispute.opened", action: "Freeze all funds immediately", icon: "🔒" },
    { id: 4, active: true, condition: "all_milestones.approved", action: "Release remaining funds + close escrow", icon: "✅" },
    { id: 5, active: false, condition: "trust_score < 40", action: "Require additional KYC verification", icon: "🪪" },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-neon-green" />
          <CardTitle>Automation Rules</CardTitle>
        </div>
        <Badge variant="neon">{rules.filter((r) => r.active).length} active</Badge>
      </CardHeader>
      <p className="text-xs text-gray-500 mb-4">IF condition → THEN action. No code required.</p>
      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${rule.active ? "border-neon-green/20 bg-neon-green/5" : "border-white/5 bg-surface-2/30 opacity-50"}`}>
            <span className="text-xl">{rule.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-purple/10 text-neon-purple font-mono">IF</span>
                <span className="text-xs text-white font-mono">{rule.condition}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neon-green/10 text-neon-green font-mono">THEN</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{rule.action}</p>
            </div>
            <div className={`w-2 h-2 rounded-full ${rule.active ? "bg-neon-green" : "bg-gray-600"}`} />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── MAIN PAGE ───
export default function SystemsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-white">Platform Systems</h1>
        <p className="text-sm text-gray-500 mt-1">Trust engine, plugins, automation, and real-time event stream</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={item} className="space-y-6">
          <DemoPanel />
          <RuleBuilder />
          <TrustLeaderboard />
        </motion.div>
        <motion.div variants={item} className="space-y-6">
          <div style={{ height: "420px" }}>
            <EventStream />
          </div>
          <PluginMarketplace />
        </motion.div>
      </div>
    </motion.div>
  );
}
