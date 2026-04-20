import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { supabase, isMockMode } from "../lib/supabase";
import { motion } from "framer-motion";

export function Profile() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (!isMockMode) {
      await supabase.auth.signOut();
    }
    navigate("/auth");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8 max-w-2xl mx-auto"
    >
      <div className="glass-panel p-8 rounded-xl border border-white/5 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-neonBlue to-neonPurple mx-auto mb-6 flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          <span className="text-3xl font-bold text-white">
            {profile?.full_name?.charAt(0) || "U"}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {profile?.full_name || "User Profile"}
        </h1>
        <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-sm text-neonBlue mb-8 uppercase tracking-wider font-semibold">
          {profile?.role || "user"}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-8">
          <div className="bg-darkBg p-4 rounded-lg border border-white/5">
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="text-gray-200">{profile?.email || "N/A"}</p>
          </div>
          <div className="bg-darkBg p-4 rounded-lg border border-white/5">
            <p className="text-sm text-gray-500 mb-1">Joined</p>
            <p className="text-gray-200">
              {profile?.created_at
                ? new Date(profile.created_at).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          <div className="bg-darkBg p-4 rounded-lg border border-white/5">
            <p className="text-sm text-gray-500 mb-1">Ghosting Score</p>
            <p className="text-green-400 font-bold">{profile?.ghosting_score || 0}%</p>
          </div>
          <div className="bg-darkBg p-4 rounded-lg border border-white/5">
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <p className="text-neonPurple font-bold capitalize">{profile?.role || "N/A"}</p>
          </div>
        </div>

        <Button onClick={handleSignOut} variant="danger" className="w-full">
          Sign Out
        </Button>
      </div>
    </motion.div>
  );
}
