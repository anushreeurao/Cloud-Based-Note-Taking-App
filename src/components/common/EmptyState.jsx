import { motion } from "framer-motion";

export function EmptyState({ title, subtitle, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel rounded-3xl border border-white/10 p-8 text-center"
    >
      <h3 className="font-display text-2xl text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </motion.div>
  );
}
