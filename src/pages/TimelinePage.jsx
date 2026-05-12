import { useMemo } from "react";
import { Clock3 } from "lucide-react";
import { useNotesContext } from "../contexts/NotesContext";
import { readableDate } from "../utils/date";

export default function TimelinePage() {
  const { notes } = useNotesContext();

  const timeline = useMemo(
    () =>
      notes
        .flatMap((note) =>
          (note.history || []).map((entry) => ({
            noteId: note.id,
            noteTitle: note.title,
            ...entry,
          }))
        )
        .sort((a, b) => b.at - a.at),
    [notes]
  );

  return (
    <div className="space-y-4 pb-20">
      <div className="glass-panel rounded-3xl p-6">
        <h1 className="font-display text-3xl text-white">Edit Timeline</h1>
        <p className="mt-2 text-sm text-slate-200">
          Trace note evolution with action history and auto-save checkpoints.
        </p>
      </div>

      <div className="space-y-3">
        {timeline.slice(0, 150).map((item, index) => (
          <div key={`${item.noteId}-${item.at}-${index}`} className="glass-panel rounded-2xl p-4">
            <p className="inline-flex items-center gap-2 text-xs text-cyan-100">
              <Clock3 className="h-3.5 w-3.5" />
              {readableDate(item.at)}
            </p>
            <h3 className="mt-2 font-display text-lg text-white">{item.noteTitle}</h3>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-300">{item.action?.replaceAll("_", " ")}</p>
            <p className="mt-2 text-sm text-slate-200">{item.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
