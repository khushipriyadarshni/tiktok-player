import React, { createContext, useContext, useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useDB } from './DBContext.jsx'

export const AppContext = createContext(null)

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export function AppProvider({ children }) {
  const { profiles } = useDB()
  const [activeUserId, setActiveUserId] = useState(() => localStorage.getItem('toktik_active_user'))
  const [isMuted, setIsMuted] = useState(() => {
    const stored = localStorage.getItem('toktik_is_muted')
    return stored !== null ? stored === 'true' : true
  })

  // Listen to changes in localStorage if seed happens async after first render
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('toktik_active_user')
      if (storedUser && storedUser !== activeUserId) {
        setActiveUserId(storedUser)
      }
    }
    window.addEventListener('storage', handleStorageChange)
    // Custom event to catch updates in the current window:
    window.addEventListener('toktik_seed_complete', handleStorageChange)
    
    // Initial sync
    handleStorageChange()
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('toktik_seed_complete', handleStorageChange)
    }
  }, [activeUserId])

  // Reactively load active user from DB
  const activeUser = useLiveQuery(
    () => (activeUserId ? profiles.getById(activeUserId) : null),
    [activeUserId]
  )

  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev
      localStorage.setItem('toktik_is_muted', String(next))
      return next
    })
  }

  const value = {
    activeUser,
    isMuted,
    toggleMute,
    theme: 'light'
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
