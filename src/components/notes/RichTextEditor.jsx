import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";

function ToolbarButton({ label, onClick, active = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-2 py-1 text-xs transition ${
        active
          ? "border-cyan-300/50 bg-cyan-300/20 text-cyan-100"
          : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

export function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write notes, tasks, ideas..." }),
    ],
    content: value || "",
    onUpdate: ({ editor: ed }) => {
      onChange({
        html: ed.getHTML(),
        text: ed.getText(),
      });
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          label="Highlight"
          active={editor.isActive("highlight")}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        />
        <ToolbarButton
          label="Bullet"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          label="Numbered"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
