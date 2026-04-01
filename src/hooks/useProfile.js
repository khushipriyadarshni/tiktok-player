import { useLiveQuery } from 'dexie-react-hooks'
import { useDB } from '../context/DBContext.jsx'
import { useAppContext } from '../context/AppContext.jsx'

/**
 * useProfile
 * Fetches a specific user profile and tracks dynamic follow status relative to activeUser.
 */
export function useProfile(profileId) {
  const { profiles, interactions } = useDB()
  const { activeUser } = useAppContext()

  const userId = activeUser?.id

  // 1. Fetch live profile object
  const profile = useLiveQuery(
    () => (profileId ? profiles.getById(profileId) : null),
    [profileId],
    null // loading state default
  )

  const isLoading = profile === null

  // 2. Fetch boolean follow status relative to the current app user
  const isFollowing = useLiveQuery(
    () => (userId && profileId ? interactions.isFollowing(profileId, userId) : false),
    [userId, profileId],
    false
  )

  const toggleFollow = async () => {
    if (!userId || !profileId) return false
    return interactions.toggleFollow(profileId, userId)
  }

  const isOwnProfile = userId === profileId

  return {
    profile,
    isLoading,
    isFollowing,
    isOwnProfile,
    toggleFollow
  }
}
