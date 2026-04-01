import React, { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'

/**
 * HeartBurst
 * Animation component for double-tap likes. Spawns at exact tap coordinates.
 * Exists temporarily and automatically unmounts using a local timer after animation.
 */
export function HeartBurst({ x, y, onComplete }) {
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    // Matches the 600ms CSS animation duration in tailwind.config.js
    const timer = setTimeout(() => {
      setMounted(false)
      if (onComplete) onComplete()
    }, 600)

    return () => clearTimeout(timer)
  }, [onComplete])

  if (!mounted) return null

  // Adjust coordinates slightly to center the heart exactly under the finger tap
  const transformStyle = {
    left: `${x}px`,
    top: `${y}px`,
    // offset 50% translates happens inside the CSS keyframe `heartBurst` natively
  }

  return (
    <div
      className="absolute pointer-events-none z-50 animate-heart-burst"
      style={transformStyle}
    >
      <Heart
        size={80}
        color="#FF6B6B" // var(--color-accent)
        fill="#FF6B6B"
        strokeWidth={1.5}
        // Minimal shadow to pull it off the video layer
        className="filter drop-shadow-md opacity-90"
      />
    </div>
  )
}

export default HeartBurst
