import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import * as trackService from '../services/api/trackService'
import * as broadcastService from '../services/api/broadcastService'

const Browse = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [tracks, setTracks] = useState([])
  const [broadcasts, setBroadcasts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
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

  const genres = ['all', 'electronic', 'jazz', 'rock', 'pop', 'classical', 'hip-hop']

  const handleNavClick = (path) => {
    navigate(path)
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [trackResult, broadcastResult] = await Promise.all([
          trackService.getAll(),
          broadcastService.getAll()
        ])
        setTracks(trackResult || [])
        setBroadcasts(broadcastResult || [])
      } catch (err) {
        toast.error('Failed to load browse content')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || track.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

  const handlePlayTrack = (track) => {
    toast.success(`Now playing: ${track.title} by ${track.artist}`)
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
            <h2 className="text-2xl md:text-3xl font-bold">Browse Music</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tracks, artists..."
                  className="w-64 pl-10 pr-4 py-2 bg-surface-700 border border-surface-600 rounded-xl text-white placeholder-surface-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Genre Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Browse by Genre</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    selectedGenre === genre
                      ? 'bg-primary text-white'
                      : 'bg-surface-700 text-surface-300 hover:bg-surface-600 hover:text-white'
                  }`}
                >
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Tracks Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {searchQuery ? `Search Results (${filteredTracks.length})` : `All Tracks (${filteredTracks.length})`}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTracks.map((track) => (
                <motion.div
                  key={track.id}
                  className="group bg-surface-800 rounded-2xl overflow-hidden hover:shadow-card transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -4 }}
                  onClick={() => handlePlayTrack(track)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={track.coverArt || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button className="w-16 h-16 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <ApperIcon name="Play" className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-1 truncate">{track.title}</h4>
                    <p className="text-surface-300 text-sm mb-2 truncate">{track.artist}</p>
                    <div className="flex items-center justify-between text-xs text-surface-400">
                      <span className="capitalize">{track.genre}</span>
                      <span>{Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredTracks.length === 0 && !loading && (
              <div className="text-center py-12">
                <ApperIcon name="Search" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-400 text-lg">No tracks found</p>
                <p className="text-surface-500 text-sm">Try adjusting your search or genre filter</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Browse