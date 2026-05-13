import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({ baseURL: BASE_URL })

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('urbanwear_user') || 'null')
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`
  return config
})

// Auth
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)

// Products
export const getProducts = () => api.get('/products')
export const getProductById = (id) => api.get(`/products/${id}`)
export const createProduct = (data) => api.post('/products', data)

// Orders
export const createOrder = (data) => api.post('/orders', data)
export const getMyOrders = () => api.get('/orders/user')
export const getAllOrders = () => api.get('/orders')
export const getOrderById = (id) => api.get(`/orders/${id}`)

// Collections
export const getCollections = () => api.get('/collections')
export const createCollection = (data) => api.post('/collections', data)

// Profile
export const updateProfile = (data) => api.put('/users/profile', data)
export const updateWishlist = (data) => api.put('/users/wishlist', data)

export default api
