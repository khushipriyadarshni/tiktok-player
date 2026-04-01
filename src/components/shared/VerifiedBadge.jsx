import React from 'react'
import { BadgeCheck } from 'lucide-react'

/**
 * VerifiedBadge
 * Small checkmark icon used next to verified creators' names.
 */
export function VerifiedBadge({ size = 14, className = '' }) {
  return (
    <BadgeCheck 
      size={size} 
      className={`text-toktik-text-primary inline ml-1 align-text-bottom ${className}`} 
      fill="#FAFAF8" // Fill to block out background, creating contrast
    />
  )
}

export default VerifiedBadge
