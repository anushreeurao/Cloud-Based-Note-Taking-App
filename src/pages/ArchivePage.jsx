import { ArchiveRestore } from "lucide-react";
import { useUIStore } from "../store/useUIStore";
import { useNotesContext } from "../contexts/NotesContext";
import { EmptyState } from "../components/common/EmptyState";
import { NotesGrid } from "../components/notes/NotesGrid";

export default function ArchivePage() {
  const { openEditor } = useUIStore();
  const { notesByState, archiveNote, moveToTrash, togglePin, reorderNotes } = useNotesContext();
  const notes = notesByState.archived;

  return (
    <div className="space-y-4 pb-20">
      <div className="glass-panel rounded-3xl p-6">
        <h1 className="font-display text-3xl text-white">Archive</h1>
        <p className="mt-2 text-sm text-slate-200">Quiet storage for completed notes and old ideas.</p>
      </div>

      {!notes.length ? (
        <EmptyState
          title="No archived notes"
          subtitle="Archive cards from the dashboard to keep your main workspace clean."
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

      <div className="glass-panel rounded-2xl p-4 text-sm text-slate-200">
        <p className="inline-flex items-center gap-2">
          <ArchiveRestore className="h-4 w-4 text-cyan-100" />
          Click archive again on any card to restore it to active notes.
        </p>
      </div>
    </div>
  );
}
