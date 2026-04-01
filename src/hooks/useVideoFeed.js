import { useEffect, useRef, useCallback } from 'react'

/**
 * useVideoFeed
 * Tracks the active video in the feed using IntersectionObserver.
 * Reports the currently visible activeIndex back to the FeedContext.
 * 
 * Supports the loop effect by managing thresholds and multiple active cards.
 */
export function useVideoFeed(videosLength, setActiveIndex) {
  const containerRef = useRef(null)
  
  // We keep an array of refs so we can observe each card independently
  const cardRefs = useRef([])

  // Helper to reliably register card refs from dynamically rendered list mappings
  const registerCardRef = useCallback((index, el) => {
    if (el) {
      cardRefs.current[index] = el
    }
  }, [])

  useEffect(() => {
    if (!containerRef.current || videosLength === 0) return

    // IntersectionObserver logic to detect which video is primarily visible
    const observer = new IntersectionObserver(
      (entries) => {
        // Find whichever card is mostly in view threshold
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Read data-index from mapped dom element
            const idx = Number(entry.target.getAttribute('data-index'))
            
            // For continuous looping, the feed may append clones.
            // A modulo operation keeps activeIndex cleanly mapped to actual length sizes safely.
            if (!isNaN(idx)) {
              setActiveIndex(idx % videosLength)
            }
          }
        })
      },
      {
        root: containerRef.current,
        threshold: 0.95, // Trigger strictly when 95% visible to ensure previous video is successfully exited
      }
    )

    // Observe all captured cards
    const currentCards = cardRefs.current
    currentCards.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => {
      currentCards.forEach((card) => {
        if (card) observer.unobserve(card)
      })
      observer.disconnect()
    }
  }, [videosLength, setActiveIndex])

  return {
    containerRef,
    registerCardRef
  }
}
