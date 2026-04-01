import React from 'react'
import { Music } from 'lucide-react'
import Avatar from '../shared/Avatar.jsx'

/**
 * MusicDisc
 * Circular rotating disk pinned at the bottom right. Pauses when video is paused.
 */
export function MusicDisc({ avatarUrl, isPlaying }) {
  return (
    <div className="absolute right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+64px)] z-20 w-12 h-12">
      <div
        className={`w-full h-full rounded-full border-[5px] border-toktik-text-primary/20 bg-toktik-bg flex items-center justify-center
        animate-spin-disc
        ${isPlaying ? 'animation-running' : 'animation-paused'}
        `}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center">
            <Music size={16} fill="rgba(255,255,255,0.8)" stroke="white" strokeWidth={1} className="text-white" />
        </div>
      </div>
    </div>
  )
}

export default MusicDisc
