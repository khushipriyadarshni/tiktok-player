import React from 'react'
import { Music, Play, Bookmark, Heart, MessageCircle, Share2 } from 'lucide-react'

/**
 * SkeletonCard
 * Full screen shimmer acting as an exact layout matching the final VideoCard structure.
 */
export function SkeletonCard() {
  return (
    <div className="relative h-screen-dvh w-full snap-child overflow-hidden bg-toktik-bg pb-safe">
      {/* Background full-area shimmer mimicking video fetch delay */}
      <div className="absolute inset-0 skeleton"></div>

      {/* Mock Action Bar (Right edge) */}
      <div className="absolute right-4 bottom-[10%] flex flex-col items-center gap-6 z-20">
        <div className="flex flex-col items-center gap-1 mt-4">
          <div className="w-[44px] h-[44px] skeleton rounded-full" />
          <div className="w-8 h-3 skeleton rounded-full mt-1" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-[44px] h-[44px] skeleton rounded-full" />
          <div className="w-8 h-3 skeleton rounded-full mt-1" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-[44px] h-[44px] skeleton rounded-full" />
          <div className="w-8 h-3 skeleton rounded-full mt-1" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-[44px] h-[44px] skeleton rounded-full" />
          <div className="w-8 h-3 skeleton rounded-full mt-1" />
        </div>

        {/* Music Disc skeleton wrapper */}
        <div className="mt-4 pt-4 border-t border-toktik-border/10">
          <div className="w-12 h-12 skeleton rounded-full" />
        </div>
      </div>

      {/* Mock User Details (Bottom left) */}
      <div className="absolute left-4 bottom-[calc(env(safe-area-inset-bottom,0px)+64px)] right-20 z-20 flex flex-col items-start max-w-[80%]">
         {/* Username string placeholder */}
         <div className="w-32 h-5 skeleton rounded mb-3" />
         
         {/* Description wrapping placeholders */}
         <div className="w-full h-4 skeleton rounded mb-2" />
         <div className="w-2/3 h-4 skeleton rounded mb-3" />

         {/* Music track string ticker placeholder */}
         <div className="w-1/2 h-3 skeleton rounded" />
      </div>

    </div>
  )
}

export default SkeletonCard
