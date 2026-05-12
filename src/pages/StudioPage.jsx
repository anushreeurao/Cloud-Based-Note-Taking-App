import { useState } from "react";
import toast from "react-hot-toast";
import { ScribblePad } from "../components/scribble/ScribblePad";
import { useNotesContext } from "../contexts/NotesContext";

export default function StudioPage() {
  const { createNote, uploadMediaFile } = useNotesContext();
  const [title, setTitle] = useState("Scribble Idea");

  const saveScribbleAsNote = async (file) => {
    const mediaItem = await uploadMediaFile({ file, type: "scribble" });
    if (!mediaItem) return;

    await createNote({
      title,
      priority: "medium",
      tags: ["scribble"],
      contentHtml: "<p>Sketch captured from studio.</p>",
      contentText: "Sketch captured from studio.",
      media: [{ ...mediaItem, type: "scribble" }],
    });

    toast.success("Scribble saved as note.");
  };

  return (
    <div className="space-y-4 pb-20">
      <div className="glass-panel rounded-3xl p-6">
        <h1 className="font-display text-3xl text-white">Scribble Studio</h1>
        <p className="mt-2 text-sm text-slate-200">
          Freehand whiteboard for quick sketches and visual thinking.
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-4">
        <label className="text-xs uppercase tracking-[0.14em] text-slate-300">Scribble Note Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
        />
      </div>

      <ScribblePad onSave={saveScribbleAsNote} />
    </div>
  );
}
