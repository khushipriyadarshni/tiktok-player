import { useCallback } from 'react'

/**
 * useHaptics
 * Wraps the Vibration API to provide named haptic feedback patterns.
 * Silently ignores calls on unsupported devices (like iOS Safari).
 */
export function useHaptics() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator

  const trigger = useCallback((pattern) => {
    if (isSupported) {
      try {
        navigator.vibrate(pattern)
      } catch (e) {
        // Silently fail if blocked by browser policy
      }
    }
  }, [isSupported])

  return {
    like: () => trigger([12]),                   // Single short pulse
    unlike: () => trigger([6]),                  // Half-strength short
    doubleTapLike: () => trigger([15, 40, 15]),  // Double pop
    bookmark: () => trigger([10]),               // Quick tick
    commentOpen: () => trigger([8]),             // Soft tap
    share: () => trigger([10]),                  // Soft tap
    follow: () => trigger([20]),                 // Medium confirm
    unfollow: () => trigger([8]),                // Soft confirm
    soundToggle: () => trigger([6]),             // Micro tick
    avatarFollow: () => trigger([20]),           // Medium confirm
    longPressStart: () => trigger([30]),         // Hold confirm
    longPressRelease: () => trigger([10]),       // Release tick
    snap: () => trigger([5])                     // Micro transition
  }
}
