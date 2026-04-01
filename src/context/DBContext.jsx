import React, { createContext, useContext, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '../db/schema.js'

export const DBContext = createContext(null)

/**
 * Custom hook to consume the DBContext
 */
export const useDB = () => {
  const context = useContext(DBContext)
  if (!context) {
    throw new Error('useDB must be used within a DBProvider')
  }
  return context
}

export function DBProvider({ children }) {
  // ─────────────────────────────────────────────
  // Profiles API
  // ─────────────────────────────────────────────
  const profilesAPI = {
    getById: (id) => db.profiles.get(id),
    getAll: () => db.profiles.toArray(),
    search: (query) => {
      const lowerQuery = query.toLowerCase()
      return db.profiles
        .filter(
          (p) =>
            p.username.toLowerCase().includes(lowerQuery) ||
            p.displayName.toLowerCase().includes(lowerQuery)
        )
        .toArray()
    },
  }

  // ─────────────────────────────────────────────
  // Videos API
  // ─────────────────────────────────────────────
  const videosAPI = {
    getFeed: () => db.videos.orderBy('createdAt').reverse().toArray(),
    getByProfileId: (profileId) =>
      db.videos.where('profileId').equals(profileId).reverse().toArray(),
    getById: (id) => db.videos.get(id),
  }

  // ─────────────────────────────────────────────
  // Interactions API (Likes, Bookmarks, Follows)
  // ─────────────────────────────────────────────
  const interactionsAPI = {
    hasLiked: async (videoId, userId) => {
      const count = await db.interactions
        .where('[type+actorProfileId+targetId]')
        .equals(['like', userId, videoId])
        .count()
      return count > 0
    },
    hasBookmarked: async (videoId, userId) => {
      const count = await db.interactions
        .where('[type+actorProfileId+targetId]')
        .equals(['bookmark', userId, videoId])
        .count()
      return count > 0
    },
    isFollowing: async (targetProfileId, userId) => {
      if (targetProfileId === userId) return false
      const count = await db.interactions
        .where('[type+actorProfileId+targetId]')
        .equals(['follow', userId, targetProfileId])
        .count()
      return count > 0
    },
    toggleLike: async (videoId, userId) => {
      const key = ['like', userId, videoId]
      return db.transaction('rw', db.interactions, db.videos, async () => {
        const existing = await db.interactions.where('[type+actorProfileId+targetId]').equals(key).first()
        const video = await db.videos.get(videoId)
        
        if (existing) {
          await db.interactions.delete(existing.id)
          await db.videos.update(videoId, { likes: Math.max(0, video.likes - 1) })
          return false // Now unliked
        } else {
          await db.interactions.add({
            id: crypto.randomUUID(),
            type: 'like',
            actorProfileId: userId,
            targetId: videoId,
            createdAt: new Date().toISOString()
          })
          await db.videos.update(videoId, { likes: video.likes + 1 })
          return true // Now liked
        }
      })
    },
    toggleBookmark: async (videoId, userId) => {
       const key = ['bookmark', userId, videoId]
       return db.transaction('rw', db.interactions, db.videos, async () => {
         const existing = await db.interactions.where('[type+actorProfileId+targetId]').equals(key).first()
         const video = await db.videos.get(videoId)
         
         if (existing) {
           await db.interactions.delete(existing.id)
           await db.videos.update(videoId, { bookmarks: Math.max(0, video.bookmarks - 1) })
           return false
         } else {
           await db.interactions.add({
             id: crypto.randomUUID(),
             type: 'bookmark',
             actorProfileId: userId,
             targetId: videoId,
             createdAt: new Date().toISOString()
           })
           await db.videos.update(videoId, { bookmarks: video.bookmarks + 1 })
           return true
         }
       })
    },
    toggleFollow: async (targetProfileId, userId) => {
      if (targetProfileId === userId) return false
      const key = ['follow', userId, targetProfileId]
      return db.transaction('rw', db.interactions, db.profiles, async () => {
        const existing = await db.interactions.where('[type+actorProfileId+targetId]').equals(key).first()
        const targetProfile = await db.profiles.get(targetProfileId)
        
        if (existing) {
          await db.interactions.delete(existing.id)
          await db.profiles.update(targetProfileId, { followerCount: Math.max(0, targetProfile.followerCount - 1) })
          return false
        } else {
          await db.interactions.add({
            id: crypto.randomUUID(),
            type: 'follow',
            actorProfileId: userId,
            targetId: targetProfileId,
            createdAt: new Date().toISOString()
          })
          await db.profiles.update(targetProfileId, { followerCount: targetProfile.followerCount + 1 })
          return true
        }
      })
    },
    getBookmarkedVideos: async (userId) => {
      const bookmarks = await db.interactions
        .where('actorProfileId').equals(userId)
        .filter(i => i.type === 'bookmark')
        .reverse()
        .sortBy('createdAt')
      
      const videoIds = bookmarks.map(b => b.targetId)
      // Fetch all videos and filter to maintain ordered result (Dexie bulkGet doesn't guarantee order if missing, but we can map)
      const videos = await Promise.all(videoIds.map(id => db.videos.get(id)))
      return videos.filter(Boolean)
    },
    getLikedVideos: async (userId) => {
       const likes = await db.interactions
        .where('actorProfileId').equals(userId)
        .filter(i => i.type === 'like')
        .reverse()
        .sortBy('createdAt')
      
      const videoIds = likes.map(l => l.targetId)
      const videos = await Promise.all(videoIds.map(id => db.videos.get(id)))
      return videos.filter(Boolean)
    }
  }

  // ─────────────────────────────────────────────
  // Comments API
  // ─────────────────────────────────────────────
  const commentsAPI = {
    getByVideoId: (videoId) => 
      db.comments.where('videoId').equals(videoId).reverse().sortBy('createdAt'),
    add: async (videoId, userId, text) => {
      return db.transaction('rw', db.comments, db.videos, async () => {
        const newComment = {
          id: crypto.randomUUID(),
          videoId,
          profileId: userId,
          text,
          likes: 0,
          createdAt: new Date().toISOString()
        }
        await db.comments.add(newComment)
        const video = await db.videos.get(videoId)
        await db.videos.update(videoId, { comments: video.comments + 1 })
        return newComment
      })
    }
  }

  const value = {
    db,
    profiles: profilesAPI,
    videos: videosAPI,
    interactions: interactionsAPI,
    comments: commentsAPI
  }

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>
}
