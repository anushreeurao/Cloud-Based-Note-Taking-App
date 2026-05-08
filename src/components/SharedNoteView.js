import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import "./SharedNoteView.css";

export default function SharedNoteView({ shareId, setShareId }) {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNote() {
      try {
        if (!shareId) {
          setError("Invalid share link.");
          setLoading(false);
          return;
        }

        let noteRef;
        if (shareId.includes("/")) {
          // Backward compatibility for old links: UID/NOTEID
          const [uid, noteId] = shareId.split("/");
          if (!uid || !noteId) {
            setError("Invalid share link.");
            setLoading(false);
            return;
          }
          noteRef = doc(db, "users", uid, "notes", noteId);
        } else {
          // New format: fetch directly from sharedNotes collection
          noteRef = doc(db, "sharedNotes", shareId);
        }

        const docSnap = await getDoc(noteRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.shared) {
            const now = new Date();
            const expiry = data.shareExpiresAt?.seconds 
              ? new Date(data.shareExpiresAt.seconds * 1000) 
              : data.shareExpiresAt 
                ? new Date(data.shareExpiresAt) 
                : null;
            
            if (expiry && now > expiry) {
              setError("This share link has expired.");
            } else {
              setNote({ id: docSnap.id, ...data });
            }
          } else {
            setError("This note is no longer shared.");
          }
        } else {
          setError("Note not found or you do not have permission to view it.");
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching note. It might be expired or private.");
      }
      setLoading(false);
    }
    fetchNote();
  }, [shareId]);

  if (loading) return <div className="status-container" style={{ color: 'white' }}>Loading shared note...</div>;

  if (error) return (
    <div className="status-container">
      <div className="error-bubble">
        {error}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <a href="/" className="shared-link-home" style={{ textDecoration: 'underline' }}>Go to home</a>
      </div>
    </div>
  );

  return (
    <div className="shared-view-wrapper">
      <div className="container-vertical">
        <div className="shared-card">
          <h1 className="shared-title">{note.title}</h1>
          {note.tags && note.tags.length > 0 && (
            <div className="tags-container" style={{ marginBottom: '1.5rem' }}>
              {note.tags.map((tag, i) => (
                <span key={i} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="shared-body">
            {note.body || note.text}
          </div>
          
          {note.shareExpiresAt && (
            <div className="shared-footer">
              <p className="shared-note-expiry">
                Expires: {new Date(note.shareExpiresAt?.seconds ? note.shareExpiresAt.seconds * 1000 : note.shareExpiresAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short'
                })}
              </p>
            </div>
          )}
        </div>

        {/* Call to action for non-users */}
        <div className="cta-section">
          <p className="cta-text">Liked this? Start capturing your own ideas today.</p>
          <button 
            className="btn-primary cta-button" 
            onClick={() => {
              window.location.href = window.location.origin + window.location.pathname;
            }}
          >
            Create your own note
          </button>
        </div>

      </div>
    </div>
  );
}
