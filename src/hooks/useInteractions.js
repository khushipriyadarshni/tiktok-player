import { useLiveQuery } from 'dexie-react-hooks'
import { useDB } from '../context/DBContext.jsx'
import { useAppContext } from '../context/AppContext.jsx'

/**
 * useInteractions
 * Resolves current user's interaction status and exposes optimistically-rendered toggles.
 */
export function useInteractions(videoId, targetProfileId = null) {
  const { interactions } = useDB()
  const { activeUser } = useAppContext()

  const userId = activeUser?.id

  // Track if current user has liked this video
  const isLiked = useLiveQuery(
    () => (userId && videoId ? interactions.hasLiked(videoId, userId) : false),
    [userId, videoId],
    false // default while loading
  )

  // Track if current user has bookmarked this video
  const isBookmarked = useLiveQuery(
    () => (userId && videoId ? interactions.hasBookmarked(videoId, userId) : false),
    [userId, videoId],
    false
  )

  // Track if current user follows the creator (only if targetProfileId is provided)
  const isFollowing = useLiveQuery(
    () => (userId && targetProfileId ? interactions.isFollowing(targetProfileId, userId) : false),
    [userId, targetProfileId],
    false
  )

  const toggleLike = async () => {
    if (!userId || !videoId) return false
    return interactions.toggleLike(videoId, userId)
  }

  const toggleBookmark = async () => {
    if (!userId || !videoId) return false
    return interactions.toggleBookmark(videoId, userId)
  }

  const toggleFollow = async () => {
    if (!userId || !targetProfileId) return false
    return interactions.toggleFollow(targetProfileId, userId)
  }

  return {
    isLiked,
    isBookmarked,
    isFollowing,
    toggleLike,
    toggleBookmark,
    toggleFollow
  }
}
