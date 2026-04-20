import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Card({ className, children, hoverEffect = false, ...props }) {
  const baseClasses = "glass-panel rounded-xl p-6 shadow-xl relative overflow-hidden";
  
  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(baseClasses, "hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] cursor-pointer transition-shadow", className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(baseClasses, className)} {...props}>
      {children}
    </div>
  );
}
