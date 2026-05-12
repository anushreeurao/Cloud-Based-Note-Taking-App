import { useMemo, useState } from "react";
import { NoteCard } from "./NoteCard";
import { useUIStore } from "../../store/useUIStore";

const priorityWeight = { critical: 4, high: 3, medium: 2, low: 1 };

export function NotesGrid({
  notes,
  onOpen,
  onPin,
  onArchive,
  onTrash,
  onReorder,
}) {
  const { search, filters } = useUIStore();
  const [dragId, setDragId] = useState(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let results = notes.filter((note) => {
      const haystack = `${note.title} ${note.contentText} ${(note.tags || []).join(" ")}`.toLowerCase();
      if (q && !haystack.includes(q)) return false;
      if (filters.priority !== "all" && note.priority !== filters.priority) return false;
      if (filters.tags.length && !filters.tags.some((tag) => note.tags?.includes(tag))) return false;
      if (filters.mediaType !== "all" && !(note.media || []).some((item) => item.type === filters.mediaType)) {
        return false;
      }
      return true;
    });

    results = [...results].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      if (filters.sortBy === "priority") return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      if (filters.sortBy === "oldest") return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
      return (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0);
    });

    return results;
  }, [filters, notes, search]);

  const handleDrop = async (targetId) => {
    if (!dragId || dragId === targetId) return;
    const ids = visible.map((item) => item.id);
    const sourceIndex = ids.indexOf(dragId);
    const targetIndex = ids.indexOf(targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    ids.splice(sourceIndex, 1);
    ids.splice(targetIndex, 0, dragId);
    setDragId(null);
    await onReorder(ids);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {visible.map((note) => (
        <div
          key={note.id}
          draggable
          onDragStart={() => setDragId(note.id)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => handleDrop(note.id)}
          className={dragId === note.id ? "opacity-70" : ""}
        >
          <NoteCard
            note={note}
            onOpen={onOpen}
            onPin={onPin}
            onArchive={onArchive}
            onTrash={onTrash}
          />
        </div>
      ))}
    </div>
  );
}
