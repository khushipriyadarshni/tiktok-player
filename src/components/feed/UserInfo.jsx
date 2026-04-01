import React, { useState } from 'react'
import { Music } from 'lucide-react'
import { Link } from 'react-router-dom'

/**
 * UserInfo
 * Renders the video creator info (username, description with expand toggle, scrolling music bar).
 */
export function UserInfo({ profile, description, musicTitle, isPlaying }) {
  const [expanded, setExpanded] = useState(false)

  // Maximum characters before forcing truncation
  const charLimit = 80
  const isTruncated = description?.length > charLimit

  const renderDescription = () => {
    if (!description) return null
    if (!isTruncated || expanded) {
      return (
        <p className="text-13 leading-[1.2] text-white text-shadow-video font-inter break-words pb-1">
          {description}
          {expanded && (
            <span 
              onClick={(e) => { e.stopPropagation(); setExpanded(false) }}
              className="font-semibold cursor-pointer ml-1 no-underline text-white/90"
            >
              less
            </span>
          )}
        </p>
      )
    }

    // Default Truncated View
    return (
      <p 
        className="text-13 leading-[1.2] text-white text-shadow-video font-inter cursor-pointer m-0 break-words" 
        onClick={(e) => { e.stopPropagation(); setExpanded(true) }}
      >
        <span className="line-clamp-2 inline">
           {description}
        </span>
        <span className="font-semibold text-white/90 no-underline whitespace-nowrap pl-1">
          more
        </span>
      </p>
    )
  }

  return (
    <div className="absolute left-4 bottom-[calc(env(safe-area-inset-bottom,0px)+64px)] right-20 z-20 flex flex-col items-start pb-2" onClick={(e) => e.stopPropagation()}>
      
      {/* Username Handle */}
      {profile && (
        <Link 
          to={`/profile/${profile.id}`} 
          className="font-inter font-semibold text-[15px] mb-1.5 text-white text-shadow-video pointer-events-auto active:opacity-75 focus-visible:outline-white"
        >
          {profile.username}
        </Link>
      )}

      {/* Description String */}
      <div className="w-full pointer-events-auto pr-4 mb-3" onClick={(e) => e.stopPropagation()}>
        {renderDescription()}
      </div>

      {/* Music Ticker */}
      <div className="flex items-center w-48 overflow-hidden">
        <Music size={14} className="text-white shrink-0 filter drop-shadow mr-2" />
        <div className="relative w-full h-[18px] overflow-hidden mask-edge pointer-events-auto">
           {/* Long string to demonstrate marquee */}
           <div 
             className={`absolute whitespace-nowrap text-[13px] text-white text-shadow-video font-inter flex
             ${isPlaying ? 'animate-ticker' : 'animation-paused'}
             `}
           >
             <span className="mr-8">{musicTitle || 'Original Audio'}</span>
             <span>{musicTitle || 'Original Audio'}</span>
           </div>
        </div>
      </div>
    </div>
  )
}

export default UserInfo
