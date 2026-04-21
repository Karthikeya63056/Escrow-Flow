import { motion } from "framer-motion";
import { useAuthStore } from "../../store";
import { Card, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/FormElements";
import { formatCurrency } from "../../lib/utils";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Shield, Star, TrendingUp, CheckCircle2,
  LogOut, Award, Zap,
} from "lucide-react";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const stats = [
  { label: "Escrows Completed", value: "23", icon: CheckCircle2, color: "text-neon-green bg-neon-green/10" },
  { label: "Total Earned", value: "$84,500", icon: TrendingUp, color: "text-neon bg-neon/10" },
  { label: "Disputes Won", value: "2/2", icon: Shield, color: "text-neon-purple bg-neon-purple/10" },
  { label: "Avg Rating", value: "4.9", icon: Star, color: "text-warning bg-warning/10" },
];

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const trustScore = 92;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl mx-auto">
      {/* Hero */}
      <motion.div variants={item}>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neon/5 via-neon-purple/5 to-neon-pink/5" />
          <div className="relative flex flex-col sm:flex-row items-center gap-6 p-2">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon to-neon-purple flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.3)]">
              <span className="text-3xl font-black text-bg">{user?.name?.charAt(0)}</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-sm text-gray-400 flex items-center gap-2 justify-center sm:justify-start mt-1">
                <Mail className="w-4 h-4" /> {user?.email}
              </p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="neon">{user?.role}</Badge>
                <Badge variant="green"><CheckCircle2 className="w-3 h-3" /> Verified</Badge>
              </div>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Trust Score */}
      <motion.div variants={item}>
        <Card className="relative overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg viewBox="0 0 120 120" className="w-28 h-28">
                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                <motion.circle
                  cx="60" cy="60" r="50"
                  stroke="url(#scoreGrad)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={314}
                  initial={{ strokeDashoffset: 314 }}
                  animate={{ strokeDashoffset: 314 - (trustScore / 100) * 314 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="rgb(0,243,255)" />
                    <stop offset="100%" stopColor="rgb(139,92,246)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-white">{trustScore}</span>
                <span className="text-[10px] text-gray-500 uppercase">Trust</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-neon" />
                <h3 className="text-lg font-semibold text-white">Reputation Score</h3>
              </div>
              <p className="text-sm text-gray-400">Your trust score is calculated from completed escrows, dispute history, and response time.</p>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1 text-xs text-neon-green"><Zap className="w-3 h-3" /> Fast Responder</div>
                <div className="flex items-center gap-1 text-xs text-neon"><Shield className="w-3 h-3" /> No Disputes</div>
                <div className="flex items-center gap-1 text-xs text-neon-purple"><Star className="w-3 h-3" /> Top Rated</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <motion.div key={s.label} variants={item}>
            <Card className="text-center">
              <div className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
