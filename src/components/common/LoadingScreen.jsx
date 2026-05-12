import { motion } from "framer-motion";

export function LoadingScreen({ label = "Loading..." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-900 bg-ambient-radial p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel flex w-full max-w-md flex-col items-center gap-4 rounded-3xl p-8 text-center"
      >
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-200/20 border-t-cyan-300" />
        <p className="text-sm tracking-wide text-slate-200">{label}</p>
      </motion.div>
    </div>
  );
}
