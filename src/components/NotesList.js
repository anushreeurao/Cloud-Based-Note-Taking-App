import "./NotesList.css";

export default function NotesList({
  user,
  notes,
  deleteNote,
  editNote,
  shareNote,
  search,
  setSearch
}) {
  const filtered = notes
  .filter((n) => n && (n.title || n.body || n.text))
  .filter((n) =>
    (n.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (n.body?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (n.text?.toLowerCase() || "").includes(search.toLowerCase()) ||
    (n.tags?.join(" ").toLowerCase() || "").includes(search.toLowerCase())
  )
  .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  
  return (
    <div>
      <input
        placeholder="Search notes or tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input-field"
      />

      <div className="note-grid">
        {filtered.map((note) => (
          <div key={note.id} className="note-card">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-body">{note.body || note.text}</p>
            
            <div className="note-card-header">
              {note.tags && note.tags.length > 0 ? (
                <div className="tags-container no-margin">
                  {note.tags.map((tag, i) => (
                    <span key={i} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : <div></div>}
              
              {note.updatedAt && (
                <p className="note-timestamp">
                  {note.createdAt && note.updatedAt > note.createdAt + 1000 ? "Edited: " : "Created: "}
                  {new Date(note.updatedAt).toLocaleString(undefined, { 
                    month: 'short', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              )}
            </div>

            {note.shared && note.shareExpiresAt && (
              <p className="note-expiry-info">
                Shared until: {new Date(note.shareExpiresAt.seconds ? note.shareExpiresAt.seconds * 1000 : note.shareExpiresAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            )}

            <div className="note-actions">
              <button 
                onClick={() => editNote(note)}
                className="btn-secondary"
              >
                Edit
              </button>

              <button 
                onClick={() => deleteNote(note.id)}
                className="btn-danger"
              >
                Delete
              </button>

              {note.shared && (
                <button 
                  onClick={() => shareNote(note.id)}
                  className="btn-success"
                >
                  Copy Share Link 🔗
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}