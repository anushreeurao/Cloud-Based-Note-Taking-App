import { create } from "zustand";

export const useUIStore = create((set) => ({
  theme: "dark",
  mood: "focus",
  isEditorOpen: false,
  activeNoteId: null,
  draftSeed: null,
  search: "",
  filters: {
    priority: "all",
    mediaType: "all",
    tags: [],
    sortBy: "newest",
  },
  setTheme: (theme) => set({ theme }),
  setMood: (mood) => set({ mood }),
  openEditor: (noteId = null, draftSeed = null) =>
    set({ isEditorOpen: true, activeNoteId: noteId, draftSeed }),
  closeEditor: () => set({ isEditorOpen: false, activeNoteId: null, draftSeed: null }),
  setSearch: (search) => set({ search }),
  setFilters: (nextFilters) =>
    set((state) => ({ filters: { ...state.filters, ...nextFilters } })),
}));
