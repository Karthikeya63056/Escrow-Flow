import { motion } from "framer-motion";

export function Loader({ fullScreen = false }) {
  const loaderCore = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        className="w-16 h-16 border-4 border-t-neonBlue border-r-neonPurple border-b-transparent border-l-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ ease: "linear", duration: 1, repeat: Infinity }}
      />
      <p className="text-neonBlue text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-darkBg flex items-center justify-center z-50">
        {loaderCore}
      </div>
    );
  }

  return <div className="p-8 flex justify-center w-full">{loaderCore}</div>;
}
