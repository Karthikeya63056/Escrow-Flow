import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Card({ className, children, hover = false, glow = false, ...props }) {
  const Comp = hover ? motion.div : "div";
  const motionProps = hover ? { whileHover: { y: -4, scale: 1.01 }, transition: { type: "spring", stiffness: 300, damping: 20 } } : {};

  return (
    <Comp
      className={cn(
        "glass rounded-2xl p-6 relative overflow-hidden",
        hover && "cursor-pointer hover:shadow-lg transition-shadow",
        glow && "neon-glow",
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("flex items-center justify-between mb-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn("text-lg font-semibold text-white", className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn("text-sm text-gray-400", className)}>{children}</p>;
}
