import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Grid3x3, Lock } from 'lucide-react'
import { useProfile } from '../hooks/useProfile.js'
import { useAppContext } from '../context/AppContext.jsx'
import { useDB } from '../context/DBContext.jsx'
import Avatar from '../components/shared/Avatar.jsx'
import VerifiedBadge from '../components/shared/VerifiedBadge.jsx'
import SkeletonGrid from '../components/shared/SkeletonGrid.jsx'

/**
 * ProfilePage
 * Renders user details, follow stats, and a generic 3-column video thumbnail grid.
 * Handles both "self" view (Edit Profile) and "other" view (Follow).
 */
export function ProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { activeUser } = useAppContext()
  const { videos: videosAPI } = useDB()
  
  // If id is 'me', resolve to activeUser.id, else use URL param
  const profileId = id === 'me' ? activeUser?.id : id
  
  const { profile, isLoading: isProfileLoading, isFollowing, isOwnProfile, toggleFollow } = useProfile(profileId)
  
  const [userVideos, setUserVideos] = useState([])
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  useEffect(() => {
    let active = true
    const fetchVideos = async () => {
      if (!profileId) return
      setIsVideoLoading(true)
      try {
        const vids = await videosAPI.getByProfileId(profileId)
        if (active) setUserVideos(vids)
      } catch (e) {
        console.error("Error fetching profile videos:", e)
      } finally {
        if (active) setIsVideoLoading(false)
      }
    }
    fetchVideos()
    return () => { active = false }
  }, [profileId, videosAPI])

  if (isProfileLoading) {
    return (
      <div className="min-h-screen-dvh bg-toktik-bg pt-12">
        <div className="flex flex-col items-center mt-8">
          <div className="w-24 h-24 skeleton rounded-full mb-4" />
          <div className="w-32 h-5 skeleton mb-2" />
          <div className="w-24 h-4 skeleton mb-6" />
          <div className="flex gap-8 mb-6">
            <div className="w-12 h-10 skeleton" />
            <div className="w-12 h-10 skeleton" />
            <div className="w-12 h-10 skeleton" />
          </div>
          <div className="w-40 h-10 skeleton rounded" />
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen-dvh flex flex-col items-center justify-center bg-toktik-bg pb-20">
         <h2 className="text-xl font-semibold mb-2">User not found</h2>
         <button onClick={() => navigate('/')} className="px-6 py-2 bg-toktik-accent text-white font-semibold rounded mx-auto">Go Home</button>
      </div>
    )
  }

  const formatStat = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 10000) return (num / 1000).toFixed(1) + 'K'
    return num?.toLocaleString() || '0'
  }

  return (
    <div className="bg-toktik-bg min-h-screen-dvh pb-safe-offset shadow-sm relative pt-12">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-toktik-surface/80 backdrop-blur z-30 border-b border-toktik-border flex items-center justify-center px-4">
         <button 
           onClick={() => navigate(-1)} 
           className="absolute left-2 p-2 rounded-full active:bg-gray-100 transition-colors"
         >
           <ChevronLeft size={24} className="text-toktik-text-primary" />
         </button>
         <h1 className="font-semibold text-toktik-text-primary font-inter truncate max-w-[200px]">
           {profile.displayName}
         </h1>
      </div>

      {/* Profile Info Section */}
      <div className="flex flex-col items-center pt-6 px-4 pb-4 bg-toktik-surface">
        <Avatar 
          size={96} 
          username={profile.username} 
          displayName={profile.displayName} 
          avatarUrl={profile.avatarUrl} 
          className="mb-4"
        />
        <h2 className="text-[17px] font-semibold text-toktik-text-primary mb-1">
          {profile.username}
          {profile.isVerified && <VerifiedBadge size={16} />}
        </h2>
        
        {/* Stats Row */}
        <div className="flex items-center gap-6 mt-4 mb-5 text-center">
          <div className="flex flex-col items-center">
            <span className="font-bold text-toktik-text-primary text-[17px]">{formatStat(profile.followingCount)}</span>
            <span className="text-[13px] text-toktik-text-secondary mt-0.5">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-toktik-text-primary text-[17px]">{formatStat(profile.followerCount)}</span>
            <span className="text-[13px] text-toktik-text-secondary mt-0.5">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-bold text-toktik-text-primary text-[17px]">{formatStat(profile.videoCount)}</span>
            <span className="text-[13px] text-toktik-text-secondary mt-0.5">Videos</span>
          </div>
        </div>

        {/* Action Button */}
        {isOwnProfile ? (
          <button className="px-10 py-2.5 min-w-[160px] rounded border border-toktik-border bg-toktik-bg text-toktik-text-primary font-semibold text-[15px] active:bg-gray-100 transition-colors">
            Edit profile
          </button>
        ) : (
          <button 
            onClick={toggleFollow}
            className={`px-10 py-2.5 min-w-[160px] rounded font-semibold text-[15px] transition-colors ${
              isFollowing 
                ? 'border border-toktik-border bg-toktik-bg text-toktik-text-primary active:bg-gray-100' 
                : 'bg-toktik-accent text-white min-w-[160px]'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="mt-5 text-[14px] text-toktik-text-primary text-center px-4 max-w-sm whitespace-pre-wrap leading-snug">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Content Tabs */}
      <div className="sticky top-12 z-20 flex bg-toktik-surface border-b border-toktik-border">
         <div className="flex-1 flex justify-center items-center h-11 border-b-2 border-toktik-text-primary">
            <Grid3x3 size={20} className="text-toktik-text-primary" />
         </div>
         <div className="flex-1 flex justify-center items-center h-11 border-b-2 border-transparent text-toktik-text-tertiary">
            <Lock size={20} />
         </div>
      </div>

      {/* Video Grid */}
      <div className="bg-toktik-surface min-h-[50vh]">
         {isVideoLoading ? (
            <SkeletonGrid count={6} />
         ) : userVideos.length > 0 ? (
            <div className="grid grid-cols-3 gap-0.5">
               {userVideos.map(video => (
                 <div key={video.id} className="aspect-square bg-gray-200 relative truncate group overflow-hidden bg-black/5" onClick={() => navigate('/')}>
                    {/* Native fallback video thumbnail rendering just using the first frame natively if possible via preload block */}
                    <video 
                      src={video.url} 
                      className="w-full h-full object-cover group-active:opacity-80 transition-opacity" 
                      preload="metadata"
                      muted
                      playsInline
                    />
                    <div className="absolute bottom-1 left-1 flex items-center gap-1 text-white z-10 font-semibold text-xs text-shadow">
                       <Grid3x3 size={11} strokeWidth={3} />
                       {formatStat(video.likes)}
                    </div>
                 </div>
               ))}
            </div>
         ) : (
            <div className="py-20 text-center text-toktik-text-secondary">
               <p className="font-semibold text-toktik-text-primary mb-1">No videos yet</p>
               <p className="text-sm">This user hasn't posted anything.</p>
            </div>
         )}
      </div>
    </div>
  )
}

export default ProfilePage
