import React from 'react'
import { Heart, MessageCircle, Forward, Bookmark, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useInteractions } from '../../hooks/useInteractions.js'
import { useHaptics } from '../../hooks/useHaptics.js'
import { useLiveQuery } from 'dexie-react-hooks'
import { useDB } from '../../context/DBContext.jsx'
import Avatar from '../shared/Avatar.jsx'

/**
 * ActionBar
 * A clean stack of absolute interaction buttons rendering right-aligned on a VideoCard.
 */
export function ActionBar({ video, profile, onCommentClick }) {
  const navigate = useNavigate()
  const haptics = useHaptics()
  const { videos } = useDB()
  const liveVideo = useLiveQuery(() => videos.getById(video.id), [video.id]) || video
  
  const { 
    isLiked, 
    isBookmarked, 
    isFollowing, 
    toggleLike, 
    toggleBookmark, 
    toggleFollow 
  } = useInteractions(video.id, profile?.id)

  const handleLike = (e) => {
    e.stopPropagation()
    // Haptics mapping 
    if (isLiked) haptics.unlike()
    else haptics.like()

    // Trigger explicit animation using DOM node reference without react unmounting
    const el = e.currentTarget.querySelector('svg')
    if (el) {
       el.classList.remove('animate-spring-pop')
       // Force reflow
       void el.offsetWidth 
       el.classList.add('animate-spring-pop')
    }
    
    toggleLike()
  }

  const handleBookmark = (e) => {
    e.stopPropagation()
    haptics.bookmark()
    toggleBookmark()
  }

  const handleFollow = (e) => {
    e.stopPropagation()
    haptics.avatarFollow()
    toggleFollow()
  }

  const handleShare = async (e) => {
    e.stopPropagation()
    haptics.share()
    
    const shareData = {
      title: 'TokTik Video',
      text: video.description || 'Check out this video on TokTik',
      url: window.location.href, // E.g., sharing the current feed URL mapping
    }

    try {
       if (navigator.share) {
         await navigator.share(shareData)
       } else {
         // Fallback clipboard logic
         await navigator.clipboard.writeText(shareData.url)
         alert('Link copied to clipboard!') // Basic toast fallback
       }
    } catch (err) {
       console.log('Share dismissed or failed.')
    }
  }

  // Formatting helpers
  const formatCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
    if (count >= 10000) return (count / 1000).toFixed(1) + 'K'
    return count?.toString() || '0'
  }

  return (
    <div className="absolute right-4 bottom-[calc(env(safe-area-inset-bottom,0px)+120px)] flex flex-col items-center gap-6 z-20 pointer-events-auto">
      
      {/* Avatar Box with Follow Badge */}
      <div 
        className="relative mb-2 cursor-pointer transition-transform active:scale-95 flex flex-col items-center" 
        onClick={(e) => { e.stopPropagation(); navigate(`/profile/${profile?.id}`) }}
      >
        <div className="w-[48px] h-[48px] bg-white rounded-full p-[2px] shadow-sm">
           <Avatar 
             size={44} 
             username={profile?.username} 
             displayName={profile?.displayName}
             avatarUrl={profile?.avatarUrl} 
           />
        </div>
        
        {/* Toggleable Follow Badge placed exactly on the bottom bridge */}
        {!isFollowing && (
          <button 
            onClick={handleFollow}
            className="absolute -bottom-2 w-5 h-5 bg-toktik-accent rounded-full flex items-center justify-center text-white border-2 border-toktik-bg shadow-sm"
          >
            <Plus size={12} strokeWidth={3} />
          </button>
        )}
      </div>

      {/* Interactions */}
      <div className="flex flex-col items-center gap-1 w-12 cursor-pointer transition-transform active:scale-95" onClick={handleLike}>
        <Heart 
          size={36} 
          fill={isLiked ? "var(--color-accent)" : "rgba(255,255,255,0.7)"}
          color={isLiked ? "var(--color-accent)" : "white"} 
          strokeWidth={isLiked ? 0 : 2}
          className="filter drop-shadow-md origin-center"
        />
        <span className="text-white text-[12px] font-semibold font-inter text-shadow-video mt-1">
          {formatCount(liveVideo.likes)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1 w-12 cursor-pointer transition-transform active:scale-95" onClick={(e) => { e.stopPropagation(); onCommentClick() }}>
        <MessageCircle 
          size={36} 
          fill="rgba(255,255,255,0.7)"
          color="white" 
          strokeWidth={0}
          className="filter drop-shadow-md"
        />
        <span className="text-white text-[12px] font-semibold font-inter text-shadow-video mt-1">
          {formatCount(liveVideo.comments)}
        </span>
      </div>

      <div className="flex flex-col items-center gap-1 w-12 cursor-pointer transition-transform active:scale-95" onClick={handleBookmark}>
        <Bookmark 
          size={36} 
          fill={isBookmarked ? "#FFB7B2" : "rgba(255,255,255,0.7)"} 
          color={isBookmarked ? "#FFB7B2" : "white"} 
          strokeWidth={isBookmarked ? 0 : 2}
          className="filter drop-shadow-md origin-center"
        />
        <span className="text-white text-[12px] font-semibold font-inter text-shadow-video mt-1">
          {formatCount(liveVideo.bookmarks)}
        </span>
      </div>

      <div className="flex flex-col items-center w-12 cursor-pointer transition-transform active:scale-95" onClick={handleShare}>
        <Forward 
          size={36} 
          fill="rgba(255,255,255,0.7)"
          color="white" 
          strokeWidth={0}
          className="filter drop-shadow-md"
        />
        <span className="text-white text-[12px] font-semibold font-inter text-shadow-video mt-1">
          {formatCount(liveVideo.shares)}
        </span>
      </div>

    </div>
  )
}

export default ActionBar
