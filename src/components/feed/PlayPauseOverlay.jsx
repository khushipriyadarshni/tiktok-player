import React, { useState, useEffect } from 'react'
import { Play } from 'lucide-react'

// Constants
const HIDE_DELAY = 800 // ms

/**
 * PlayPauseOverlay
 * A simple centered play icon that appears and fades out when toggled.
 */
export function PlayPauseOverlay({ isPlaying, show }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
      }, HIDE_DELAY)
      
      return () => clearTimeout(timer)
    }
  }, [show, isPlaying])

  if (!visible || isPlaying) return null

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
      <div className="w-16 h-16 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center animate-play-pause text-white">
        <Play size={32} fill="white" className="ml-1 translate-x-0.5" />
      </div>
    </div>
  )
}

export default PlayPauseOverlay
