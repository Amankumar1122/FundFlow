import axios from 'axios'

const defaultApiUrl = import.meta.env.PROD
  ? 'https://fundflow-0vuh.onrender.com/api'
  : 'http://localhost:8080/api'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultApiUrl,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Bearer token if present
apiClient.interceptors.request.use((config) => {
  try {
    const storedUser = localStorage.getItem('fundflow-auth-user') || localStorage.getItem('fundflow-demo-user-v1')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`
      }
    }
  } catch {
    // ignore json parse error
  }
  return config
})

// Format errors consistently
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data
    let message = data?.message || error.message || 'An unexpected error occurred'
    if (data?.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
      const firstField = Object.keys(data.fieldErrors)[0]
      message = data.fieldErrors[firstField] || message
    }
    const enhancedError = new Error(message)
    enhancedError.status = error.response?.status
    enhancedError.fieldErrors = data?.fieldErrors || {}
    enhancedError.response = error.response
    return Promise.reject(enhancedError)
  }
)

export const authApi = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }).then((res) => res.data),
  register: (data) => apiClient.post('/auth/register', data).then((res) => res.data),
}

export const campaignsApi = {
  getAll: () => apiClient.get('/campaigns').then((res) => res.data),
  getById: (id) => apiClient.get(`/campaigns/${id}`).then((res) => res.data),
  create: (data) => apiClient.post('/campaigns', data).then((res) => res.data),
  update: (id, data) => apiClient.put(`/campaigns/${id}`, data).then((res) => res.data),
  delete: (id) => apiClient.delete(`/campaigns/${id}`).then((res) => res.data),
  getMine: () => apiClient.get('/campaigns/mine').then((res) => res.data),
}

export const donationsApi = {
  create: (data) => apiClient.post('/donations', data).then((res) => res.data),
  getForUser: (userId) => apiClient.get(`/donations/user/${userId}`).then((res) => res.data),
  getForCampaign: (campaignId) => apiClient.get(`/donations/campaign/${campaignId}`).then((res) => res.data),
  cancel: (id) => apiClient.delete(`/donations/${id}`).then((res) => res.data),
}

export const usersApi = {
  getProfile: () => apiClient.get('/users/me').then((res) => res.data),
  updateProfile: (data) => apiClient.patch('/users/me', data).then((res) => res.data),
}

export const adminApi = {
  getSummary: () => apiClient.get('/admin/summary').then((res) => res.data),
  getCampaigns: () => apiClient.get('/admin/campaigns').then((res) => res.data),
  updateStatus: (id, status) => apiClient.patch(`/admin/campaigns/${id}/status`, { status }).then((res) => res.data),
  getUsers: () => apiClient.get('/admin/users').then((res) => res.data),
  setUserEnabled: (id, enabled) => apiClient.put(`/admin/users/${id}/enabled`, { enabled }).then((res) => res.data),
  getDonations: () => apiClient.get('/admin/donations').then((res) => res.data),
}
