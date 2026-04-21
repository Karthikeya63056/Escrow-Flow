import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Zap, Globe, ArrowRight, CheckCircle2, Star, Lock, TrendingUp, Users, DollarSign } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20 } } };

const STATS = [
  { label: "Escrows Secured", value: "$2.4M+", icon: Shield },
  { label: "Transactions", value: "1,200+", icon: TrendingUp },
  { label: "Trust Score Avg", value: "94%", icon: Star },
  { label: "Active Users", value: "850+", icon: Users },
];

const FEATURES = [
  { title: "Smart Escrow Engine", desc: "Multi-party roles, milestone-based releases, condition automation, and streaming payments.", icon: "💸", color: "from-neon to-blue-500" },
  { title: "AI-Powered Risk Intel", desc: "Real-time dispute prediction, contract analysis, and intelligent recommendations.", icon: "🤖", color: "from-neon-purple to-pink-500" },
  { title: "Trust & Reputation", desc: "On-chain-grade trust scoring, verification badges, and public reputation profiles.", icon: "🛡️", color: "from-neon-green to-emerald-500" },
  { title: "Plugin Marketplace", desc: "Extend with Stripe, GitHub verification, KYC, crypto payments, and custom integrations.", icon: "🔌", color: "from-yellow-400 to-orange-500" },
  { title: "Dispute Resolution", desc: "Chat-based disputes with evidence timeline, AI analysis, and professional arbitration.", icon: "⚖️", color: "from-red-400 to-rose-500" },
  { title: "Developer API", desc: "Embed escrow into any app. REST API, webhooks, and white-label support.", icon: "⚡", color: "from-violet-400 to-purple-500" },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Freelance Developer", quote: "EscrowFlow eliminated payment anxiety from my freelance work. I get paid fairly, every time.", rating: 5 },
  { name: "DeFi Labs", role: "Web3 Company", quote: "We use EscrowFlow for all contractor payments. The audit trail and trust scoring are game-changers.", rating: 5 },
  { name: "Priya Sharma", role: "Mobile Developer", quote: "The AI risk analysis caught a problematic contract before I signed. Worth every cent.", rating: 5 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-neon-purple/5 rounded-full blur-[100px]" />

        <motion.div variants={container} initial="hidden" animate="show" className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div variants={item} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/5 border border-neon/20 text-neon text-sm mb-8">
            <Zap className="w-4 h-4" /> Now with AI-Powered Risk Intelligence
          </motion.div>

          <motion.h1 variants={item} className="text-5xl sm:text-7xl font-black tracking-tight">
            <span className="text-white">The Operating System</span>
            <br />
            <span className="neon-text">for Secure Payments</span>
          </motion.h1>

          <motion.p variants={item} className="text-lg sm:text-xl text-gray-400 mt-6 max-w-2xl mx-auto leading-relaxed">
            Protect every transaction with milestone-based escrow, AI risk analysis, and reputation scoring.
            Trusted by freelancers, agencies, and enterprises.
          </motion.p>

          <motion.div variants={item} className="flex items-center justify-center gap-4 mt-10 flex-wrap">
            <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-neon to-neon-purple text-bg font-bold text-lg shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] transition-all hover:scale-105">
              Start Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/explore" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all">
              <Globe className="w-5 h-5" /> Explore Public Escrows
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={item} className="flex items-center justify-center gap-8 mt-16 flex-wrap">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-6xl mx-auto">
          <motion.div variants={item} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything you need to<br /><span className="neon-text">protect payments</span></h2>
            <p className="text-gray-400 mt-4 max-w-xl mx-auto">From simple freelance gigs to enterprise contracts — EscrowFlow scales with your business.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={item}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl bg-surface/60 border border-white/5 hover:border-white/10 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-4xl mx-auto">
          <motion.div variants={item} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">How it works</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Escrow", desc: "Set terms, milestones, and invite the other party. AI helps optimize your contract.", color: "text-neon" },
              { step: "02", title: "Lock Funds", desc: "Buyer deposits funds into escrow. Money is held securely until conditions are met.", color: "text-neon-purple" },
              { step: "03", title: "Release on Approval", desc: "Approve milestones to release funds. Disputes are resolved by certified arbitrators.", color: "text-neon-green" },
            ].map((s) => (
              <motion.div key={s.step} variants={item} className="text-center">
                <div className={`text-5xl font-black ${s.color} opacity-30 mb-4`}>{s.step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="max-w-5xl mx-auto">
          <motion.div variants={item} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Loved by builders</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <motion.div key={t.name} variants={item} className="p-6 rounded-2xl bg-surface/60 border border-white/5">
                <div className="flex gap-0.5 mb-4">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}</div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-br from-neon/10 to-neon-purple/10 border border-neon/20">
          <Lock className="w-10 h-10 text-neon mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">Ready to secure your payments?</h2>
          <p className="text-gray-400 mb-8">Start free. No credit card required. Pay only when you're ready.</p>
          <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-neon to-neon-purple text-bg font-bold text-lg shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] transition-all hover:scale-105">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-neon-purple flex items-center justify-center"><span className="text-bg font-black text-sm">E</span></div>
            <span className="text-sm font-bold neon-text">EscrowFlow</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/explore" className="hover:text-white transition-colors">Explorer</Link>
            <a href="#" className="hover:text-white transition-colors">API Docs</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
          <p className="text-xs text-gray-600">© 2026 EscrowFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
