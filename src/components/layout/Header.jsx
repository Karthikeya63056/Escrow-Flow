import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../common/Button";
import { LogOut, User } from "lucide-react";

export function Header() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-darkBg/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-neonBlue to-neonPurple flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
            FixMyItch
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              {profile?.role === 'freelancer' && (
                <Link to="/projects" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Find Work
                </Link>
              )}
              <div className="flex items-center pl-4 border-l border-white/10 space-x-3">
                <Link to="/profile" className="flex items-center text-gray-300 hover:text-white transition-colors">
                  <User className="w-5 h-5 mr-1" />
                  <span className="text-sm hidden sm:inline">{profile?.full_name || 'Profile'}</span>
                </Link>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors p-1" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link to="/auth?signup=true">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
