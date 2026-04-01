import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Search, Bookmark, User } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'Home', id: 'nav-home' },
  { path: '/search', icon: Search, label: 'Search', id: 'nav-search' },
  { path: '/saved', icon: Bookmark, label: 'Saved', id: 'nav-saved' },
  { path: '/profile/me', icon: User, label: 'Profile', id: 'nav-profile' },
]

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  // On the feed page, use translucent glass style
  const isFeedPage = location.pathname === '/'

  return (
    <nav
      className={`
        fixed bottom-0 left-0 right-0 z-50
        ${isFeedPage ? 'glass-nav' : 'bg-toktik-surface'}
        border-t border-toktik-border
        pb-safe
      `}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {navItems.map(({ path, icon: Icon, label, id }) => {
          const active = isActive(path)
          return (
            <button
              key={path}
              id={id}
              onClick={() => navigate(path)}
              className={`
                flex flex-col items-center justify-center
                w-16 h-14
                transition-colors duration-200
                ${active
                  ? 'text-toktik-text-primary'
                  : 'text-toktik-text-tertiary hover:text-toktik-text-secondary'
                }
              `}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
            >
              <Icon
                size={24}
                strokeWidth={active ? 2.2 : 1.8}
                className="transition-all duration-200"
              />
              <span
                className={`
                  text-[10px] mt-0.5 font-inter
                  ${active ? 'font-medium' : 'font-normal'}
                `}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
