import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bookmark, Grid3x3 } from 'lucide-react'
import { useDB } from '../context/DBContext.jsx'
import { useAppContext } from '../context/AppContext.jsx'
import SkeletonGrid from '../components/shared/SkeletonGrid.jsx'

/**
 * SavedPage
 * Renders a grid of videos the activeUser has bookmarked.
 * Uses getBookmarkedVideos from interactionAPI natively.
 */
export function SavedPage() {
  const navigate = useNavigate()
  const { interactions } = useDB()
  const { activeUser } = useAppContext()
  
  const [savedVideos, setSavedVideos] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchSaved = async () => {
      if (!activeUser?.id) return
      setIsLoading(true)
      try {
        const vids = await interactions.getBookmarkedVideos(activeUser.id)
        if (active) setSavedVideos(vids)
      } catch (e) {
        console.error("Error fetching saved videos:", e)
      } finally {
        if (active) setIsLoading(false)
      }
    }
    fetchSaved()
    return () => { active = false }
  }, [activeUser?.id, interactions])

  const formatStat = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 10000) return (num / 1000).toFixed(1) + 'K'
    return num?.toLocaleString() || '0'
  }

  return (
    <div className="bg-toktik-bg min-h-screen-dvh flex flex-col pt-safe pb-20">
      
      {/* Sticky Header */}
      <div className="sticky top-0 bg-toktik-bg/90 backdrop-blur z-30 pt-4 pb-2 border-b border-toktik-border">
        <h1 className="text-2xl font-bold font-inter text-toktik-text-primary px-5 tracking-tight flex items-center gap-2">
          Saved
          <Bookmark size={20} className="text-toktik-text-primary" strokeWidth={2.5} />
        </h1>
      </div>

      {/* Grid Content */}
      <div className="flex-1 mt-2">
        {isLoading ? (
          <SkeletonGrid count={9} />
        ) : savedVideos.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-32 text-center text-toktik-text-tertiary px-8">
             <div className="w-20 h-20 bg-toktik-surface rounded-full flex items-center justify-center mb-6 border border-toktik-border">
                <Bookmark size={32} strokeWidth={1.5} className="text-toktik-text-secondary" />
             </div>
             <p className="font-semibold text-lg text-toktik-text-primary mb-2">No saved videos</p>
             <p className="text-[15px] leading-snug">Videos you bookmark will appear here so you can find them later.</p>
             <button 
               onClick={() => navigate('/')}
               className="mt-8 px-6 py-2.5 bg-toktik-accent text-white font-semibold rounded active:bg-red-600 transition-colors"
             >
               Discover videos
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5 px-0.5">
             {savedVideos.map(video => (
               <div 
                 key={video.id} 
                 onClick={() => navigate('/')} // Emulate jumping to feed
                 className="aspect-[3/4] bg-toktik-border/30 relative group overflow-hidden cursor-pointer active:opacity-80 transition-opacity rounded-sm"
               >
                  <video 
                    src={video.url} 
                    className="w-full h-full object-cover" 
                    preload="metadata"
                    muted
                    playsInline
                  />
                  {/* Overlay shadow for text readability */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-white z-10 font-medium text-xs text-shadow-video">
                     <Grid3x3 size={12} strokeWidth={2.5} />
                     {formatStat(video.bookmarks)}
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default SavedPage
