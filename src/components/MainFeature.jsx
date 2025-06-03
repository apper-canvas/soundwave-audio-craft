import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import * as playlistService from '../services/api/playlistService'
import * as trackService from '../services/api/trackService'

const MainFeature = () => {
  const [playlists, setPlaylists] = useState([])
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('playlists')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    isPublic: true
  })

  // Load initial data
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
        setError(err.message)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Create new playlist
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
      setError(err.message)
      toast.error('Failed to create playlist')
    } finally {
      setLoading(false)
    }
  }

  // Add track to playlist
  const handleAddToPlaylist = async (track, playlist) => {
    try {
      const updatedTracks = [...(playlist.tracks || []), track.id]
      const updatedPlaylist = await playlistService.update(playlist.id, {
        tracks: updatedTracks
      })
      
      setPlaylists(prev => prev.map(p => 
        p.id === playlist.id ? updatedPlaylist : p
      ))
      toast.success(`Added "${track.title}" to "${playlist.name}"`)
    } catch (err) {
      toast.error('Failed to add track to playlist')
    }
  }

  // Delete playlist
  const handleDeletePlaylist = async (playlistId) => {
    try {
      await playlistService.delete(playlistId)
      setPlaylists(prev => prev.filter(p => p.id !== playlistId))
      toast.success('Playlist deleted successfully')
    } catch (err) {
      toast.error('Failed to delete playlist')
    }
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-400">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Your Music Library</h2>
          <p className="text-surface-300">Manage your playlists and discover new tracks</p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-surface-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('playlists')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'playlists'
                ? 'bg-primary text-white shadow-lg'
                : 'text-surface-300 hover:text-white'
            }`}
          >
            My Playlists
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'tracks'
                ? 'bg-primary text-white shadow-lg'
                : 'text-surface-300 hover:text-white'
            }`}
          >
            All Tracks
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'playlists' && (
          <motion.div
            key="playlists"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Create Playlist Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Your Playlists ({playlists?.length || 0})</h3>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl font-medium hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105"
              >
                <ApperIcon name="Plus" className="w-5 h-5" />
                Create Playlist
              </button>
            </div>

            {/* Create Playlist Form */}
            <AnimatePresence>
              {showCreateForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
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

            {/* Playlists Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {playlists?.length > 0 ? playlists.map((playlist) => (
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
                          onClick={() => setSelectedPlaylist(playlist)}
                          className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <ApperIcon name="Play" className="w-5 h-5 text-white ml-0.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePlaylist(playlist.id)}
                          className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        >
                          <ApperIcon name="Trash2" className="w-5 h-5 text-white" />
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
              )) : (
                <div className="col-span-full text-center py-12">
                  <ApperIcon name="Music" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                  <p className="text-surface-400 text-lg">No playlists yet</p>
                  <p className="text-surface-500 text-sm">Create your first playlist to get started</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'tracks' && (
          <motion.div
            key="tracks"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold">Browse Tracks ({tracks?.length || 0})</h3>
            
            <div className="space-y-2">
              {tracks?.length > 0 ? tracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-4 p-4 bg-surface-800 hover:bg-surface-700 rounded-xl transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-surface-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={track.coverArt || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop`}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{track.title}</h4>
                    <p className="text-surface-300 text-sm truncate">{track.artist}</p>
                  </div>

                  <div className="hidden sm:block text-surface-400 text-sm">
                    {Math.floor(track.duration / 60)}:{String(track.duration % 60).padStart(2, '0')}
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <ApperIcon name="Play" className="w-4 h-4 text-white ml-0.5" />
                    </button>
                    
                    {playlists?.length > 0 && (
                      <div className="relative group/menu">
                        <button className="w-8 h-8 bg-surface-600 hover:bg-surface-500 rounded-full flex items-center justify-center transition-colors">
                          <ApperIcon name="Plus" className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 bottom-full mb-2 bg-surface-700 rounded-lg shadow-lg py-2 min-w-48 opacity-0 group-hover/menu:opacity-100 transition-opacity pointer-events-none group-hover/menu:pointer-events-auto">
                          {playlists.slice(0, 5).map((playlist) => (
                            <button
                              key={playlist.id}
                              onClick={() => handleAddToPlaylist(track, playlist)}
                              className="w-full text-left px-4 py-2 hover:bg-surface-600 transition-colors text-sm"
                            >
                              Add to "{playlist.name}"
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-12">
                  <ApperIcon name="Music" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                  <p className="text-surface-400 text-lg">No tracks available</p>
                  <p className="text-surface-500 text-sm">Check back later for new music</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature