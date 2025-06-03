import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900">
      <div className="text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-6">
            <ApperIcon name="Music" className="w-16 h-16 text-white" />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-surface-200 mb-4">
            Track Not Found
          </h2>
          <p className="text-surface-400 text-lg mb-8 max-w-md mx-auto">
            The audio you are looking for seems to have stopped playing. Let's get you back to the music.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-xl font-semibold hover:shadow-glow-primary transition-all duration-300 transform hover:scale-105"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            Back to SoundWave
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound