import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import toast from "react-hot-toast";
import { db, storage } from "../lib/firebase";
import { suggestCategory, summarizeNoteText } from "../utils/aiAssist";

function normalizedNote(docSnap) {
  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    media: data.media ?? [],
    tags: data.tags ?? [],
    history: data.history ?? [],
    pinned: Boolean(data.pinned),
    archived: Boolean(data.archived),
    trashed: Boolean(data.trashed),
    priority: data.priority ?? "medium",
  };
}

export function useNotes(user) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const profileRef = doc(db, "users", user.uid);
    setDoc(
      profileRef,
      {
        uid: user.uid,
        displayName: user.displayName ?? "Premium User",
        email: user.email ?? null,
        photoURL: user.photoURL ?? null,
        lastActiveAt: serverTimestamp(),
      },
      { merge: true }
    ).catch(() => {});

    const notesQuery = query(
      collection(db, "users", user.uid, "notes"),
      orderBy("updatedAt", "desc")
    );

    const unsub = onSnapshot(
      notesQuery,
      (snapshot) => {
        setNotes(snapshot.docs.map(normalizedNote));
        setLoading(false);
      },
      () => {
        toast.error("Could not sync notes.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const updateWithHistory = useCallback(
    async (noteId, payload, action = "edited") => {
      if (!user?.uid || !noteId) return;
      const note = notes.find((item) => item.id === noteId);
      const nextText = payload.contentText ?? note?.contentText ?? "";
      const summary = summarizeNoteText(nextText);
      const category = suggestCategory({
        title: payload.title ?? note?.title ?? "",
        text: nextText,
        tags: payload.tags ?? note?.tags ?? [],
      });
      const history = [
        ...(note?.history ?? []).slice(-19),
        {
          at: Date.now(),
          action,
          title: payload.title ?? note?.title ?? "",
          snippet: nextText.slice(0, 140),
        },
      ];
      await updateDoc(doc(db, "users", user.uid, "notes", noteId), {
        ...payload,
        summary,
        smartCategory: category,
        history,
        updatedAt: serverTimestamp(),
      });
    },
    [notes, user]
  );

  const createNote = useCallback(
    async (payload) => {
      if (!user?.uid) return;
      setSaving(true);
      try {
        const now = Date.now();
        const summary = summarizeNoteText(payload.contentText ?? "");
        const category = suggestCategory({
          title: payload.title,
          text: payload.contentText,
          tags: payload.tags,
        });

        const docRef = await addDoc(collection(db, "users", user.uid, "notes"), {
          title: payload.title || "Untitled Note",
          contentHtml: payload.contentHtml || "",
          contentText: payload.contentText || "",
          priority: payload.priority || "medium",
          tags: payload.tags || [],
          dueDate: payload.dueDate || null,
          media: payload.media || [],
          pinned: false,
          archived: false,
          trashed: false,
          order: payload.order ?? now,
          workspaceMood: payload.workspaceMood || "focus",
          summary,
          smartCategory: category,
          history: [
            {
              at: now,
              action: "created",
              title: payload.title || "Untitled Note",
              snippet: (payload.contentText || "").slice(0, 140),
            },
          ],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        toast.success("Note created.");
        return docRef.id;
      } finally {
        setSaving(false);
      }
    },
    [user]
  );

  const updateNote = useCallback(
    async (noteId, payload, action = "edited") => {
      if (!user?.uid || !noteId) return;
      setSaving(true);
      try {
        await updateWithHistory(noteId, payload, action);
      } finally {
        setSaving(false);
      }
    },
    [updateWithHistory, user]
  );

  const togglePin = useCallback(
    async (noteId, pinned) => updateNote(noteId, { pinned: !pinned }, !pinned ? "pinned" : "unpinned"),
    [updateNote]
  );

  const archiveNote = useCallback(
    async (noteId, archived) => updateNote(noteId, { archived: !archived, trashed: false }, !archived ? "archived" : "unarchived"),
    [updateNote]
  );

  const moveToTrash = useCallback(
    async (noteId) => updateNote(noteId, { trashed: true, archived: false, pinned: false }, "moved_to_trash"),
    [updateNote]
  );

  const restoreFromTrash = useCallback(
    async (noteId) => updateNote(noteId, { trashed: false }, "restored"),
    [updateNote]
  );

  const purgeNote = useCallback(
    async (note) => {
      if (!user?.uid || !note?.id) return;
      setSaving(true);
      try {
        const batch = writeBatch(db);
        batch.delete(doc(db, "users", user.uid, "notes", note.id));
        await batch.commit();

        const media = note.media ?? [];
        await Promise.all(
          media
            .filter((item) => item.storagePath)
            .map((item) =>
              deleteObject(ref(storage, item.storagePath)).catch(() => {})
            )
        );

        toast.success("Note permanently deleted.");
      } finally {
        setSaving(false);
      }
    },
    [user]
  );

  const reorderNotes = useCallback(
    async (orderedIds) => {
      if (!user?.uid || !orderedIds?.length) return;
      const batch = writeBatch(db);
      orderedIds.forEach((id, idx) => {
        batch.update(doc(db, "users", user.uid, "notes", id), {
          order: idx + 1,
          updatedAt: serverTimestamp(),
        });
      });
      await batch.commit();
    },
    [user]
  );

  const uploadMediaFile = useCallback(
    async ({ file, type, noteId = null, extra = {} }) => {
      if (!user?.uid || !file) return null;

      const rootType = type === "audio" ? "audio" : type === "scribble" ? "scribbles" : "media";
      const storagePath = `users/${user.uid}/${rootType}/${Date.now()}-${file.name || `${type}.bin`}`;
      const storageRef = ref(storage, storagePath);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const mediaDoc = {
        noteId,
        type,
        url,
        storagePath,
        name: file.name || `${type}-${Date.now()}`,
        size: file.size ?? null,
        duration: extra.duration ?? null,
        createdAt: serverTimestamp(),
      };

      const bucket = type === "audio" ? "audio" : type === "scribble" ? "scribbles" : "media";
      await addDoc(collection(db, "users", user.uid, bucket), mediaDoc);
      if (type === "image") {
        await addDoc(collection(db, "users", user.uid, "tags"), {
          value: "image",
          createdAt: serverTimestamp(),
        }).catch(() => {});
      }

      return {
        ...mediaDoc,
        createdAt: Date.now(),
      };
    },
    [user]
  );

  const notesByState = useMemo(
    () => ({
      active: notes.filter((note) => !note.trashed && !note.archived),
      archived: notes.filter((note) => note.archived && !note.trashed),
      trash: notes.filter((note) => note.trashed),
    }),
    [notes]
  );

  return {
    notes,
    notesByState,
    loading,
    saving,
    createNote,
    updateNote,
    togglePin,
    archiveNote,
    moveToTrash,
    restoreFromTrash,
    purgeNote,
    reorderNotes,
    uploadMediaFile,
  };
}
