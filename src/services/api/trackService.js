import trackData from '../mockData/track.json'

// Utility function to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for development
let tracks = [...trackData]

export const getAll = async () => {
  await delay(250)
  return [...tracks]
}

export const getById = async (id) => {
  await delay(200)
  const track = tracks.find(t => t.id === id)
  if (!track) {
    throw new Error('Track not found')
  }
  return { ...track }
}

export const create = async (trackData) => {
  await delay(400)
  const newTrack = {
    id: Date.now().toString(),
    ...trackData,
    playCount: 0,
    createdAt: new Date().toISOString()
  }
  tracks.unshift(newTrack)
  return { ...newTrack }
}

export const update = async (id, updateData) => {
  await delay(300)
  const index = tracks.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('Track not found')
  }
  
  tracks[index] = {
    ...tracks[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  }
  
  return { ...tracks[index] }
}

export const delete_ = async (id) => {
  await delay(250)
  const index = tracks.findIndex(t => t.id === id)
  if (index === -1) {
    throw new Error('Track not found')
  }
  
  tracks.splice(index, 1)
  return { success: true }
}

// Note: Using delete_ instead of delete to avoid JavaScript reserved keyword
export { delete_ as delete }