import { useMemo } from "react";
import { motion } from "framer-motion";
import { Pin, Flame, Clock3 } from "lucide-react";
import { useUIStore } from "../store/useUIStore";
import { useNotesContext } from "../contexts/NotesContext";
import { LoadingScreen } from "../components/common/LoadingScreen";
import { EmptyState } from "../components/common/EmptyState";
import { NotesToolbar } from "../components/notes/NotesToolbar";
import { NotesGrid } from "../components/notes/NotesGrid";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="glass-panel rounded-2xl p-4">
      <Icon className="h-4 w-4 text-cyan-100" />
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-300">{label}</p>
      <p className="mt-1 font-display text-2xl text-white">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const { openEditor } = useUIStore();
  const { notesByState, loading, togglePin, archiveNote, moveToTrash, reorderNotes } = useNotesContext();

  const notes = notesByState.active;
  const tags = useMemo(
    () => [...new Set(notes.flatMap((note) => note.tags || []))].sort(),
    [notes]
  );

  const stats = useMemo(
    () => ({
      pinned: notes.filter((note) => note.pinned).length,
      critical: notes.filter((note) => note.priority === "critical").length,
      recent: notes.filter((note) => note.updatedAt?.seconds > Date.now() / 1000 - 86400).length,
    }),
    [notes]
  );

  if (loading) return <LoadingScreen label="Syncing your notes..." />;

  return (
    <div className="space-y-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl p-6"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-100/80">Dashboard</p>
        <h1 className="mt-2 font-display text-4xl text-white">Your premium note space</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200">
          Organize rich notes by priority, media, and intent with real-time sync and intelligent summaries.
        </p>
      </motion.div>

      <div className="grid gap-3 md:grid-cols-3">
        <StatCard icon={Pin} label="Pinned" value={stats.pinned} />
        <StatCard icon={Flame} label="Critical" value={stats.critical} />
        <StatCard icon={Clock3} label="Updated Today" value={stats.recent} />
      </div>

      <NotesToolbar tags={tags} />

      {!notes.length ? (
        <EmptyState
          title="Start your first premium note"
          subtitle="Capture ideas with text, audio, and sketches."
          action={
            <button
              onClick={() => openEditor()}
              className="rounded-xl border border-cyan-200/35 bg-cyan-300/20 px-4 py-2 text-sm text-cyan-100"
            >
              Create note
            </button>
          }
        />
      ) : (
        <NotesGrid
          notes={notes}
          onOpen={(note) => openEditor(note.id)}
          onPin={(note) => togglePin(note.id, note.pinned)}
          onArchive={(note) => archiveNote(note.id, note.archived)}
          onTrash={(note) => moveToTrash(note.id)}
          onReorder={reorderNotes}
        />
      )}
    </div>
  );
}
