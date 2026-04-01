import { useState, useEffect, useCallback } from 'react'

/**
 * usePlayer
 * Wraps native HTML5 video player logic handling play/pause promises, autoplay blocking, and metadata parsing.
 * Driven entirely by `isActive` props assigned from the feed.
 */
export function usePlayer(videoRef, isActive, isMuted) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  
  // Track manual pauses so auto-scrolling doesn't override user intent instantly
  const [manuallyPaused, setManuallyPaused] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isActive) {
      if (!manuallyPaused) {
        // Must pass through a play promise trap
        const playPromise = video.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => {
              console.warn('[TokTik Player] Autoplay blocked by browser policy:', error)
              // User interaction required to play
              setIsPlaying(false)
            })
        } else {
          setIsPlaying(true)
        }
      }
    } else {
      // Whenever it goes out of view, we pause it implicitly
      video.pause()
      setIsPlaying(false)
      // Reset manual pause state when navigating away so it loops normally next time
      setManuallyPaused(false)
      
      // Optionally reset time to 0 for a fresh start on reentry
      // video.currentTime = 0
    }
  }, [isActive, videoRef, manuallyPaused])

  // Sync mute state externally from AppContext directly to DOM node prop
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = isMuted
  }, [isMuted, videoRef])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true)
        setManuallyPaused(false)
      }).catch(err => console.error("Play failed:", err))
    } else {
      video.pause()
      setIsPlaying(false)
      setManuallyPaused(true)
    }
  }, [videoRef])

  // Listeners attached directly in component using native react events
  // Update local react state synchronously driven by DOM values
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleEnded = () => {
    if (videoRef.current) {
      // Since video is set to `loop`, this might not fire often, but handles edges
      videoRef.current.play() 
    }
  }

  return {
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded
  }
}
