import { motion } from "framer-motion";
import { Archive, Pin, Trash2, CalendarClock, Sparkles } from "lucide-react";
import { PRIORITY_META } from "../../utils/priority";
import { readableDate, relativeTime } from "../../utils/date";
import { PriorityPill } from "./PriorityPill";
import { MediaStrip } from "./MediaStrip";

export function NoteCard({
  note,
  onOpen,
  onPin,
  onArchive,
  onTrash,
  draggableProps = {},
}) {
  const meta = PRIORITY_META[note.priority] ?? PRIORITY_META.medium;

  return (
    <motion.article
      layout
      whileHover={{ y: -4 }}
      className={`group rounded-2xl border bg-gradient-to-br p-4 backdrop-blur-xl ${meta.card}`}
      {...draggableProps}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="line-clamp-1 font-display text-xl text-white">{note.title || "Untitled"}</h3>
          <p className="mt-1 text-xs text-slate-300">Updated {relativeTime(note.updatedAt)}</p>
        </div>
        <PriorityPill value={note.priority} compact />
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-100">
        {note.summary || note.contentText || "No content yet"}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {note.tags?.slice(0, 4).map((tag) => (
          <span key={`${note.id}-${tag}`} className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
            #{tag}
          </span>
        ))}
        {note.smartCategory ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2 py-0.5 text-[11px] text-cyan-100">
            <Sparkles className="h-3 w-3" />
            {note.smartCategory}
          </span>
        ) : null}
      </div>

      {note.dueDate ? (
        <div className="mt-3 inline-flex items-center gap-1 rounded-lg border border-amber-200/20 bg-amber-200/10 px-2 py-1 text-[11px] text-amber-100">
          <CalendarClock className="h-3.5 w-3.5" />
          Due {readableDate(note.dueDate)}
        </div>
      ) : null}

      <MediaStrip media={note.media} />

      <div className="mt-4 flex items-center gap-2 opacity-70 transition group-hover:opacity-100">
        <button
          type="button"
          onClick={() => onOpen(note)}
          className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-xs text-white"
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => onPin(note)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-white"
        >
          <Pin className="h-3.5 w-3.5" />
          {note.pinned ? "Unpin" : "Pin"}
        </button>
        <button
          type="button"
          onClick={() => onArchive(note)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-white"
        >
          <Archive className="h-3.5 w-3.5" />
          {note.archived ? "Unarchive" : "Archive"}
        </button>
        <button
          type="button"
          onClick={() => onTrash(note)}
          className="inline-flex items-center gap-1 rounded-lg border border-red-300/30 bg-red-300/15 px-2.5 py-1 text-xs text-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Trash
        </button>
      </div>
    </motion.article>
  );
}
