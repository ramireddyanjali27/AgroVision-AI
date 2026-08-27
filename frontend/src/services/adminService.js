import api from './api'

export const adminService = {
  async getStatistics() {
    const res = await api.get('/api/admin/statistics')
    return res.data
  },
  async getUsers(search = '') {
    const res = await api.get('/api/admin/users', { params: search ? { search } : {} })
    return res.data
  },
  async deleteUser(id) {
    const res = await api.delete(`/api/admin/users/${id}`)
    return res.data
  },
  async getRecentDetections(limit = 10) {
    const res = await api.get('/api/admin/recent-detections', { params: { limit } })
    return res.data
  },
  async getDiseases() {
    const res = await api.get('/api/admin/diseases')
    return res.data
  },
  async createDisease(data) {
    const res = await api.post('/api/admin/diseases', data)
    return res.data
  },
  async updateDisease(id, data) {
    const res = await api.put(`/api/admin/diseases/${id}`, data)
    return res.data
  },
  async deleteDisease(id) {
    const res = await api.delete(`/api/admin/diseases/${id}`)
    return res.data
  },
}
