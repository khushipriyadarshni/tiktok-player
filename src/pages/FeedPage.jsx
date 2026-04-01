import React, { useState, useEffect, useCallback } from 'react'
import { useFeedContext } from '../context/FeedContext.jsx'
import { useVideoFeed } from '../hooks/useVideoFeed.js'
import { useVideoPreloader } from '../hooks/useVideoPreloader.js'
import { VideoCard } from '../components/feed/VideoCard.jsx'
import { SkeletonCard } from '../components/shared/SkeletonCard.jsx'
import { CommentSheet } from '../components/feed/CommentSheet.jsx'

/**
 * FeedPage
 * Main vertical swiping interface. Maps contexts, triggers loaders, and loops nodes natively without custom scroll jacking.
 */
function FeedPage() {
  const { videos, isLoading, activeIndex, setActiveIndex } = useFeedContext()
  const { containerRef, registerCardRef } = useVideoFeed(videos.length, setActiveIndex)
  
  // Connect the preloader implicitly rendering behind exactly within this route lifecycle
  useVideoPreloader()

  // Track if we need to show the CommentSheet (Phase 7 wiring)
  const [activeCommentVideoId, setActiveCommentVideoId] = useState(null)

  // Arrow key mappings for desktop emulation fallback
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === 'INPUT') return
      
      const container = containerRef.current
      if (!container) return

      const cardHeight = window.innerHeight

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        container.scrollBy({ top: cardHeight, behavior: 'smooth' })
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        container.scrollBy({ top: -cardHeight, behavior: 'smooth' })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [containerRef])

  if (isLoading) {
    return <SkeletonCard />
  }

  // Fallback for empty DB scenario predictably handled
  if (!videos || videos.length === 0) {
    return (
      <div className="h-screen-dvh flex items-center justify-center bg-toktik-bg">
        <div className="text-center px-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-toktik-accent-soft flex items-center justify-center">
             <span className="text-2xl">📭</span>
          </div>
          <h1 className="text-xl font-semibold text-toktik-text-primary mb-2 font-inter">No videos found</h1>
          <p className="text-sm text-toktik-text-secondary font-inter">The database might not be seeded yet.</p>
        </div>
      </div>
    )
  }

  // To create the seamless infinite loop illusion natively via CSS Snap:
  // Render the entire list, plus a duplicated copy of the *first* video at the very bottom.
  // When the user scrolls to the duplicate, we snap them silently back to the true top wrapper index.
  const feedList = [...videos, videos[0]]

  // Handle snap silent reset on scroll mapping completion globally
  const handleScroll = () => {
    const el = containerRef.current
    if (!el) return
    
    // Check if we hit the cloned element at the exact bottom
    const isAtBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) < 2
    if (isAtBottom) {
      // Instantly jump back to true 0 index natively bypassing smooth transitions
      el.scrollTo({ top: 0, behavior: 'instant' })
    }
  }

  return (
    <>
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="w-full h-screen-dvh snap-container pb-safe bg-black"
      >
        {feedList.map((video, idx) => {
          // Identify if this instance is the mapped active version currently playing explicitly
          const isActive = idx === activeIndex

          // We pass data-index for the IntersectionObserver to map threshold visibility
          return (
            <div 
               key={`${video.id}-${idx}`} 
               data-index={idx}
               ref={(el) => registerCardRef(idx, el)}
               className={`w-full h-full snap-child overflow-hidden ${idx < 3 ? 'animate-stagger-in' : ''}`}
            >
              <VideoCard 
                 video={video} 
                 isActive={isActive}
                 onCommentOpen={(id) => setActiveCommentVideoId(id)}
              />
            </div>
          )
        })}
      </div>

      {/* CommentSheet Conditionally Rendered via Active Video Match ID */}
      {activeCommentVideoId && (
        <CommentSheet 
          videoId={activeCommentVideoId} 
          onClose={() => setActiveCommentVideoId(null)} 
        />
      )}
    </>
  )
}

export default FeedPage
