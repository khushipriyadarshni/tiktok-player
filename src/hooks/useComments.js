import { useLiveQuery } from 'dexie-react-hooks'
import { useDB } from '../context/DBContext.jsx'
import { useAppContext } from '../context/AppContext.jsx'

/**
 * useComments
 * Fetches comments for a given video, joining commenter profiles for display names and avatars.
 */
export function useComments(videoId) {
  const { comments: commentsAPI, profiles } = useDB()
  const { activeUser } = useAppContext()
  const userId = activeUser?.id

  // 1. Fetch live comments for a given video ID joined with user info
  const comments = useLiveQuery(
    async () => {
      if (!videoId) return []

      const rawComments = await commentsAPI.getByVideoId(videoId)
      if (rawComments.length === 0) return []

      // Extract unique profile IDs matching commenters to query only needed profiles
      const profileIds = [...new Set(rawComments.map(c => c.profileId))]
      // Wait for all related profiles
      const profileList = await Promise.all(profileIds.map(id => profiles.getById(id)))
      
      // Index profiles by id for fast lookups
      const profileMap = profileList.reduce((acc, p) => {
        if (p) acc[p.id] = p
        return acc
      }, {})

      // Join the records in JS memory
      return rawComments.map(comment => {
        const commenter = profileMap[comment.profileId]
        return {
          ...comment,
          author: commenter || { 
            displayName: 'Unknown User', 
            username: '@unknown', 
            avatarUrl: '' 
          }
        }
      })
    },
    [videoId],
    null // Loading state
  )

  const isLoading = comments === null

  const addComment = async (text) => {
    if (!userId || !videoId || !text.trim()) return false
    return commentsAPI.add(videoId, userId, text)
  }

  return {
    comments: comments || [],
    isLoading,
    addComment
  }
}
