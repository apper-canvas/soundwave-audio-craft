import userData from '../mockData/user.json'

// Utility function to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for development
let users = [...userData]

export const getAll = async () => {
  await delay(300)
  return [...users]
}

export const getById = async (id) => {
  await delay(200)
  const user = users.find(u => u.id === id)
  if (!user) {
    throw new Error('User not found')
  }
  return { ...user }
}

export const create = async (userData) => {
  await delay(500)
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    followers: 0,
    following: [],
    createdAt: new Date().toISOString()
  }
  users.unshift(newUser)
  return { ...newUser }
}

export const update = async (id, updateData) => {
  await delay(350)
  const index = users.findIndex(u => u.id === id)
  if (index === -1) {
    throw new Error('User not found')
  }
  
  users[index] = {
    ...users[index],
    ...updateData,
    updatedAt: new Date().toISOString()
  }
  
  return { ...users[index] }
}

export const delete_ = async (id) => {
  await delay(300)
  const index = users.findIndex(u => u.id === id)
  if (index === -1) {
    throw new Error('User not found')
  }
  
  users.splice(index, 1)
  return { success: true }
}

// Note: Using delete_ instead of delete to avoid JavaScript reserved keyword
export { delete_ as delete }