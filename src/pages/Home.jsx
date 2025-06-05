import { useState } from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'

const Home = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false)

  const toggleNav = () => {
    setIsNavCollapsed(!isNavCollapsed)
  }

const navItems = [
    { name: 'Home', icon: 'Home', path: '/', active: true },
    { name: 'Browse', icon: 'Compass', path: '/browse' },
    { name: 'Library', icon: 'Library', path: '/library' },
    { name: 'Live', icon: 'Radio', path: '/live' },
    { name: 'Playlists', icon: 'ListMusic', path: '/playlists' }
  ]

  const handleNavClick = (path) => {
    // Navigation logic can be implemented here
    console.log('Navigating to:', path)
  }

  const getCurrentPath = () => {
    // Simple path detection, can be replaced with React Router's useLocation
    return window.location.pathname
  }

  const featuredContent = [
    {
      id: 1,
      title: "Electronic Vibes Live",
      artist: "DJ Nexus",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
      isLive: true,
      listeners: 2840
    },
    {
      id: 2,
      title: "Midnight Jazz Session",
      artist: "Sarah Blues",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&h=600&fit=crop",
      isLive: true,
      listeners: 1520
    },
    {
      id: 3,
      title: "Chill Beats Collection",
      artist: "Various Artists",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=600&fit=crop",
      isLive: false
    }
  ]

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
                    getCurrentPath() === item.path
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
            <h2 className="text-2xl md:text-3xl font-bold">Discover</h2>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search tracks, artists, broadcasts..."
                  className="w-64 pl-10 pr-4 py-2 bg-surface-700 border border-surface-600 rounded-xl text-white placeholder-surface-400 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button className="w-10 h-10 bg-surface-700 hover:bg-surface-600 rounded-xl flex items-center justify-center transition-colors">
                <ApperIcon name="Bell" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          {/* Featured Content */}
          <section className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredContent.map((content) => (
                <motion.div
                  key={content.id}
                  className="group relative bg-surface-800 rounded-2xl overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative aspect-video">
                    <img 
                      src={content.image} 
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Live Badge */}
                    {content.isLive && (
                      <div className="absolute top-4 left-4 bg-secondary rounded-full px-3 py-1 text-sm font-semibold pulse-glow">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          LIVE
                        </span>
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                        <ApperIcon name="Play" className="w-8 h-8 text-white ml-1" />
                      </button>
                    </div>

                    {/* Content Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold mb-1">{content.title}</h3>
                      <p className="text-surface-300 text-sm mb-2">{content.artist}</p>
                      {content.isLive && (
                        <div className="flex items-center gap-1 text-surface-300 text-sm">
                          <ApperIcon name="Users" className="w-4 h-4" />
                          <span>{content.listeners.toLocaleString()} listening</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Main Feature Component */}
            <MainFeature />
          </section>
        </main>

        {/* Audio Player Bar */}
        <div className="glass-effect border-t border-surface-700 p-4">
          <div className="flex items-center gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-12 h-12 bg-surface-700 rounded-lg flex-shrink-0 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" 
                  alt="Current track"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">Electronic Vibes Live</p>
                <p className="text-surface-300 text-sm truncate">DJ Nexus</p>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center text-surface-300 hover:text-white transition-colors">
                <ApperIcon name="Shuffle" className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-surface-300 hover:text-white transition-colors">
                <ApperIcon name="SkipBack" className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center transition-colors">
                <ApperIcon name="Play" className="w-6 h-6 text-white ml-0.5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-surface-300 hover:text-white transition-colors">
                <ApperIcon name="SkipForward" className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center text-surface-300 hover:text-white transition-colors">
                <ApperIcon name="Repeat" className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center gap-2 min-w-0">
              <button className="text-surface-300 hover:text-white transition-colors">
                <ApperIcon name="Volume2" className="w-5 h-5" />
              </button>
              <div className="w-20 h-1 bg-surface-700 rounded-full overflow-hidden">
                <div className="w-3/5 h-full bg-primary rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home