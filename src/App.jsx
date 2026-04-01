import { Routes, Route } from 'react-router-dom'
import FeedPage from './pages/FeedPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import BottomNav from './components/shared/BottomNav.jsx'

// Import Context Providers
import { DBProvider } from './context/DBContext.jsx'
import { AppProvider } from './context/AppContext.jsx'
import { FeedProvider } from './context/FeedContext.jsx'

function App() {
  return (
    <DBProvider>
      <AppProvider>
        <FeedProvider>
          <div className="relative flex flex-col min-h-screen bg-toktik-bg font-inter">
            {/* Main content area */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<FeedPage />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/saved" element={<SavedPage />} />
              </Routes>
            </main>

            {/* Persistent bottom navigation */}
            <BottomNav />
          </div>
        </FeedProvider>
      </AppProvider>
    </DBProvider>
  )
}

export default App
