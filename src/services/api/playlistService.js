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

// Note: Using delete_ instead of delete to avoid JavaScript reserved keyword
export { delete_ as delete }