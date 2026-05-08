import "./Sidebar.css";

export default function Sidebar({ user, notes, onAddNote }) {
  return (
    <div className="sidebar">
      <div className="user-profile">
        {user?.photoURL ? (
          <img src={user.photoURL} alt="Avatar" className="user-avatar" />
        ) : (
          <div className="user-avatar-fallback">
            {(user?.displayName || user?.email || "G")[0].toUpperCase()}
          </div>
        )}
        <h3 style={{ margin: 0 }}>{user?.displayName || user?.email?.split('@')[0] || "Guest"}</h3>
      </div>
      <button
        className="btn-primary"
        onClick={onAddNote}
        style={{ marginBottom: '1.5rem' }}
      >
        ➕ New Note
      </button>
      <div className="sidebar-content">
        {notes.map((n) => (
          <div
            key={n.id}
            className="sidebar-note"
          >
            <p className="sidebar-note-title">
              {n.title || "Untitled"}
            </p>
            <p className="sidebar-note-preview">
              {n.body || n.text || "No content"}
            </p>
            {n.updatedAt && (
              <p className="sidebar-note-timestamp">
                {n.createdAt && n.updatedAt > n.createdAt + 1000 ? "Edited: " : "Created: "}
                {new Date(n.updatedAt).toLocaleString(undefined, { 
                  month: 'short', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}