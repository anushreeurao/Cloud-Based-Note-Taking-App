import React, { useState, useEffect } from "react";
import "./App.css";

import { db, auth, provider } from "./firebase";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  onSnapshot,
  query,
} from "firebase/firestore";

import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

import Dashboard from "./components/Dashboard";
import SharedNoteView from "./components/SharedNoteView";

function App() {
  const [shareId, setShareId] = useState(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?')));
    return urlParams.get("share") || hashParams.get("share");
  });
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Robust URL detection (for back-button and manual URL changes)
  useEffect(() => {
    const checkUrl = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(window.location.hash.indexOf('?')));
      const sid = urlParams.get("share") || hashParams.get("share");
      if (sid !== shareId) {
        setShareId(sid);
      }
    };

    window.addEventListener('popstate', checkUrl);
    const interval = setInterval(checkUrl, 1000); 
    
    return () => {
      window.removeEventListener('popstate', checkUrl);
      clearInterval(interval);
    };
  }, [shareId]);

  // 🔐 Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 📡 Fetch notes
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "notes"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesArray);
    });

    return () => unsubscribe();
  }, [user]);

  // ➕ Add / Update
  const addOrUpdateNote = async (uid, noteId, data) => {
    if (!data?.title && !data?.body && !data?.text) return;

    try {
      if (noteId) {
        await updateDoc(doc(db, "users", user.uid, "notes", noteId), {
          ...data,
          updatedAt: Date.now(),
        });
        
        const sharedRef = doc(db, "sharedNotes", noteId);
        if (data.shared) {
          await setDoc(sharedRef, {
            ...data,
            authorId: user.uid,
            updatedAt: Date.now(),
          }, { merge: true });
        } else {
          await deleteDoc(sharedRef).catch(() => {});
        }
      } else {
        const docRef = await addDoc(collection(db, "users", user.uid, "notes"), {
          ...data,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
        
        if (data.shared) {
          await setDoc(doc(db, "sharedNotes", docRef.id), {
            ...data,
            authorId: user.uid,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });
        }
      }
    } catch (error) {
      console.error("Error adding/updating note:", error);
      alert(`Failed to save note: ${error.message}`);
    }
  };

  // ❌ Delete
  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "users", user.uid, "notes", id));
    await deleteDoc(doc(db, "sharedNotes", id)).catch(() => {});
  };

  // ✏ Edit
  const editNote = async (id, oldTitle, oldBody) => {
    const newTitle = prompt("Edit title", oldTitle);
    const newBody = prompt("Edit body", oldBody);
    if (!newTitle && !newBody) return;

    await updateDoc(doc(db, "users", user.uid, "notes", id), {
      title: newTitle || oldTitle,
      body: newBody || oldBody,
      updatedAt: Date.now(),
    });
  };

  // 🔗 Share
  const shareNote = async (id) => {
    try {
      const note = notes.find(n => n.id === id);
      if (!note) return;

      let expiry = note.shareExpiresAt;
      if (!expiry) {
        expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);
        
        await updateDoc(doc(db, "users", user.uid, "notes", id), {
          shared: true,
          shareExpiresAt: expiry,
          updatedAt: Date.now(),
        });
        
        await setDoc(doc(db, "sharedNotes", id), {
          ...note,
          shared: true,
          shareExpiresAt: expiry,
          authorId: user.uid,
          updatedAt: Date.now()
        }, { merge: true });
      }

      const baseUrl = window.location.origin;
      const url = `${baseUrl}/?share=${id}`;
      
      await navigator.clipboard.writeText(url);
      alert(`Copied: ${url}`);
    } catch (error) {
      console.error("Error sharing note:", error);
      alert(`Failed to copy share link: ${error.message}`);
    }
  };

  // 🔐 Login
  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      if (error.code !== "auth/popup-closed-by-user") {
        console.error(error);
      }
    }
  };

  // 📧 Email Auth
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/invalid-credential') {
        msg = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/user-not-found') {
        msg = "No account found with this email. Please sign up!";
      } else if (error.code === 'auth/wrong-password') {
        msg = "Incorrect password. Try 'Forgot Password' if you need to reset it.";
      }
      alert(msg);
    }
  };

  const resetPassword = async () => {
    if (!email) {
      alert("Please enter your email address first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! Check your inbox.");
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // 🔓 Logout
  const logout = async () => {
    await signOut(auth);
  };

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Loading your space...</p>
      </div>
    );
  }

  return (
    <>
      {shareId ? (
        <SharedNoteView shareId={shareId} setShareId={setShareId} />
      ) : !user ? (
        <div className="login-screen">
          <div className="login-card">
            <h1 className="text-gradient welcome-title">📝 Notes</h1>
            <p className="login-subtitle">Your ideas, secured in the cloud.</p>
            
            <form onSubmit={handleEmailAuth} className="login-form">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field no-margin"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field no-margin"
                required
              />
              <button type="submit" className="btn-primary login-submit">
                {isSignUp ? "Sign Up" : "Log In"}
              </button>
            </form>
            
            {!isSignUp && (
              <button 
                onClick={resetPassword}
                className="btn-link"
                style={{ marginTop: '-0.5rem', marginBottom: '1rem', color: '#94a3b8', fontSize: '0.85rem' }}
              >
                Forgot Password?
              </button>
            )}
            
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="btn-icon auth-toggle"
            >
              {isSignUp ? "Already have an account? Log In" : "Need an account? Sign Up"}
            </button>

            <div className="login-separator">
              <div className="separator-line"></div>
              <span className="separator-text">OR</span>
              <div className="separator-line"></div>
            </div>

            <button 
              onClick={login}
              className="btn-google"
            >
              <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      ) : (
        <div className="app-container">
          <button 
            onClick={logout}
            className="btn-logout"
          >
            Logout
          </button>

          <Dashboard
            user={user}
            notes={notes}
            addOrUpdateNote={addOrUpdateNote}
            deleteNote={deleteNote}
            editNote={editNote}
            shareNote={shareNote}
            search={search}
            setSearch={setSearch}
          />
        </div>
      )}
    </>
  );
}

export default App;