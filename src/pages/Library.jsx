import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import * as trackService from '../services/api/trackService'
import * as playlistService from '../services/api/playlistService'

const Library = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [tracks, setTracks] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState('recent')
  const navigate = useNavigate()
  const location = useLocation()

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed)
  }

  const navItems = [
    { name: 'Home', icon: 'Home', path: '/' },
    { name: 'Browse', icon: 'Compass', path: '/browse' },
    { name: 'Library', icon: 'Library', path: '/library' },
    { name: 'Live', icon: 'Radio', path: '/live' },
    { name: 'Playlists', icon: 'ListMusic', path: '/playlists' }
  ]

  const libraryViews = [
    { id: 'recent', name: 'Recently Played', icon: 'Clock' },
    { id: 'liked', name: 'Liked Songs', icon: 'Heart' },
    { id: 'downloaded', name: 'Downloaded', icon: 'Download' },
    { id: 'artists', name: 'Artists', icon: 'Mic' }
  ]

  const handleNavClick = (path) => {
    navigate(path)
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [trackResult, playlistResult] = await Promise.all([
          trackService.getAll(),
          playlistService.getAll()
        ])
        setTracks(trackResult || [])
        setPlaylists(playlistResult || [])
      } catch (err) {
        toast.error('Failed to load library content')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handlePlayTrack = (track) => {
    toast.success(`Now playing: ${track.title} by ${track.artist}`)
  }

  const recentTracks = tracks.slice(0, 8)
  const likedTracks = tracks.filter(track => track.liked).slice(0, 8)
  const downloadedTracks = tracks.filter(track => track.downloaded).slice(0, 8)
  const artists = [...new Set(tracks.map(track => track.artist))].slice(0, 8)

  const getViewData = () => {
    switch (activeView) {
      case 'recent':
        return recentTracks
      case 'liked':
        return likedTracks
      case 'downloaded':
        return downloadedTracks
      case 'artists':
        return artists.map(artist => ({
          id: artist,
          name: artist,
          type: 'artist',
          image: `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`,
          trackCount: tracks.filter(t => t.artist === artist).length
        }))
      default:
        return []
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <motion.aside 
        className={`${isNavCollapsed ? 'w-20' : 'w-72'} bg-surface-800 border-r border-surface-700 flex flex-col transition-all duration-300 ease-in-out`}
        initial={false}
        animate={{ width: isNavCollapsed ? 80 : 288 }}
      >
        {/* Logo */}
        <div className="p-6 border-b border-surface-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Waves" className="w-6 h-6 text-white wave-animation" />
              </div>
            </div>
            {!isNavCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  SoundWave
                </h1>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <button 
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30' 
                      : 'text-surface-300 hover:text-white hover:bg-surface-700'
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5 flex-shrink-0" />
                  {!isNavCollapsed && (
                    <span className="font-medium">{item.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Toggle Button */}
        <div className="p-4 border-t border-surface-700">
          <button
            onClick={toggleNav}
            className="w-full flex items-center justify-center p-3 rounded-xl bg-surface-700 hover:bg-surface-600 transition-colors"
          >
            <ApperIcon 
              name={isNavCollapsed ? "ChevronRight" : "ChevronLeft"} 
              className="w-5 h-5" 
            />
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-surface-800/50 backdrop-blur-xl border-b border-surface-700 p-4 md:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold">Your Library</h2>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-medium transition-colors">
                <ApperIcon name="Plus" className="w-5 h-5" />
                Add Music
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Library Navigation */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {libraryViews.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setActiveView(view.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    activeView === view.id
                      ? 'bg-primary text-white'
                      : 'bg-surface-700 text-surface-300 hover:bg-surface-600 hover:text-white'
                  }`}
                >
                  <ApperIcon name={view.icon} className="w-4 h-4" />
                  {view.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Music" className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tracks.length}</p>
                  <p className="text-surface-400 text-sm">Total Tracks</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="ListMusic" className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{playlists.length}</p>
                  <p className="text-surface-400 text-sm">Playlists</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Heart" className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{likedTracks.length}</p>
                  <p className="text-surface-400 text-sm">Liked Songs</p>
                </div>
              </div>
            </div>
            <div className="bg-surface-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Mic" className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{artists.length}</p>
                  <p className="text-surface-400 text-sm">Artists</p>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Content Grid */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              {libraryViews.find(v => v.id === activeView)?.name}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {getViewData().map((item) => (
                <motion.div
                  key={item.id}
                  className="group bg-surface-800 rounded-2xl overflow-hidden hover:shadow-card transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -4 }}
                  onClick={() => item.type === 'artist' ? toast.info(`Viewing ${item.name}'s tracks`) : handlePlayTrack(item)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={item.coverArt || item.image || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <ApperIcon name="Play" className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1 truncate">{item.title || item.name}</h4>
                    <p className="text-surface-300 text-sm mb-2 truncate">
                      {item.artist || (item.type === 'artist' ? `${item.trackCount} tracks` : 'Unknown Artist')}
                    </p>
                    {item.duration && (
                      <div className="flex items-center justify-between text-xs text-surface-400">
                        <span className="capitalize">{item.genre}</span>
                        <span>{Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {getViewData().length === 0 && !loading && (
              <div className="text-center py-12">
                <ApperIcon name="Music" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-400 text-lg">No content in this section</p>
                <p className="text-surface-500 text-sm">Start building your library by adding music</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Library