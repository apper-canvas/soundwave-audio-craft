import playlistData from '../mockData/playlist.json'

// Utility function to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for development
let playlists = [...playlistData]

export const getAll = async () => {
  await delay(300)
  return [...playlists]
}

export const getById = async (id) => {
  await delay(200)
  const playlist = playlists.find(p => p.id === id)
  if (!playlist) {
    throw new Error('Playlist not found')
  }
  return { ...playlist }
}

export const create = async (playlistData) => {
  await delay(400)
  const newPlaylist = {
    id: Date.now().toString(),
    ...playlistData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  playlists.unshift(newPlaylist)
  return { ...newPlaylist }
}

export const update = async (id, updateData) => {
  await delay(300)
  const index = playlists.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('Playlist not found')
  }
  
  playlists[index] = {
    ...playlists[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  }
  
  return { ...playlists[index] }
}

export const delete_ = async (id) => {
  await delay(250)
  const index = playlists.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('Playlist not found')
  }
  
playlists.splice(index, 1)
  return { success: true }
}
// Helper method for adding tracks to playlists with validation
export const addTrackToPlaylist = async (playlistId, trackId) => {
  await delay(250)
  
  const playlistIndex = playlists.findIndex(p => p.id === playlistId)
  if (playlistIndex === -1) {
    throw new Error('Playlist not found')
  }
  
  const playlist = playlists[playlistIndex]
  const currentTracks = playlist.tracks || []
  
  // Check if track is already in playlist
  if (currentTracks.includes(trackId)) {
    throw new Error('Track is already in this playlist')
  }
  
  // Add track to playlist
  const updatedTracks = [...currentTracks, trackId]
  playlists[playlistIndex] = {
    ...playlist,
    tracks: updatedTracks,
    updatedAt: new Date().toISOString()
  }
  
  return { ...playlists[playlistIndex] }
}

// Note: Using delete_ instead of delete to avoid JavaScript reserved keyword