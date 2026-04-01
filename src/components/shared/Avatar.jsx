import React from 'react'

/**
 * Avatar
 * Circular image with a letter-based color fallback if avatarUrl is missing.
 */
export function Avatar({ size = 48, avatarUrl, username, displayName, className = '' }) {
  // If no image, derive a deterministic color from the username hash and use the first letter of displayName
  const getFallbackChars = () => {
    if (displayName) return displayName.charAt(0).toUpperCase()
    if (username) return username.replace('@', '').charAt(0).toUpperCase()
    return '?'
  }

  const getFallbackBgColor = () => {
    if (!username) return '#E8E6E0' // var(--color-border)
    let hash = 0
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash)
    }
    // Set of warm, calm fallback colors matching the TokTik theme
    const colors = ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#F4D6D2']
    const colorIndex = Math.abs(hash) % colors.length
    return colors[colorIndex]
  }

  const defaultClasses = 'relative rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center font-inter font-bold text-white'

  if (avatarUrl && avatarUrl.trim() !== '') {
    return (
      <div 
        className={`${defaultClasses} ${className}`} 
        style={{ width: size, height: size, backgroundColor: '#E8E6E0' }}
      >
        <img 
          src={avatarUrl} 
          alt={`${displayName || username}'s avatar`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  // Fallback
  return (
    <div 
      className={`${defaultClasses} ${className}`} 
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: getFallbackBgColor(),
        fontSize: Math.max(12, size * 0.4) // Proportional font size
      }}
    >
      {getFallbackChars()}
    </div>
  )
}

export default Avatar
