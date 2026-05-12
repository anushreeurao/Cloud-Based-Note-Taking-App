import clsx from "clsx";
import { PRIORITY_META } from "../../utils/priority";

export function PriorityPill({ value = "medium", compact = false }) {
  const meta = PRIORITY_META[value] ?? PRIORITY_META.medium;
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-1 font-medium",
        compact ? "text-[11px]" : "text-xs",
        meta.chip
      )}
    >
      {meta.label}
    </span>
  );
}
