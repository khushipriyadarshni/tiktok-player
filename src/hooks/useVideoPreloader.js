import { useEffect, useRef } from 'react'
import { useFeedContext } from '../context/FeedContext.jsx'

/**
 * useVideoPreloader
 * Caches videos dynamically using detached DOM nodes out-of-order 
 * to utilize native browser buffer network queues before playing.
 */
export function useVideoPreloader() {
  const { videos, activeIndex } = useFeedContext()
  
  // Track dynamically loaded detached video elements mapped by URL
  // We use a ref so it doesn't trigger re-renders 
  const cacheRef = useRef(new Map())

  useEffect(() => {
    if (!videos || videos.length === 0) return

    const cache = cacheRef.current
    const length = videos.length

    // Connection awareness
    // Use fallback to 1 window on unknown connections or slow links
    let prefetchWindowSize = 1
    let preloadType = 'auto'
    
    // Check if network is slow API
    if (navigator.connection) {
      const type = navigator.connection.effectiveType
      if (type === '4g') {
        prefetchWindowSize = 2
      } else if (type === '3g' || type === 'slow-2g') {
        preloadType = 'metadata'
      }
    }

    // Determine safe indices for sliding window (+/- prefetchWindowSize)
    // with continuous wrap-around modulo boundary checks
    const targetIndices = new Set()
    for (let i = -prefetchWindowSize; i <= prefetchWindowSize; i++) {
        const wrappedIndex = (activeIndex + i + length) % length
        targetIndices.add(wrappedIndex)
    }

    // Determine target URLs to cache explicitly
    const targetUrls = new Set()
    targetIndices.forEach(idx => {
       const url = videos[idx]?.url
       if(url) targetUrls.add(url)
    })

    // 1. Evict any cached videos that are no longer in our sliding window bounds
    for (const [url, videoEl] of cache.entries()) {
      if (!targetUrls.has(url)) {
        // Release buffer memory safely before unreferencing
        videoEl.src = ''
        videoEl.load()
        cache.delete(url)
      }
    }

    // 2. Preload new videos if they don't already exist in the cache
    targetUrls.forEach(url => {
      if (!cache.has(url)) {
        const preloader = document.createElement('video')
        // We do not append to DOM. It exists offscreen.
        preloader.preload = preloadType
        preloader.src = url
        preloader.muted = true
        preloader.playsInline = true
        // Keep reference so garbage collector doesn't reap it early
        cache.set(url, preloader) 
      }
    })

  }, [videos, activeIndex])

  // Returns cache map for potential diagnostic logging 
  return cacheRef.current
}
