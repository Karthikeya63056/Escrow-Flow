import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-5xl md:text-7xl font-extrabold mb-6"
      >
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-neonBlue to-neonPurple">
          Trust. Guaranteed.
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className="text-xl text-gray-400 max-w-2xl mb-8"
      >
        The simplest and safest virtual escrow platform for freelancers and clients.
        Don&apos;t get ghosted. Get paid.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="flex items-center space-x-4"
      >
        <Link
          to="/auth?signup=true"
          className="px-8 py-3 bg-neonBlue text-darkBg font-bold rounded-md hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,243,255,0.4)]"
        >
          Start for Free
        </Link>
        <Link
          to="/auth"
          className="px-8 py-3 border border-white/20 text-gray-300 font-bold rounded-md hover:border-neonBlue hover:text-white transition-colors"
        >
          Sign In
        </Link>
      </motion.div>
    </div>
  );
}
