import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon, X, User } from 'lucide-react'
import { useSearch } from '../hooks/useSearch.js'
import { useDB } from '../context/DBContext.jsx'
import Avatar from '../components/shared/Avatar.jsx'
import VerifiedBadge from '../components/shared/VerifiedBadge.jsx'

/**
 * SearchPage
 * Provides debounced user searching dynamically fetching from the Dexie DB profiles block.
 */
export function SearchPage() {
  const navigate = useNavigate()
  const { profiles } = useDB()
  const [query, setQuery] = useState('')
  const [suggestedUsers, setSuggestedUsers] = useState([])
  const { results, isLoading } = useSearch(query, 250) // 250ms debounce
  
  useEffect(() => {
    // Fetch some dummy/recent profiles for suggestions
    const fetchSuggestions = async () => {
      try {
        const allProfiles = await profiles.getAll()
        // Randomize or just take top 4
        setSuggestedUsers(allProfiles.slice(0, 4))
      } catch (err) {
        console.error('Error fetching suggestions', err)
      }
    }
    fetchSuggestions()
  }, [profiles])
  
  // Format numbers nicely
  const formatStat = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 10000) return (num / 1000).toFixed(1) + 'K'
    return num?.toLocaleString() || '0'
  }

  const handleClear = () => {
    setQuery('')
  }
  
  return (
    <div className="bg-toktik-bg min-h-screen-dvh flex flex-col pt-safe px-4 pb-20">
      
      {/* Fixed Search Header */}
      <div className="sticky top-0 bg-toktik-bg pt-4 pb-2 z-30">
        <h1 className="text-2xl font-bold font-inter mb-4 text-toktik-text-primary px-1 tracking-tight">
          Discover
        </h1>
        
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon size={18} className="text-toktik-text-tertiary" />
          </div>
          <input
            type="text"
            className="w-full bg-toktik-surface border border-toktik-border focus:border-toktik-accent rounded-lg py-2.5 pl-10 pr-10 text-[15px] font-inter outline-none text-toktik-text-primary placeholder:text-toktik-text-tertiary transition-colors"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoCapitalize="off"
            autoComplete="off"
          />
          {query.length > 0 && (
             <button 
               onClick={handleClear}
               className="absolute inset-y-0 right-0 pr-3 flex items-center text-toktik-text-tertiary hover:text-toktik-text-secondary active:scale-95 transition-transform"
             >
               <X size={18} />
             </button>
          )}
        </div>
      </div>

      {/* Results List */}
      <div className="flex-1 mt-4 overflow-y-auto">
        {isLoading ? (
          <div className="animate-pulse space-y-4 px-1">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex gap-4 items-center">
                 <div className="w-14 h-14 rounded-full bg-toktik-border/50 shrink-0" />
                 <div className="flex-1 py-1">
                   <div className="w-1/2 h-4 rounded bg-toktik-border/50 mb-2" />
                   <div className="w-1/3 h-3 rounded bg-toktik-border/50" />
                 </div>
               </div>
             ))}
          </div>
        ) : query.trim().length > 0 && results.length === 0 ? (
           <div className="flex flex-col items-center justify-center mt-20 text-toktik-text-tertiary">
              <SearchIcon size={48} className="mb-4 opacity-20" />
              <p className="font-semibold text-toktik-text-primary mb-1">No results found</p>
              <p className="text-sm">Try searching for a different username.</p>
           </div>
        ) : results.length > 0 ? (
           <div className="space-y-4 px-1 pb-4">
              <h3 className="text-xs font-bold text-toktik-text-secondary tracking-wider uppercase mb-2">Users</h3>
              {results.map(user => (
                <div 
                  key={user.id} 
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="flex items-center gap-3 active:bg-toktik-surface p-2 -mx-2 rounded-xl transition-colors cursor-pointer"
                >
                  <Avatar 
                    size={56} 
                    username={user.username} 
                    displayName={user.displayName} 
                    avatarUrl={user.avatarUrl} 
                    className="border border-toktik-border/50"
                  />
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-1">
                        <span className="font-bold text-toktik-text-primary text-[15px] truncate">
                          {user.username}
                        </span>
                        {user.isVerified && <VerifiedBadge size={14} className="-mt-0.5" />}
                     </div>
                     <div className="text-toktik-text-secondary text-[13px] truncate">
                        {user.displayName}
                     </div>
                     <div className="text-toktik-text-tertiary text-xs mt-0.5 flex items-center gap-1.5 font-medium">
                        <User size={10} />
                        {formatStat(user.followerCount)} followers
                     </div>
                  </div>
                </div>
              ))}
           </div>
        ) : (
           <div className="space-y-4 px-1 pb-4">
              <h3 className="text-xs font-bold text-toktik-text-secondary tracking-wider uppercase mb-2">Suggested Accounts</h3>
              {suggestedUsers.map(user => (
                <div 
                  key={user.id} 
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="flex items-center gap-3 active:bg-toktik-surface p-2 -mx-2 rounded-xl transition-colors cursor-pointer"
                >
                  <Avatar 
                    size={56} 
                    username={user.username} 
                    displayName={user.displayName} 
                    avatarUrl={user.avatarUrl} 
                    className="border border-toktik-border/50"
                  />
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-1">
                        <span className="font-bold text-toktik-text-primary text-[15px] truncate">
                          {user.username}
                        </span>
                        {user.isVerified && <VerifiedBadge size={14} className="-mt-0.5" />}
                     </div>
                     <div className="text-toktik-text-secondary text-[13px] truncate">
                        {user.displayName}
                     </div>
                     <div className="text-toktik-text-tertiary text-xs mt-0.5 flex items-center gap-1.5 font-medium">
                        <User size={10} />
                        {formatStat(user.followerCount)} followers
                     </div>
                  </div>
                </div>
              ))}
           </div>
        )}
      </div>

    </div>
  )
}

export default SearchPage
