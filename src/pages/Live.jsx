import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import * as broadcastService from '../services/api/broadcastService'
import * as userService from '../services/api/userService'

const Live = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)
  const [liveBroadcasts, setLiveBroadcasts] = useState([])
  const [scheduledBroadcasts, setScheduledBroadcasts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isGoingLive, setIsGoingLive] = useState(false)
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
        const broadcasts = await broadcastService.getAll()
        const live = broadcasts.filter(b => b.status === 'live')
        const scheduled = broadcasts.filter(b => b.status === 'scheduled')
        setLiveBroadcasts(live || [])
        setScheduledBroadcasts(scheduled || [])
      } catch (err) {
        toast.error('Failed to load live broadcasts')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleJoinBroadcast = (broadcast) => {
    toast.success(`Joined "${broadcast.title}" - ${broadcast.listeners} listeners`)
  }

  const handleGoLive = async () => {
    setIsGoingLive(true)
    try {
      const newBroadcast = {
        title: 'My Live Stream',
        description: 'Live streaming now!',
        status: 'live',
        category: 'music',
        listeners: 1,
        startedAt: new Date().toISOString(),
        broadcasterId: 'current-user'
      }
      
      const created = await broadcastService.create(newBroadcast)
      setLiveBroadcasts(prev => [created, ...prev])
      toast.success('You are now live!')
    } catch (err) {
      toast.error('Failed to start broadcast')
    } finally {
      setIsGoingLive(false)
    }
  }

  const handleScheduleBroadcast = () => {
    toast.info('Broadcast scheduling coming soon!')
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
              <h2 className="text-2xl md:text-3xl font-bold">Live Broadcasts</h2>
              <p className="text-surface-300 mt-1">Join live streams or start your own broadcast</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleScheduleBroadcast}
                className="flex items-center gap-2 bg-surface-700 hover:bg-surface-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
              >
                <ApperIcon name="Calendar" className="w-5 h-5" />
                Schedule
              </button>
              <button
                onClick={handleGoLive}
                disabled={isGoingLive}
                className="flex items-center gap-2 bg-gradient-to-r from-secondary to-primary text-white px-4 py-2 rounded-xl font-medium hover:shadow-glow-secondary transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                <ApperIcon name="Radio" className="w-5 h-5" />
                {isGoingLive ? 'Starting...' : 'Go Live'}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}

          {/* Live Now Section */}
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-secondary rounded-full pulse-glow"></div>
              <h3 className="text-xl font-semibold">Live Now ({liveBroadcasts.length})</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveBroadcasts.map((broadcast) => (
                <motion.div
                  key={broadcast.id}
                  className="group bg-surface-800 rounded-2xl overflow-hidden hover:shadow-card transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -4 }}
                  onClick={() => handleJoinBroadcast(broadcast)}
                >
                  <div className="relative aspect-video">
                    <img
                      src={broadcast.thumbnail || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop`}
                      alt={broadcast.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Live Badge */}
                    <div className="absolute top-4 left-4 bg-secondary rounded-full px-3 py-1 text-sm font-semibold pulse-glow">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        LIVE
                      </span>
                    </div>

                    {/* Viewer Count */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-full px-3 py-1 text-sm">
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Users" className="w-3 h-3" />
                        {broadcast.listeners}
                      </span>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <ApperIcon name="Play" className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>

                    {/* Content Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-lg font-semibold mb-1">{broadcast.title}</h4>
                      <p className="text-surface-300 text-sm mb-2">{broadcast.broadcaster}</p>
                      <div className="flex items-center gap-2 text-surface-300 text-sm">
                        <span className="bg-surface-700/50 px-2 py-1 rounded-full text-xs capitalize">
                          {broadcast.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {liveBroadcasts.length === 0 && !loading && (
              <div className="text-center py-12 bg-surface-800 rounded-2xl">
                <ApperIcon name="Radio" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-400 text-lg">No live broadcasts</p>
                <p className="text-surface-500 text-sm">Be the first to go live!</p>
              </div>
            )}
          </section>

          {/* Upcoming/Scheduled Section */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <ApperIcon name="Calendar" className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Scheduled Broadcasts ({scheduledBroadcasts.length})</h3>
            </div>
            
            <div className="space-y-4">
              {scheduledBroadcasts.map((broadcast) => (
                <motion.div
                  key={broadcast.id}
                  className="flex items-center gap-4 p-4 bg-surface-800 rounded-xl hover:bg-surface-700 transition-colors"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-16 h-16 bg-surface-700 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={broadcast.thumbnail || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop`}
                      alt={broadcast.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{broadcast.title}</h4>
                    <p className="text-surface-300 text-sm mb-2">{broadcast.broadcaster}</p>
                    <div className="flex items-center gap-4 text-xs text-surface-400">
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Calendar" className="w-3 h-3" />
                        {new Date(broadcast.scheduledAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Clock" className="w-3 h-3" />
                        {new Date(broadcast.scheduledAt).toLocaleTimeString()}
                      </span>
                      <span className="bg-surface-600 px-2 py-1 rounded-full capitalize">
                        {broadcast.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 bg-primary/20 hover:bg-primary/30 rounded-lg flex items-center justify-center transition-colors">
                      <ApperIcon name="Bell" className="w-5 h-5 text-primary" />
                    </button>
                    <button className="w-10 h-10 bg-surface-600 hover:bg-surface-500 rounded-lg flex items-center justify-center transition-colors">
                      <ApperIcon name="MoreHorizontal" className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {scheduledBroadcasts.length === 0 && !loading && (
              <div className="text-center py-12 bg-surface-800 rounded-2xl">
                <ApperIcon name="Calendar" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <p className="text-surface-400 text-lg">No scheduled broadcasts</p>
                <p className="text-surface-500 text-sm">Schedule your next broadcast to build anticipation</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}

export default Live