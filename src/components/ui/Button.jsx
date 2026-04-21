import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const variants = {
  primary: "bg-neon text-bg font-semibold hover:bg-neon/90 shadow-[0_0_20px_rgba(0,243,255,0.2)]",
  secondary: "bg-surface-2 text-white border border-white/10 hover:border-neon/50 hover:bg-surface-2/80",
  danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
  ghost: "text-gray-400 hover:text-white hover:bg-white/5",
  outline: "border border-white/10 text-gray-300 hover:border-neon/50 hover:text-neon",
};

const sizes = {
  sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
  md: "h-10 px-4 text-sm rounded-xl gap-2",
  lg: "h-12 px-6 text-base rounded-xl gap-2.5",
};

export const Button = forwardRef(({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => (
  <motion.button
    ref={ref}
    whileTap={{ scale: 0.97 }}
    whileHover={{ scale: 1.01 }}
    className={cn(
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon/30 disabled:opacity-40 disabled:pointer-events-none cursor-pointer",
      variants[variant],
      sizes[size],
      className
    )}
    disabled={isLoading || props.disabled}
    {...props}
  >
    {isLoading && (
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    )}
    {children}
  </motion.button>
));
Button.displayName = "Button";
