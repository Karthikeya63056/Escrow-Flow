import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore, useUIStore } from "../../store";
import { formatRelative } from "../../lib/utils";
import { X, Check, CheckCheck, Bell, AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";

const typeConfig = {
  success: { icon: CheckCircle2, color: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/20" },
  info: { icon: Info, color: "text-neon", bg: "bg-neon/10", border: "border-neon/20" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
  danger: { icon: XCircle, color: "text-danger", bg: "bg-danger/10", border: "border-danger/20" },
};

export function NotificationCenter() {
  const { notificationsOpen, setNotificationsOpen } = useUIStore();
  const { notifications, markAsRead, markAllRead, dismiss, unreadCount } = useNotificationStore();
  const unread = unreadCount();

  return (
    <AnimatePresence>
      {notificationsOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setNotificationsOpen(false)}
            className="fixed inset-0 z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="absolute right-0 top-full mt-2 w-96 z-50 glass-strong rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-semibold text-white">Notifications</span>
                {unread > 0 && (
                  <span className="text-[10px] font-bold bg-neon text-bg px-1.5 py-0.5 rounded-full">{unread}</span>
                )}
              </div>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-neon hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5">
              {notifications.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-sm">No notifications</div>
              ) : (
                notifications.map((n) => {
                  const config = typeConfig[n.type] || typeConfig.info;
                  const Icon = config.icon;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`flex gap-3 p-4 transition-colors ${n.read ? "opacity-60" : "hover:bg-white/[0.02]"}`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{n.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-[10px] text-gray-600 mt-1">{formatRelative(n.time)}</p>
                      </div>
                      <div className="flex flex-col gap-1 flex-shrink-0">
                        {!n.read && (
                          <button onClick={() => markAsRead(n.id)} className="p-1 text-gray-600 hover:text-neon-green transition-colors" title="Mark read">
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                        <button onClick={() => dismiss(n.id)} className="p-1 text-gray-600 hover:text-danger transition-colors" title="Dismiss">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
