import { useEffect, useRef } from 'react'

/**
 * useGestures
 * Manages touch events to distinguish single-tap, double-tap, long-press, and directional swipes.
 * Handles the 180ms disambiguation window for tapping.
 */
export function useGestures(elementRef, handlers = {}) {
  const { onTap, onDoubleTap, onLongPress, onLongPressEnd, onSwipeUp, onSwipeDown } = handlers
  
  // Timer references
  const tapTimerRef = useRef(null)
  const longPressTimerRef = useRef(null)
  
  // State refs 
  const touchStateRef = useRef({
    startX: 0,
    startY: 0,
    startTimestamp: 0,
    isLongPressing: false,
    tapCount: 0,
    lastTapTimestamp: 0
  })

  useEffect(() => {
    const el = elementRef.current
    if (!el) return

    const handleTouchStart = (e) => {
      // Allow multi-touch to cancel gesture handling safely
      if (e.touches.length > 1) return
      
      const touch = e.touches[0]
      touchStateRef.current.startX = touch.clientX
      touchStateRef.current.startY = touch.clientY
      touchStateRef.current.startTimestamp = Date.now()
      touchStateRef.current.isLongPressing = false

      // Clear any pending long press so we can restart the timer
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
      
      // Start long press timeout (500ms threshold)
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          touchStateRef.current.isLongPressing = true
          onLongPress(e)
        }, 500)
      }
    }

    const handleTouchMove = (e) => {
      // Cancel long press if user moves their finger significantly
      if (!touchStateRef.current.isLongPressing && longPressTimerRef.current) {
        const touch = e.touches[0]
        const dx = touch.clientX - touchStateRef.current.startX
        const dy = touch.clientY - touchStateRef.current.startY
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
          clearTimeout(longPressTimerRef.current)
        }
      }
    }

    const handleTouchEnd = (e) => {
      const state = touchStateRef.current
      const endTime = Date.now()
      const duration = endTime - state.startTimestamp

      // Cleanup long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }

      // Handle long press release
      if (state.isLongPressing) {
        if (onLongPressEnd) onLongPressEnd(e)
        state.isLongPressing = false
        // Reset tap counting entirely to prevent a double-tap firing right after
        state.tapCount = 0
        return
      }

      // Evaluate swipe if not a long press
      // Use changedTouches for touchend
      const touch = e.changedTouches[0]
      const dx = touch.clientX - state.startX
      const dy = Math.abs(touch.clientY - state.startY)
      const dyRaw = touch.clientY - state.startY

      // Thresholds: move at least 40px vertically, less than 50px horizontally, within 350ms
      if (duration < 350 && dy > 40 && Math.abs(dx) < 50) {
        if (dyRaw > 0 && onSwipeDown) onSwipeDown(e)
        if (dyRaw < 0 && onSwipeUp) onSwipeUp(e)
        state.tapCount = 0 // swipe cancels taps
        return
      }

      // If it's just a tap (movement was minimal)
      if (Math.abs(dx) < 10 && dy < 10) {
        const timeSinceLastTap = endTime - state.lastTapTimestamp
        
        // Double tap threshold is < 300ms between taps
        if (state.tapCount === 1 && timeSinceLastTap < 300) {
          // Double Tap Triggered
          if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
          if (onDoubleTap) onDoubleTap(e)
          state.tapCount = 0
          state.lastTapTimestamp = 0
        } else {
          // First tap recorded, prepare to disambiguate
          state.tapCount = 1
          state.lastTapTimestamp = endTime
          
          if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
          
          tapTimerRef.current = setTimeout(() => {
            // Wait to see if a second tap comes. If not, trigger single tap.
            if (state.tapCount === 1) {
              if (onTap) onTap(e)
              state.tapCount = 0
            }
          }, 200) // Disambiguation delay
        }
      }
    }

    // Passive false because we might need to `e.preventDefault()` via gestures eventually
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
      if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
    }
  }, [elementRef, onTap, onDoubleTap, onLongPress, onLongPressEnd, onSwipeUp, onSwipeDown])
}
