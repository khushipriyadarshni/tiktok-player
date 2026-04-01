import React, { createContext, useContext, useState, useEffect } from 'react'
import { useDB } from './DBContext.jsx'

export const FeedContext = createContext(null)

export const useFeedContext = () => {
  const context = useContext(FeedContext)
  if (!context) {
    throw new Error('useFeedContext must be used within a FeedProvider')
  }
  return context
}

export function FeedProvider({ children }) {
  const { videos } = useDB()
  const [feedVideos, setFeedVideos] = useState([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadVideos = async () => {
      setIsLoading(true)
      try {
        const data = await videos.getFeed()
        if (isMounted) {
          // If the feed is empty, we set an empty array.
          // The UI skeleton or empty state will handle this case.
          setFeedVideos(data)
        }
      } catch (err) {
        console.error('[TokTik] Error loading feed:', err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    // Try initially
    loadVideos()

    // Listen for the seed completion event in case this mounts before seeding finishes
    const handleSeedComplete = () => {
      console.log('[TokTik Feed] Seeding complete detected, refreshing feed...')
      loadVideos()
    }
    window.addEventListener('toktik_seed_complete', handleSeedComplete)

    return () => {
      isMounted = false
      window.removeEventListener('toktik_seed_complete', handleSeedComplete)
    }
  }, [videos])

  const value = {
    activeIndex,
    setActiveIndex,
    videos: feedVideos,
    isLoading
  }

  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>
}
