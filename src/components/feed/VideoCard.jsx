import React, { useRef, useState, useCallback, memo } from 'react'
import { VideoPlayer } from './VideoPlayer.jsx'
import { ActionBar } from './ActionBar.jsx'
import { UserInfo } from './UserInfo.jsx'
import { MusicDisc } from './MusicDisc.jsx'
import { PlayPauseOverlay } from './PlayPauseOverlay.jsx'
import HeartBurst from '../shared/HeartBurst.jsx'

import { useProfile } from '../../hooks/useProfile.js'
import { useGestures } from '../../hooks/useGestures.js'
import { useInteractions } from '../../hooks/useInteractions.js'
import { useHaptics } from '../../hooks/useHaptics.js'

/**
 * VideoCard
 * Extracted full viewport component responsible for organizing overlaid UI chunks.
 * Uses React.memo because multiple cards will render at once, so we only re-render if `isActive` flips.
 */
export const VideoCard = memo(({ video, isActive, onCommentOpen, onSnapUp, onSnapDown }) => {
  const containerRef = useRef(null)
  const playerRef = useRef(null)
  
  const [showPlayPause, setShowPlayPause] = useState(false)
  const [burstCoords, setBurstCoords] = useState(null)
  
  const haptics = useHaptics()
  
  // Load full profile async details (username, bio) for the video 
  const { profile } = useProfile(video.profileId)

  // Needs manual toggle access for double-tap
  const { isLiked, toggleLike } = useInteractions(video.id)

  const isPlaying = playerRef.current?.isPlaying || isActive

  // Map gestures
  const handleSingleTap = useCallback(() => {
    const videoEl = playerRef.current?.videoElement
    if (!videoEl) return
    
    // Toggle manual pause
    if (videoEl.paused) {
      videoEl.play().catch(console.error)
    } else {
      videoEl.pause()
    }
    
    // Briefly display overlay icon
    setShowPlayPause(true)
    setTimeout(() => {
      // Small timeout to allow transition to register before resetting toggle
      if(containerRef.current) setShowPlayPause(false)
    }, 100)
    
  }, [])

  const handleDoubleTap = useCallback((e) => {
    // Record exact tap pixel coordinates for animation burst map
    const touch = e.changedTouches ? e.changedTouches[0] : e
    const rect = containerRef.current.getBoundingClientRect()
    
    setBurstCoords({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      id: Date.now() // Unique ID to force re-render newly
    })
    
    haptics.doubleTapLike()

    if (!isLiked) {
      toggleLike()
    }
  }, [isLiked, toggleLike, haptics])

  const handleLongPress = useCallback(() => {
    haptics.longPressStart()
    const videoEl = playerRef.current?.videoElement
    if (videoEl && !videoEl.paused) {
      videoEl.pause() // Pause explicitly
    }
  }, [haptics])

  const handleLongPressEnd = useCallback(() => {
    haptics.longPressRelease()
    const videoEl = playerRef.current?.videoElement
    // Only resume if meant to be playing
    if (videoEl && isActive) {
      videoEl.play().catch(() => {})
    }
  }, [isActive, haptics])

  // Attach Gestures directly native wrapping container manually
  useGestures(containerRef, {
    onTap: handleSingleTap,
    onDoubleTap: handleDoubleTap,
    onLongPress: handleLongPress,
    onLongPressEnd: handleLongPressEnd,
    // Snap bindings if required externally for arrow key emulation mappings
    onSwipeUp: onSnapUp,
    onSwipeDown: onSnapDown
  })

  // Prevent parent scroll grabbing by making text selections blocked
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen-dvh snap-child overflow-hidden bg-black touch-pan-y isolate select-none"
    >
      <VideoPlayer 
        ref={playerRef} 
        video={video} 
        isActive={isActive}
      />
      
      <PlayPauseOverlay 
         isPlaying={!playerRef.current?.videoElement?.paused} 
         show={showPlayPause} 
      />
      
      {burstCoords && (
         <HeartBurst 
           key={burstCoords.id} 
           x={burstCoords.x} 
           y={burstCoords.y} 
           onComplete={() => setBurstCoords(null)} 
         />
      )}

      {/* Action Bars overlayed explicitly on Z axes globally tracking layout spans */}
      <ActionBar 
         video={video} 
         profile={profile}
         onCommentClick={() => onCommentOpen(video.id)} 
      />

      <UserInfo 
         profile={profile} 
         description={video.description} 
         musicTitle={video.musicTitle}
         isPlaying={!playerRef.current?.videoElement?.paused}
      />
      
      <MusicDisc 
         avatarUrl={profile?.avatarUrl} 
         isPlaying={!playerRef.current?.videoElement?.paused}
      />

    </div>
  )
})

VideoCard.displayName = 'VideoCard'

export default VideoCard
