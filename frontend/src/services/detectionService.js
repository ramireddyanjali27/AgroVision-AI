import api from './api'

export const detectionService = {
  async analyze(file) {
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/api/detection/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },
  async getHistory() {
    const res = await api.get('/api/detection/history')
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/api/detection/${id}`)
    return res.data
  },
  async delete(id) {
    const res = await api.delete(`/api/detection/${id}`)
    return res.data
  },
}
