# Firestore Schema (Scalable)

## Collections

### `users/{uid}`
User profile document.

```json
{
  "uid": "string",
  "displayName": "string",
  "email": "string",
  "photoURL": "string",
  "lastActiveAt": "timestamp"
}
```

### `users/{uid}/notes/{noteId}`
Main note document.

```json
{
  "title": "string",
  "contentHtml": "string",
  "contentText": "string",
  "priority": "low|medium|high|critical",
  "tags": ["string"],
  "dueDate": "timestamp|null",
  "media": [
    {
      "type": "image|audio|scribble",
      "url": "string",
      "storagePath": "string",
      "name": "string",
      "size": "number|null",
      "duration": "number|null",
      "createdAt": "timestamp|number"
    }
  ],
  "pinned": "boolean",
  "archived": "boolean",
  "trashed": "boolean",
  "order": "number",
  "workspaceMood": "focus|flow|calm",
  "summary": "string",
  "smartCategory": "string",
  "history": [
    {
      "at": "number",
      "action": "string",
      "title": "string",
      "snippet": "string"
    }
  ],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `users/{uid}/media/{mediaId}`
Uploaded image metadata.

### `users/{uid}/audio/{audioId}`
Uploaded audio metadata.

### `users/{uid}/scribbles/{scribbleId}`
Uploaded scribble metadata.

### `users/{uid}/tags/{tagId}`
Tag dictionary/cache metadata.

## Storage Paths
- `users/{uid}/media/*`
- `users/{uid}/audio/*`
- `users/{uid}/scribbles/*`

## Query Pattern
- Realtime listener on `users/{uid}/notes` ordered by `updatedAt`.
- Client-side filtered views for archive/trash/priority/tags/media.
- Drag ordering persisted via `order` field batch updates.
