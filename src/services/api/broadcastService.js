import broadcastData from '../mockData/broadcast.json'

// Utility function to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for development
let broadcasts = [...broadcastData]

export const getAll = async () => {
  await delay(280)
  return [...broadcasts]
}

export const getById = async (id) => {
  await delay(200)
  const broadcast = broadcasts.find(b => b.id === id)
  if (!broadcast) {
    throw new Error('Broadcast not found')
  }
  return { ...broadcast }
}

export const create = async (broadcastData) => {
  await delay(450)
  const newBroadcast = {
    id: Date.now().toString(),
    ...broadcastData,
    listeners: 0,
    startTime: new Date().toISOString(),
    isLive: true
  }
  broadcasts.unshift(newBroadcast)
  return { ...newBroadcast }
}

export const update = async (id, updateData) => {
  await delay(320)
  const index = broadcasts.findIndex(b => b.id === id)
  if (index === -1) {
    throw new Error('Broadcast not found')
  }
  
  broadcasts[index] = {
    ...broadcasts[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  }
  
  return { ...broadcasts[index] }
}

export const delete_ = async (id) => {
  await delay(270)
  const index = broadcasts.findIndex(b => b.id === id)
  if (index === -1) {
    throw new Error('Broadcast not found')
  }
  
  broadcasts.splice(index, 1)
  return { success: true }
}

// Note: Using delete_ instead of delete to avoid JavaScript reserved keyword
export { delete_ as delete }