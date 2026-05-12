import { createContext, useContext } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNotes } from "../hooks/useNotes";

const NotesContext = createContext(null);

export function NotesProvider({ children }) {
  const { user } = useAuth();
  const notesApi = useNotes(user);
  return <NotesContext.Provider value={notesApi}>{children}</NotesContext.Provider>;
}

export function useNotesContext() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotesContext must be used within NotesProvider.");
  }
  return context;
}
