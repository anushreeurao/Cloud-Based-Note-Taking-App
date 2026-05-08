import { useState } from "react";
import "./NoteForm.css";

export default function NoteForm({ uid, note = null, onSave }) {
  const [title, setTitle] = useState(note?.title || "Untitled");
  const [body, setBody] = useState(note?.body || note?.text || "");
  const [tags, setTags] = useState((note?.tags || []).join(", "));
  const [shared, setShared] = useState(note?.shared ?? false);
  const [loading, setLoading] = useState(false);
  const [expiry, setExpiry] = useState(() => {
    if (!note?.shareExpiresAt) return "";
    const date = note.shareExpiresAt.seconds 
      ? new Date(note.shareExpiresAt.seconds * 1000) 
      : new Date(note.shareExpiresAt);
    return date.toISOString();
  });

  const handleSave = async () => {
    setLoading(true);
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const data = {
      title,
      body,
      tags: tagArray,
      shared,
      shareExpiresAt: shared && expiry ? new Date(expiry) : null,
    };
    try {
      await onSave(uid, note?.id, data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        className="input-field"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <textarea
        className="textarea-field"
        placeholder="Write your note..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        disabled={loading}
      />
      <input
        className="input-field"
        placeholder="Enter tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        disabled={loading}
      />
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={shared}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setShared(isChecked);
            if (isChecked && !expiry) {
              // Default to 1 hour if nothing set yet
              const newExpiry = new Date();
              newExpiry.setHours(newExpiry.getHours() + 1);
              setExpiry(newExpiry.toISOString());
            }
          }}
          disabled={loading}
        />
        <span>Share publicly</span>
      </label>
      
      {shared && (
        <div className="expiry-picker-group">
          <label className="input-label">
            Set expiration date and time:
          </label>
          <div className="input-with-button">
            <input
              type="datetime-local"
              className="input-field no-margin"
              value={expiry ? new Date(new Date(expiry).getTime() - new Date(expiry).getTimezoneOffset() * 60000).toISOString().substring(0, 16) : ""}
              onChange={(e) => {
                if (e.target.value) {
                  setExpiry(new Date(e.target.value).toISOString());
                }
              }}
              disabled={loading}
            />
            <button 
              type="button"
              className="btn-secondary btn-confirm"
              onClick={() => alert(`Expiration time confirmed: ${new Date(expiry).toLocaleString(undefined, { 
                dateStyle: 'medium', 
                timeStyle: 'short' 
              })}`)}
            >
              OK
            </button>
          </div>
          {expiry && (
            <p className="note-expiry-info">
              Link will expire on: {new Date(expiry).toLocaleString(undefined, {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>
          )}
        </div>
      )}
      <button
        className="btn-primary"
        onClick={handleSave}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1 }}
      >
        {loading ? "Saving..." : "Save Note"}
      </button>
    </div>
  );
}