import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import * as playlistService from '../services/api/playlistService'
import * as trackService from '../services/api/trackService'

const Playlists = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showTrackBrowser, setShowTrackBrowser] = useState(false)
  const [trackSearchQuery, setTrackSearchQuery] = useState('')
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    isPublic: true
  })
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

  const handleNavClick = (path) => {
    navigate(path)
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [playlistResult, trackResult] = await Promise.all([
          playlistService.getAll(),
          trackService.getAll()
        ])
        setPlaylists(playlistResult || [])
        setTracks(trackResult || [])
      } catch (err) {
        toast.error('Failed to load playlists')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    if (!newPlaylist.name.trim()) {
      toast.error('Playlist name is required')
      return
    }

    setLoading(true)
    try {
      const playlistData = {
        ...newPlaylist,
        userId: 'current-user',
        tracks: [],
        coverImage: `https://images.unsplash.com/photo-${Date.now() % 1000000000}?w=300&h=300&fit=crop`
      }
      
      const createdPlaylist = await playlistService.create(playlistData)
      setPlaylists(prev => [createdPlaylist, ...prev])
      setNewPlaylist({ name: '', description: '', isPublic: true })
      setShowCreateForm(false)
      toast.success('Playlist created successfully!')
    } catch (err) {
      toast.error('Failed to create playlist')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await playlistService.delete(playlistId)
      setPlaylists(prev => prev.filter(p => p.id !== playlistId))
      if (selectedPlaylist?.id === playlistId) {
        setSelectedPlaylist(null)
      }
      toast.success('Playlist deleted successfully')
    } catch (err) {
      toast.error('Failed to delete playlist')
    }
  }

const handlePlayPlaylist = (playlist) => {
    setSelectedPlaylist(playlist)
    setShowTrackBrowser(false)
    setTrackSearchQuery('')
  }

  const filteredPlaylists = playlists.filter(playlist => 
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getPlaylistTracks = (playlist) => {
    if (!playlist.tracks) return []
    return playlist.tracks.map(trackId => 
      tracks.find(track => track.id === trackId)
    ).filter(Boolean)
}

  const handleAddTrackToPlaylist = async (track) => {
    if (!selectedPlaylist) return
    
    try {
      const playlistTracks = selectedPlaylist.tracks || []
      if (playlistTracks.includes(track.id)) {
        toast.info('Track is already in this playlist')
        return
      }

      const updatedTracks = [...playlistTracks, track.id]
      const updatedPlaylist = await playlistService.update(selectedPlaylist.id, {
        tracks: updatedTracks
      })

      setSelectedPlaylist(updatedPlaylist)
      setPlaylists(prev => prev.map(p => 
        p.id === selectedPlaylist.id ? updatedPlaylist : p
      ))
      
      toast.success(`Added "${track.title}" to playlist`)
    } catch (err) {
      toast.error('Failed to add track to playlist')
    }
  }

  const handleRemoveTrackFromPlaylist = async (trackId) => {
    if (!selectedPlaylist) return
    
    try {
      const updatedTracks = (selectedPlaylist.tracks || []).filter(id => id !== trackId)
      const updatedPlaylist = await playlistService.update(selectedPlaylist.id, {
        tracks: updatedTracks
      })

      setSelectedPlaylist(updatedPlaylist)
      setPlaylists(prev => prev.map(p => 
        p.id === selectedPlaylist.id ? updatedPlaylist : p
      ))
      
      toast.success('Track removed from playlist')
    } catch (err) {
      toast.error('Failed to remove track from playlist')
    }
  }

  const getFilteredTracksForBrowser = () => {
    return tracks.filter(track => 
      track.title.toLowerCase().includes(trackSearchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(trackSearchQuery.toLowerCase())
    )
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
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Your Playlists</h2>
              <p className="text-surface-300 mt-1">Create and manage your music collections</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search playlists..."
                  className="w-64 pl-10 pr-4 py-2 bg-surface-700 border border-surface-600 rounded-xl text-white placeholder-surface-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                Create Playlist
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {/* Create Playlist Form */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="glass-effect rounded-2xl p-6"
              >
                <form onSubmit={handleCreatePlaylist} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Playlist Name</label>
                    <input
                      type="text"
                      value={newPlaylist.name}
                      onChange={(e) => setNewPlaylist(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-xl text-white placeholder-surface-400 focus:outline-none focus:border-primary transition-colors"
                      placeholder="Enter playlist name..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                    <textarea
                      value={newPlaylist.description}
                      onChange={(e) => setNewPlaylist(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 bg-surface-700 border border-surface-600 rounded-xl text-white placeholder-surface-400 focus:outline-none focus:border-primary transition-colors resize-none"
                      rows={3}
                      placeholder="Describe your playlist..."
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={newPlaylist.isPublic}
                      onChange={(e) => setNewPlaylist(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="w-4 h-4 text-primary bg-surface-700 border-surface-600 rounded focus:ring-primary"
                    />
                    <label htmlFor="isPublic" className="text-sm">Make playlist public</label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                      Create Playlist
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-6 py-3 bg-surface-700 hover:bg-surface-600 text-white rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Playlists Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaylists.map((playlist) => (
              <motion.div
                key={playlist.id}
                className="group bg-surface-800 rounded-2xl overflow-hidden hover:shadow-card transition-all duration-300"
                whileHover={{ y: -4 }}
                layout
              >
                <div className="relative aspect-square">
                  <img
                    src={playlist.coverImage || `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop`}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePlayPlaylist(playlist)}
                        className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <ApperIcon name="Play" className="w-6 h-6 text-white ml-0.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePlaylist(playlist.id)}
                        className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <ApperIcon name="Trash2" className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-semibold mb-1 truncate">{playlist.name}</h4>
                  <p className="text-surface-300 text-sm mb-2 line-clamp-2">
                    {playlist.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between text-xs text-surface-400">
                    <span>{playlist.tracks?.length || 0} tracks</span>
                    <div className="flex items-center gap-1">
                      <ApperIcon name={playlist.isPublic ? "Globe" : "Lock"} className="w-3 h-3" />
                      <span>{playlist.isPublic ? "Public" : "Private"}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPlaylists.length === 0 && !loading && (
            <div className="text-center py-12">
              <ApperIcon name="ListMusic" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
              <p className="text-surface-400 text-lg">
                {searchQuery ? 'No playlists found' : 'No playlists yet'}
              </p>
              <p className="text-surface-500 text-sm">
                {searchQuery ? 'Try a different search term' : 'Create your first playlist to get started'}
              </p>
            </div>
          )}

          {/* Selected Playlist Details */}
          {selectedPlaylist && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 glass-effect rounded-2xl p-6"
            >
              <div className="flex items-start gap-6 mb-6">
                <img
                  src={selectedPlaylist.coverImage || `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop`}
                  alt={selectedPlaylist.name}
                  className="w-32 h-32 rounded-2xl object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{selectedPlaylist.name}</h3>
                  <p className="text-surface-300 mb-4">{selectedPlaylist.description}</p>
                  <div className="flex items-center gap-4 text-sm text-surface-400">
                    <span>{getPlaylistTracks(selectedPlaylist).length} tracks</span>
                    <span>{selectedPlaylist.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlaylist(null)}
                  className="w-10 h-10 bg-surface-700 hover:bg-surface-600 rounded-xl flex items-center justify-center transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

<div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">Tracks</h4>
                  <button
                    onClick={() => setShowTrackBrowser(!showTrackBrowser)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-medium transition-colors"
                  >
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    Add Tracks
                  </button>
                </div>

                {/* Track Browser */}
                <AnimatePresence>
                  {showTrackBrowser && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-surface-700/30 rounded-xl p-4 space-y-4"
                    >
                      <div className="flex items-center gap-4">
                        <h5 className="font-medium">Browse Tracks to Add</h5>
                        <div className="flex-1 relative">
                          <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                          <input
                            type="text"
                            value={trackSearchQuery}
                            onChange={(e) => setTrackSearchQuery(e.target.value)}
                            placeholder="Search tracks..."
                            className="w-full pl-10 pr-4 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white placeholder-surface-400 focus:outline-none focus:border-primary transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {getFilteredTracksForBrowser().map((track) => {
                          const isInPlaylist = selectedPlaylist.tracks?.includes(track.id)
                          return (
                            <div
                              key={track.id}
                              className="flex items-center gap-3 p-3 bg-surface-700/50 rounded-lg hover:bg-surface-700 transition-colors"
                            >
                              <img
                                src={track.coverArt || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop`}
                                alt={track.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{track.title}</p>
                                <p className="text-surface-300 text-sm truncate">{track.artist}</p>
                              </div>
                              <span className="text-surface-400 text-sm">
                                {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                              </span>
                              <button
                                onClick={() => handleAddTrackToPlaylist(track)}
                                disabled={isInPlaylist}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                  isInPlaylist 
                                    ? 'bg-surface-600 text-surface-400 cursor-not-allowed'
                                    : 'bg-primary hover:bg-primary-dark text-white'
                                }`}
                              >
                                {isInPlaylist ? 'Added' : 'Add'}
                              </button>
                            </div>
                          )
                        })}
                        
                        {getFilteredTracksForBrowser().length === 0 && (
                          <div className="text-center py-6">
                            <p className="text-surface-400">No tracks found</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Playlist Tracks */}
                <div className="space-y-2">
                  {getPlaylistTracks(selectedPlaylist).map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-3 bg-surface-700/50 rounded-xl hover:bg-surface-700 transition-colors group"
                    >
                      <span className="w-8 text-center text-surface-400 text-sm">{index + 1}</span>
                      <img
                        src={track.coverArt || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop`}
                        alt={track.title}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.title}</p>
                        <p className="text-surface-300 text-sm truncate">{track.artist}</p>
                      </div>
                      <span className="text-surface-400 text-sm">
                        {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toast.success(`Playing: ${track.title}`)}
                          className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <ApperIcon name="Play" className="w-4 h-4 text-white ml-0.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveTrackFromPlaylist(track.id)}
                          className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                        >
                          <ApperIcon name="X" className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {getPlaylistTracks(selectedPlaylist).length === 0 && (
                    <div className="text-center py-8">
                      <ApperIcon name="Music" className="w-12 h-12 text-surface-400 mx-auto mb-3" />
                      <p className="text-surface-400">This playlist is empty</p>
                      <p className="text-surface-500 text-sm">Click "Add Tracks" to add some music</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Playlists