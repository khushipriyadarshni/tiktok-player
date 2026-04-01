import Dexie from 'dexie'

/**
 * TokTik Database Schema — Dexie.js (IndexedDB)
 * 
 * Tables: profiles, videos, interactions, comments
 * All data persists in the browser across page reloads.
 */

const db = new Dexie('TokTikDB')

// Version 1 — Initial schema
db.version(1).stores({
  // profiles table
  // Indexed: id (primary), username (unique), displayName (for search)
  profiles: 'id, &username, displayName',

  // videos table
  // Indexed: id (primary), profileId (FK), createdAt (for feed ordering)
  videos: 'id, profileId, createdAt',

  // interactions table
  // Indexed: id (primary), compound index [type+actorProfileId+targetId] for lookups,
  // plus individual indexes for filtering
  interactions: 'id, type, actorProfileId, targetId, [type+actorProfileId+targetId]',

  // comments table
  // Indexed: id (primary), videoId (FK), createdAt (for ordering)
  comments: 'id, videoId, profileId, createdAt',
})

export default db
