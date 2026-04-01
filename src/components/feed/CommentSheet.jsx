import React, { useState, useRef, useEffect } from 'react'
import { X, Send } from 'lucide-react'
import Avatar from '../shared/Avatar.jsx'
import { useComments } from '../../hooks/useComments.js'
import { useAppContext } from '../../context/AppContext.jsx'

/**
 * CommentSheet
 * A slide-up drawer for video comments. Reads/writes to DB via hooks.
 */
export function CommentSheet({ videoId, onClose }) {
  const [newText, setNewText] = useState('')
  const { comments, isLoading, addComment } = useComments(videoId)
  const { activeUser } = useAppContext()
  const inputRef = useRef(null)
  
  // Animate in
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = (e) => {
    if (e) e.stopPropagation()
    setMounted(false)
    setTimeout(onClose, 250) // Match transition duration
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newText.trim() || !activeUser) return
    
    await addComment(newText.trim())
    setNewText('')
    // Scroll to bottom optionally
  }

  const formatTimeAgo = (isoString) => {
    const date = new Date(isoString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHrs = Math.floor(diffMins / 60)
    if (diffHrs < 24) return `${diffHrs}h ago`
    return `${Math.floor(diffHrs / 24)}d ago`
  }

  return (
    <div 
      className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/50 overflow-hidden pointer-events-auto transition-opacity duration-200"
      onClick={handleClose}
      style={{ opacity: mounted ? 1 : 0 }}
    >
      <div 
        className="relative bg-white w-full h-[65vh] rounded-t-2xl flex flex-col shadow-2xl transition-transform duration-250 ease-out"
        onClick={e => e.stopPropagation()}
        style={{ transform: mounted ? 'translateY(0)' : 'translateY(100%)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-toktik-border">
          <div className="w-6" /> {/* Placeholder for center alignment */}
          <h2 className="font-semibold text-toktik-text-primary text-sm font-inter">
            {comments?.length || 0} comments
          </h2>
          <button onClick={handleClose} className="p-1 -mr-1 rounded-full text-toktik-text-secondary active:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-3 mt-4">
                   <div className="w-8 h-8 rounded-full skeleton shrink-0" />
                   <div className="flex-1">
                     <div className="w-1/3 h-3 skeleton mb-2" />
                     <div className="w-3/4 h-3 skeleton" />
                   </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-toktik-text-secondary font-inter">
               <p>No comments yet. Be the first!</p>
            </div>
          ) : (
             <div className="space-y-4 mt-2">
               {comments.map((comment) => (
                 <div key={comment.id} className="flex gap-3">
                   <Avatar 
                     size={32} 
                     username={comment.author?.username} 
                     displayName={comment.author?.displayName} 
                     avatarUrl={comment.author?.avatarUrl} 
                   />
                   <div className="flex-1 min-w-0 font-inter">
                      <div className="flex items-baseline gap-2 mb-0.5">
                         <span className="font-semibold text-toktik-text-secondary text-xs truncate max-w-[120px]">
                           {comment.author?.username || 'Unknown'}
                         </span>
                      </div>
                      <p className="text-sm text-toktik-text-primary leading-tight break-words">
                         {comment.text}
                      </p>
                      <div className="text-xs text-toktik-text-tertiary mt-1">
                         {formatTimeAgo(comment.createdAt)}
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>

        {/* Input Area */}
        <form 
          onSubmit={handleSubmit}
          className="bg-white border-t border-toktik-border p-3 flex items-center gap-3 w-full shrink-0 z-10"
        >
          <Avatar 
             size={36} 
             username={activeUser?.username} 
             displayName={activeUser?.displayName} 
             avatarUrl={activeUser?.avatarUrl} 
          />
          <div className="flex-1 bg-toktik-surface-raised rounded-full flex items-center pr-1 border border-transparent focus-within:border-toktik-accent transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Add comment..."
              className="flex-1 bg-transparent border-none outline-none py-2.5 px-4 text-sm font-inter text-toktik-text-primary placeholder:text-toktik-text-secondary"
            />
            <button 
              type="submit" 
              disabled={!newText.trim()}
              className="p-1.5 rounded-full text-toktik-accent disabled:text-toktik-text-tertiary disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default CommentSheet
