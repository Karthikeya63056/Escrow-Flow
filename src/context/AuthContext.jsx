import { createContext, useContext, useEffect, useState } from "react";
import { supabase, isMockMode } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMockMode) {
      // Mock user for testing
      setUser({ id: "mock-user-123", email: "test@example.com" });
      setProfile({ id: "mock-user-123", role: "client", full_name: "Mock Client" });
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,
    isMockMode,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
