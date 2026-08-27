import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrovision_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const req = error.config || {}
    const res = error.response
    if (res) {
      const body =
        typeof res.data === 'string'
          ? res.data.slice(0, 200)
          : JSON.stringify(res.data)
      console.error(
        `[api] ${req.method?.toUpperCase() || '?'} ${req.baseURL || ''}${req.url || ''} -> ${res.status} ${res.statusText || ''}`,
        body
      )
    } else if (error.request) {
      console.error(
        `[api] ${req.method?.toUpperCase() || '?'} ${req.baseURL || ''}${req.url || ''} -> no response from server (backend down?)`,
        error.message
      )
    } else {
      console.error('[api] request setup error', error.message)
    }

    if (res?.status === 401) {
      localStorage.removeItem('agrovision_token')
      localStorage.removeItem('agrovision_user')
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
