import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../store";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/FormElements";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      id: "user-1",
      email: email || "alex@escrowflow.com",
      name: name || "Alex Morgan",
      role: "buyer",
    });
    toast.success(isLogin ? "Welcome back!" : "Account created!");
    navigate("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center mesh-gradient z-50">
      {/* Decorative blobs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-neon/10 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "3s" }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", damping: 25 }}
        className="w-full max-w-md mx-4"
      >
        <div className="glass-strong rounded-3xl p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon via-neon-purple to-neon-pink" />

          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon to-neon-purple mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.3)]">
              <span className="text-2xl font-black text-bg">E</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isLogin ? "Sign in to your escrow dashboard" : "Start securing your transactions"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div key="name" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <Input label="Full Name" placeholder="Alex Morgan" value={name} onChange={(e) => setName(e.target.value)} />
                </motion.div>
              )}
            </AnimatePresence>
            <Input label="Email" type="email" placeholder="alex@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button type="submit" className="w-full">
              {isLogin ? "Sign In" : "Create Account"} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-500 hover:text-neon transition-colors">
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
