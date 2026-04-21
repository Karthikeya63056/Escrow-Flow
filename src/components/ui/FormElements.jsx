import { cn } from "../../lib/utils";

export function Badge({ className, children, variant = "default" }) {
  const styles = {
    default: "bg-white/5 text-gray-300 border-white/10",
    neon: "bg-neon/10 text-neon border-neon/20",
    purple: "bg-neon-purple/10 text-neon-purple border-neon-purple/20",
    green: "bg-neon-green/10 text-neon-green border-neon-green/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    warning: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[variant], className)}>
      {children}
    </span>
  );
}

export function Input({ className, label, error, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <input
        className={cn(
          "w-full h-10 px-4 rounded-xl bg-surface-2 border border-white/10 text-white placeholder-gray-500",
          "focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-all",
          error && "border-danger/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Textarea({ className, label, error, ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <textarea
        className={cn(
          "w-full px-4 py-3 rounded-xl bg-surface-2 border border-white/10 text-white placeholder-gray-500 resize-none",
          "focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-all",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function Select({ className, label, options = [], ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-sm font-medium text-gray-300">{label}</label>}
      <select
        className={cn(
          "w-full h-10 px-4 rounded-xl bg-surface-2 border border-white/10 text-white",
          "focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-all",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export function Skeleton({ className }) {
  return <div className={cn("animate-pulse rounded-xl bg-white/5", className)} />;
}

export function Separator({ className }) {
  return <div className={cn("h-px w-full bg-white/5", className)} />;
}
