import { useState } from "react";
import Sidebar from "./Sidebar";
import NoteForm from "./NoteForm";
import NotesList from "./NotesList";
import "./Dashboard.css";

export default function Dashboard({
  user,
  notes,
  addOrUpdateNote,
  deleteNote,
  editNote,
  shareNote,
  search,
  setSearch
}) {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleAddNoteClick = () => {
    setEditingNote(null);
    setShowForm(true);
  };

  const handleEditNoteClick = (note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  return (
    <div className="app-container full-width">
      <Sidebar user={user} notes={notes} onAddNote={handleAddNoteClick} />
      
      <div className="main-content">
        <header className="dashboard-header">
          <h2 className="text-gradient welcome-text">
            Welcome to Note Taking App 🚀
          </h2>
        </header>

        {showForm && (
          <div className="form-container">
            <div className="form-header">
              <h3>{editingNote ? "Edit Note" : "Create New Note"}</h3>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingNote(null);
                }}
                className="btn-icon"
              >
                ✕ Close
              </button>
            </div>
            <NoteForm 
              key={editingNote ? editingNote.id : 'new'}
              uid={user?.uid} 
              note={editingNote}
              onSave={(uid, noteId, data) => {
                addOrUpdateNote(uid, noteId, data);
                setShowForm(false);
                setEditingNote(null);
              }} 
            />
          </div>
        )}

        <NotesList
          user={user}
          notes={notes}
          deleteNote={deleteNote}
          editNote={handleEditNoteClick}
          shareNote={shareNote}
          search={search}
          setSearch={setSearch}
        />
      </div>
    </div>
  );
}