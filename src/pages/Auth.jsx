import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase, isMockMode } from "../lib/supabase";
import { ROLES } from "../lib/constants";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name required").optional(),
  role: z.enum([ROLES.CLIENT, ROLES.FREELANCER]).optional(),
});

export function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("signup") === "true");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(authSchema),
    defaultValues: { role: ROLES.CLIENT }
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      if (isMockMode) {
        await new Promise(r => setTimeout(r, 1000));
        navigate("/dashboard");
        return;
      }

      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              role: data.role
            }
          }
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (signInError) throw signInError;
      }
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
              {isSignUp ? "Create an Account" : "Welcome Back"}
            </h2>
            <p className="text-gray-400 mt-2">
              {isSignUp ? "Join the safest escrow platform" : "Sign in to manage your projects"}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <input
                    {...register("fullName")}
                    type="text"
                    className="w-full bg-darkBg border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">I want to...</label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="flex items-center space-x-2 bg-darkBg border border-white/10 rounded-md p-3 cursor-pointer hover:border-neonBlue transition-colors">
                      <input type="radio" value={ROLES.CLIENT} {...register("role")} className="text-neonBlue bg-darkBg border-white/20" />
                      <span className="text-sm text-gray-300">Hire freelancers</span>
                    </label>
                    <label className="flex items-center space-x-2 bg-darkBg border border-white/10 rounded-md p-3 cursor-pointer hover:border-neonBlue transition-colors">
                      <input type="radio" value={ROLES.FREELANCER} {...register("role")} className="text-neonPurple bg-darkBg border-white/20" />
                      <span className="text-sm text-gray-300">Work on projects</span>
                    </label>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-darkBg border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                {...register("password")}
                type="password"
                className="w-full bg-darkBg border border-white/10 rounded-md px-4 py-2 text-white focus:outline-none focus:border-neonBlue transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-red-400 text-sm text-center">{serverError}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full mt-6"
              isLoading={isSubmitting}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-400 hover:text-neonBlue transition-colors focus:outline-none"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
