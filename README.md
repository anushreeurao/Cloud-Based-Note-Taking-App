# Prism Notes: Premium Multimedia Notes App

Modern production-grade note-taking web app built with React + Firebase, featuring rich text editing, images, audio notes, sketch canvas, priority workflows, live sync, offline cache, and animated premium UI.

## Stack
- React (CRA)
- React Router
- Firebase Auth (Google sign-in)
- Firestore (real-time sync + offline persistence)
- Firebase Storage (images/audio/scribbles)
- Tailwind CSS
- Framer Motion
- Zustand
- TipTap rich text editor

## Key Features
- Google login with persistent sessions
- User-scoped notes workspace
- Rich text notes + tags + due date + priority
- Priority color system:
  - Low: green
  - Medium: yellow
  - High: orange
  - Critical: red
- Multimedia notes:
  - Multiple image attachments
  - Audio recorder (record/pause/resume/attach)
  - Scribble board (draw/shapes/erase/save)
- Dashboard with:
  - Search
  - Filters (priority, media type, tags)
  - Sort (newest, oldest, priority)
  - Pinned notes
  - Floating create button
- Drag-and-drop card ordering
- Archive / Trash / Recover / Permanent delete
- Auto-save while editing existing note
- Realtime sync + offline support
- Edit timeline/history
- Smart extras:
  - Instant summary generation
  - Heuristic smart categorization
  - Browser voice-to-text transcription
- Theme + mood workspace controls

## Project Structure
```text
src/
  app/
  components/
    audio/
    common/
    layout/
    notes/
    scribble/
  contexts/
  hooks/
  lib/
  pages/
  store/
  styles/
  utils/
```

## Firebase Data Model
See [docs/firebase-schema.md](/c:/Users/HP/Desktop/notes-app/docs/firebase-schema.md).

## Environment Setup
1. Copy `.env.example` to `.env`.
2. Add Firebase project keys:
```bash
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_FIREBASE_MEASUREMENT_ID=
```

## Firebase Console Setup
1. Enable **Google Authentication**.
2. Create **Firestore Database** (production mode recommended).
3. Create **Firebase Storage**.
4. Deploy rules:
```bash
firebase deploy --only firestore:rules,storage
```

## Local Run
```bash
npm install
npm start
```

## Build
```bash
npm run build
```

## Notes
- Voice-to-text uses browser Web Speech API (best support in Chromium browsers).
- AI summary/categorization are local heuristic helpers; you can upgrade to OpenAI or Gemini later for true LLM summaries.
- App is configured for code splitting via route-level lazy loading.
