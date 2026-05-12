import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  CalendarClock,
  Check,
  ImagePlus,
  Mic,
  Save,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useUIStore } from "../../store/useUIStore";
import { useNotesContext } from "../../contexts/NotesContext";
import { useAuth } from "../../hooks/useAuth";
import { PRIORITY_LEVELS } from "../../utils/priority";
import { summarizeNoteText } from "../../utils/aiAssist";
import { useDebouncedEffect } from "../../hooks/useDebouncedEffect";
import { RichTextEditor } from "./RichTextEditor";
import { AudioRecorder } from "../audio/AudioRecorder";
import { ScribblePad } from "../scribble/ScribblePad";

function parseTags(input = "") {
  return input
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function NoteEditorModal() {
  const { user } = useAuth();
  const { isEditorOpen, activeNoteId, draftSeed, closeEditor } = useUIStore();
  const { notes, createNote, updateNote, uploadMediaFile, saving } = useNotesContext();
  const existingNote = useMemo(
    () => notes.find((item) => item.id === activeNoteId),
    [activeNoteId, notes]
  );

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [contentHtml, setContentHtml] = useState("");
  const [contentText, setContentText] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [media, setMedia] = useState([]);
  const [speechEnabled, setSpeechEnabled] = useState(false);

  useEffect(() => {
    if (!isEditorOpen) return;
    const base = existingNote || draftSeed || {};
    setTitle(base.title || "");
    setPriority(base.priority || "medium");
    setContentHtml(base.contentHtml || "");
    setContentText(base.contentText || "");
    setTagsInput((base.tags || []).join(", "));
    setDueDate(
      base.dueDate
        ? new Date(base.dueDate?.toDate ? base.dueDate.toDate() : base.dueDate)
            .toISOString()
            .slice(0, 16)
        : ""
    );
    setMedia(base.media || []);
  }, [draftSeed, existingNote, isEditorOpen]);

  useDebouncedEffect(
    () => {
      if (!existingNote || !isEditorOpen) return;
      updateNote(
        existingNote.id,
        {
          title: title || "Untitled Note",
          contentHtml,
          contentText,
          priority,
          tags: parseTags(tagsInput),
          dueDate: dueDate ? new Date(dueDate) : null,
          media,
        },
        "autosave"
      ).catch(() => {});
    },
    [title, contentHtml, contentText, priority, tagsInput, dueDate, media, isEditorOpen, existingNote?.id],
    900
  );

  const aiSummary = useMemo(() => summarizeNoteText(contentText), [contentText]);

  const attachFiles = async (files) => {
    if (!files?.length) return;
    const uploads = await Promise.all(
      Array.from(files).map((file) => uploadMediaFile({ file, type: "image", noteId: existingNote?.id }))
    );
    setMedia((prev) => [...prev, ...uploads.filter(Boolean).map((item) => ({ ...item, type: "image" }))]);
    toast.success("Images attached.");
  };

  const attachAudio = async (file, duration) => {
    const uploaded = await uploadMediaFile({
      file,
      type: "audio",
      noteId: existingNote?.id,
      extra: { duration },
    });
    if (uploaded) {
      setMedia((prev) => [...prev, { ...uploaded, type: "audio", duration }]);
    }
  };

  const attachScribble = async (file) => {
    const uploaded = await uploadMediaFile({
      file,
      type: "scribble",
      noteId: existingNote?.id,
    });
    if (uploaded) {
      setMedia((prev) => [...prev, { ...uploaded, type: "scribble" }]);
      toast.success("Scribble attached.");
    }
  };

  const handleSave = async () => {
    if (!user?.uid) return;

    const payload = {
      title: title || "Untitled Note",
      contentHtml,
      contentText,
      priority,
      tags: parseTags(tagsInput),
      dueDate: dueDate ? new Date(dueDate) : null,
      media,
      workspaceMood: document.documentElement.dataset.mood || "focus",
    };

    if (existingNote?.id) {
      await updateNote(existingNote.id, payload, "edited");
    } else {
      await createNote(payload);
    }
    closeEditor();
  };

  const appendSpeechText = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    setSpeechEnabled(true);

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setContentText((prev) => `${prev} ${transcript}`.trim());
      setContentHtml((prev) => `${prev}<p>${transcript}</p>`);
      toast.success("Voice note transcribed.");
      setSpeechEnabled(false);
    };

    recognition.onerror = () => setSpeechEnabled(false);
    recognition.onend = () => setSpeechEnabled(false);
    recognition.start();
  };

  return (
    <AnimatePresence>
      {isEditorOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-base-900/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 14, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="glass-panel w-full max-w-5xl rounded-3xl border border-white/15 p-5"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-display text-2xl text-white">
                {existingNote ? "Edit note" : "Create note"}
              </h3>
              <button
                type="button"
                onClick={closeEditor}
                className="rounded-xl border border-white/15 bg-white/10 p-2 text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
              <div className="space-y-4">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note title"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-lg text-white outline-none placeholder:text-slate-400"
                />

                <RichTextEditor
                  value={contentHtml}
                  onChange={({ html, text }) => {
                    setContentHtml(html);
                    setContentText(text);
                  }}
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                    <span className="mb-1 inline-flex items-center gap-2 text-xs text-slate-300">
                      <Tags className="h-3.5 w-3.5" />
                      Tags (comma separated)
                    </span>
                    <input
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full bg-transparent text-white outline-none"
                      placeholder="work, ideas, meeting"
                    />
                  </label>

                  <label className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sm">
                    <span className="mb-1 inline-flex items-center gap-2 text-xs text-slate-300">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Due Date
                    </span>
                    <input
                      type="datetime-local"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-transparent text-white outline-none"
                    />
                  </label>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Images</p>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-slate-100">
                      <ImagePlus className="h-3.5 w-3.5" />
                      Upload
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => attachFiles(e.target.files)}
                      />
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {media
                      .filter((item) => item.type === "image" || item.type === "scribble")
                      .map((item) => (
                        <img
                          key={`${item.url}-${item.type}`}
                          src={item.url}
                          alt={item.name || item.type}
                          className="h-14 w-14 rounded-lg border border-white/10 object-cover"
                        />
                      ))}
                  </div>
                </div>

                <AudioRecorder onSave={attachAudio} />
                <ScribblePad onSave={attachScribble} />
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Priority</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {PRIORITY_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setPriority(level)}
                        className={`rounded-lg border px-2 py-1.5 text-xs ${
                          priority === level
                            ? "border-cyan-300/50 bg-cyan-300/20 text-cyan-100"
                            : "border-white/10 bg-white/10 text-slate-200"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-slate-300">
                    <Bot className="h-3.5 w-3.5" />
                    AI Assist
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    {aiSummary || "Write something to preview an instant summary."}
                  </p>
                  <button
                    type="button"
                    onClick={appendSpeechText}
                    disabled={speechEnabled}
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-slate-100"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    {speechEnabled ? "Listening..." : "Voice to text"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/20 px-4 py-2.5 text-sm font-semibold text-cyan-100"
                >
                  {saving ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Save className="h-4 w-4" />}
                  {existingNote ? "Save changes" : "Create note"}
                </button>
                <p className="inline-flex items-center gap-1 text-[11px] text-slate-300">
                  <Check className="h-3 w-3 text-emerald-300" />
                  Auto-save is enabled while editing an existing note.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
