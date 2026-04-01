import { useState, useEffect } from 'react'
import { useDB } from '../context/DBContext.jsx'

/**
 * useSearch
 * Debounces search input and queries the Dexie DB for matching profiles.
 */
export function useSearch(query, delay = 150) {
  const { profiles } = useDB()
  
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // 1. Debounce the raw query typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim())
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [query, delay])

  // 2. Perform the actual DB operation when the debounced query changes
  useEffect(() => {
    let isMounted = true

    const fetchResults = async () => {
      if (!debouncedQuery) {
        if (isMounted) {
          setResults([])
          setIsLoading(false)
        }
        return
      }

      if (isMounted) setIsLoading(true)

      try {
        const matches = await profiles.search(debouncedQuery)
        if (isMounted) {
          setResults(matches || [])
        }
      } catch (err) {
        console.error('[TokTik Search] Error searching profiles:', err)
        if (isMounted) setResults([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchResults()

    return () => {
      isMounted = false
    }
  }, [debouncedQuery, profiles])

  return { results, isLoading }
}
