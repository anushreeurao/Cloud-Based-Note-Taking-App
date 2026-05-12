import { Trash2, Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import { useNotesContext } from "../contexts/NotesContext";
import { EmptyState } from "../components/common/EmptyState";

export default function TrashPage() {
  const { notesByState, restoreFromTrash, purgeNote } = useNotesContext();
  const notes = notesByState.trash;

  return (
    <div className="space-y-4 pb-20">
      <div className="glass-panel rounded-3xl p-6">
        <h1 className="font-display text-3xl text-white">Trash</h1>
        <p className="mt-2 text-sm text-slate-200">Recover notes or delete permanently.</p>
      </div>

      {!notes.length ? (
        <EmptyState title="Trash is empty" subtitle="Deleted notes will show up here for recovery." />
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel flex flex-col gap-3 rounded-2xl p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="font-display text-xl text-white">{note.title}</h3>
                <p className="text-sm text-slate-300">{note.summary || note.contentText?.slice(0, 130)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => restoreFromTrash(note.id)}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-300/35 bg-emerald-300/15 px-3 py-1.5 text-xs text-emerald-100"
                >
                  <Undo2 className="h-3.5 w-3.5" />
                  Recover
                </button>
                <button
                  onClick={() => purgeNote(note)}
                  className="inline-flex items-center gap-1 rounded-lg border border-red-300/35 bg-red-300/15 px-3 py-1.5 text-xs text-red-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete forever
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
