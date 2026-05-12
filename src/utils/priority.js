export const PRIORITY_LEVELS = ["low", "medium", "high", "critical"];

export const PRIORITY_META = {
  low: {
    label: "Low",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-300/35",
    card: "border-emerald-300/45 from-emerald-300/10 to-emerald-400/5 shadow-[0_0_30px_rgba(52,211,153,0.15)]",
  },
  medium: {
    label: "Medium",
    chip: "bg-amber-500/20 text-amber-200 border-amber-300/40",
    card: "border-amber-300/45 from-amber-300/10 to-amber-500/5 shadow-[0_0_30px_rgba(245,158,11,0.14)]",
  },
  high: {
    label: "High",
    chip: "bg-orange-500/20 text-orange-200 border-orange-300/40",
    card: "border-orange-300/50 from-orange-300/12 to-orange-500/5 shadow-[0_0_30px_rgba(249,115,22,0.16)]",
  },
  critical: {
    label: "Critical",
    chip: "bg-red-500/20 text-red-200 border-red-300/40",
    card: "border-red-300/50 from-red-300/12 to-red-500/5 shadow-[0_0_34px_rgba(239,68,68,0.2)]",
  },
};
