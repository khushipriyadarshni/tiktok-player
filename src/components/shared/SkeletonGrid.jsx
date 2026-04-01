import React from 'react'

/**
 * SkeletonGrid
 * Simulates a 3-column video thumbnail layout while a profile queries DB metadata.
 */
export function SkeletonGrid({ count = 9 }) {
  // Generate an array of arbitrary size strictly to map out UI divs
  const placeholders = Array.from({ length: count })

  return (
    <div className="grid grid-cols-3 gap-0.5 mt-1 bg-toktik-bg">
      {placeholders.map((_, i) => (
        <div key={i} className="aspect-square skeleton w-full relative">
           {/* Simulate a tiny playback count pill optionally bottom-left to build realistic framing */}
           <div className="absolute bottom-1.5 left-1.5 skeleton w-8 h-3 rounded-full bg-black/20" />
        </div>
      ))}
    </div>
  )
}

export default SkeletonGrid
