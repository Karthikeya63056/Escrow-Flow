import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CheckCircle2, X, Zap, Shield, Crown, ArrowRight } from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const PLANS = [
  {
    id: "free", name: "Starter", price: 0, period: "forever",
    description: "Perfect for trying out EscrowFlow",
    icon: Shield, color: "text-gray-300", gradient: "from-gray-500 to-gray-700",
    features: [
      { text: "Up to 3 active escrows", included: true },
      { text: "Basic milestone tracking", included: true },
      { text: "Email notifications", included: true },
      { text: "Community support", included: true },
      { text: "1.5% platform fee", included: true },
      { text: "AI insights", included: false },
      { text: "Automation rules", included: false },
      { text: "API access", included: false },
      { text: "Priority arbitration", included: false },
    ],
    cta: "Start Free",
  },
  {
    id: "pro", name: "Professional", price: 29, period: "/month",
    description: "For freelancers and growing teams",
    icon: Zap, color: "text-neon", gradient: "from-neon to-blue-500",
    popular: true,
    features: [
      { text: "Unlimited active escrows", included: true },
      { text: "Advanced milestone builder", included: true },
      { text: "Real-time notifications", included: true },
      { text: "Priority support", included: true },
      { text: "0.8% platform fee", included: true },
      { text: "AI risk insights", included: true },
      { text: "5 automation rules", included: true },
      { text: "API access (1K req/day)", included: false },
      { text: "Priority arbitration", included: false },
    ],
    cta: "Start Pro Trial",
  },
  {
    id: "enterprise", name: "Enterprise", price: 99, period: "/month",
    description: "For agencies and high-volume teams",
    icon: Crown, color: "text-yellow-400", gradient: "from-yellow-400 to-orange-500",
    features: [
      { text: "Unlimited everything", included: true },
      { text: "White-label mode", included: true },
      { text: "Real-time + Slack notifications", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "0.3% platform fee", included: true },
      { text: "Full AI suite", included: true },
      { text: "Unlimited automation rules", included: true },
      { text: "API access (unlimited)", included: true },
      { text: "Priority arbitration (< 24hr)", included: true },
    ],
    cta: "Contact Sales",
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen py-20 px-6">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div variants={item} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">Simple, transparent <span className="neon-text">pricing</span></h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">Start free. Upgrade when you need more power. No hidden fees.</p>

          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!annual ? "text-white" : "text-gray-500"}`}>Monthly</span>
            <button onClick={() => setAnnual(!annual)} className={`w-12 h-6 rounded-full relative transition-all ${annual ? "bg-neon/30" : "bg-white/10"}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all ${annual ? "left-6" : "left-0.5"}`} />
            </button>
            <span className={`text-sm ${annual ? "text-white" : "text-gray-500"}`}>Annual</span>
            {annual && <span className="text-xs px-2 py-0.5 rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">Save 20%</span>}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const displayPrice = annual ? Math.round(plan.price * 0.8) : plan.price;
            return (
              <motion.div
                key={plan.id}
                variants={item}
                whileHover={{ y: -4 }}
                className={`relative p-8 rounded-2xl border transition-all ${
                  plan.popular
                    ? "border-neon/30 bg-neon/5 shadow-[0_0_30px_rgba(0,243,255,0.1)]"
                    : "border-white/5 bg-surface/60"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-neon to-neon-purple text-bg text-xs font-bold">
                    Most Popular
                  </div>
                )}

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400 mt-1 mb-6">{plan.description}</p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-white">${displayPrice}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>

                <Link
                  to="/auth"
                  className={`block w-full text-center py-3 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-neon to-neon-purple text-bg hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {plan.cta} <ArrowRight className="w-4 h-4 inline ml-1" />
                </Link>

                <div className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <div key={f.text} className="flex items-center gap-2">
                      {f.included ? (
                        <CheckCircle2 className="w-4 h-4 text-neon-green flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-600 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${f.included ? "text-gray-300" : "text-gray-600"}`}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <motion.div variants={item} className="mt-20 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Questions?</h3>
          <p className="text-sm text-gray-400">Email us at <span className="text-neon">support@escrowflow.com</span> or ask our AI assistant (Ctrl+J)</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
