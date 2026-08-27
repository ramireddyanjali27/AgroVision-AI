import { useEffect, useState } from 'react'
import { adminService } from '../services/adminService'
import StatCard from '../components/StatCard'
import HistoryCard from '../components/HistoryCard'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import './Admin.css'

const TABS = {
  overview: 'Overview',
  users: 'Users',
  diseases: 'Diseases',
}

const Admin = () => {
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [users, setUsers] = useState([])
  const [diseases, setDiseases] = useState([])
  const [search, setSearch] = useState('')
  const [loadingUsers, setLoadingUsers] = useState(false)

  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ plantName: '', diseaseName: '', description: '', causes: '', treatment: '', prevention: '' })
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    loadOverview()
    loadUsers()
    loadDiseases()
  }, [])

  const loadOverview = async () => {
    try {
      const [s, r] = await Promise.all([adminService.getStatistics(), adminService.getRecentDetections(6)])
      setStats(s)
      setRecent(r)
    } catch (e) {}
  }

  const loadUsers = async (term = '') => {
    setLoadingUsers(true)
    try {
      setUsers(await adminService.getUsers(term))
    } catch (e) {}
    finally {
      setLoadingUsers(false)
    }
  }

  const loadDiseases = async () => {
    try {
      setDiseases(await adminService.getDiseases())
    } catch (e) {}
  }

  const handleSearch = () => loadUsers(search)

  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return
    try {
      await adminService.deleteUser(id)
      loadUsers(search)
      loadOverview()
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete user.')
    }
  }

  const resetForm = () => {
    setForm({ plantName: '', diseaseName: '', description: '', causes: '', treatment: '', prevention: '' })
    setEditing(null)
    setFormOpen(false)
  }

  const openEdit = (d) => {
    setEditing(d)
    setForm({
      plantName: d.plantName,
      diseaseName: d.diseaseName,
      description: d.description || '',
      causes: (d.causes || []).join('\n'),
      treatment: (d.treatment || []).join('\n'),
      prevention: (d.prevention || []).join('\n'),
    })
    setFormOpen(true)
  }

  const openCreate = () => {
    resetForm()
    setFormOpen(true)
  }

  const handleSubmitDisease = async (e) => {
    e.preventDefault()
    if (!form.plantName || !form.diseaseName) {
      alert('Plant name and disease name are required.')
      return
    }
    const payload = {
      plantName: form.plantName,
      diseaseName: form.diseaseName,
      description: form.description,
      causes: form.causes.split('\n').map((s) => s.trim()).filter(Boolean),
      treatment: form.treatment.split('\n').map((s) => s.trim()).filter(Boolean),
      prevention: form.prevention.split('\n').map((s) => s.trim()).filter(Boolean),
    }
    try {
      if (editing) {
        await adminService.updateDisease(editing.id, payload)
      } else {
        await adminService.createDisease(payload)
      }
      resetForm()
      loadDiseases()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save disease.')
    }
  }

  const handleDeleteDisease = async (id) => {
    if (!window.confirm('Delete this disease record?')) return
    try {
      await adminService.deleteDisease(id)
      loadDiseases()
    } catch (e) {
      alert('Failed to delete disease.')
    }
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <h1>
              Admin <span className="text-gradient">Dashboard</span>
            </h1>
            <p>Manage users, diseases and monitor system activity.</p>
          </div>
        </div>

        <div className="admin-tabs">
          <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>📊 Overview</button>
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>👥 Users</button>
          <button className={tab === 'diseases' ? 'active' : ''} onClick={() => setTab('diseases')}>💊 Diseases</button>
        </div>

        {tab === 'overview' && (
          <div className="admin-overview">
            <div className="stats-grid">
              <StatCard icon="👥" label="Total Users" value={stats?.totalUsers ?? 0} color="green" />
              <StatCard icon="🖼️" label="Images Analyzed" value={stats?.totalDetections ?? 0} color="blue" />
              <StatCard icon="✅" label="Healthy Detections" value={stats?.healthyDetections ?? 0} color="teal" />
              <StatCard icon="⚠️" label="Disease Detections" value={stats?.diseaseDetections ?? 0} color="red" />
            </div>
            <div className="recent-section">
              <h2>Recent Uploads</h2>
              {recent.length === 0 ? (
                <EmptyState icon="🖼️" title="No recent uploads" message="Detection activity will appear here." />
              ) : (
                <div className="history-grid">
                  {recent.map((item) => (
                    <HistoryCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="users-section">
            <div className="users-toolbar">
              <input
                className="form-input search-input"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="btn btn-secondary" onClick={handleSearch}>Search</button>
            </div>
            {loadingUsers ? (
              <Loader text="Loading users..." />
            ) : (
              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className="badge badge-info">{u.role}</span></td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          {u.role !== 'ADMIN' && (
                            <button className="btn btn-ghost-danger btn-sm" onClick={() => handleDeleteUser(u.id, u.name)}>Delete</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'diseases' && (
          <div className="diseases-section">
            <div className="users-toolbar">
              <h2>Disease Information Management</h2>
              <button className="btn btn-primary" onClick={openCreate}>+ Add Disease</button>
            </div>

            {formOpen && (
              <div className="disease-form card">
                <h3>{editing ? 'Edit Disease' : 'Add New Disease'}</h3>
                <form onSubmit={handleSubmitDisease}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Plant Name</label>
                      <input className="form-input" value={form.plantName} onChange={(e) => setForm({ ...form, plantName: e.target.value })} placeholder="e.g. Tomato" />
                    </div>
                    <div className="form-group">
                      <label>Disease Name</label>
                      <input className="form-input" value={form.diseaseName} onChange={(e) => setForm({ ...form, diseaseName: e.target.value })} placeholder="e.g. Early Blight" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-input" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Disease description..."></textarea>
                  </div>
                  <div className="form-group">
                    <label>Causes (one per line)</label>
                    <textarea className="form-input" rows="3" value={form.causes} onChange={(e) => setForm({ ...form, causes: e.target.value })} placeholder={"High humidity\nFungal infection"}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Treatment (one per line)</label>
                    <textarea className="form-input" rows="3" value={form.treatment} onChange={(e) => setForm({ ...form, treatment: e.target.value })} placeholder={"Remove infected leaves\nImprove air circulation"}></textarea>
                  </div>
                  <div className="form-group">
                    <label>Prevention (one per line)</label>
                    <textarea className="form-input" rows="3" value={form.prevention} onChange={(e) => setForm({ ...form, prevention: e.target.value })} placeholder={"Regular inspection\nUse healthy seeds"}></textarea>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">{editing ? 'Update Disease' : 'Save Disease'}</button>
                    <button type="button" className="btn btn-outline" onClick={resetForm}>Cancel</button>
                  </div>
                </form>
              </div>
            )}

            <div className="disease-cards">
              {diseases.map((d) => (
                <div className="disease-card card" key={d.id}>
                  <div className="disease-card-top">
                    <span className="badge badge-success">{d.plantName}</span>
                    <span className="badge badge-muted">{d.diseaseName}</span>
                  </div>
                  <p className="disease-card-desc">{d.description}</p>
                  <div className="disease-card-actions">
                    <button className="btn btn-secondary btn-sm" onClick={() => openEdit(d)}>Edit</button>
                    <button className="btn btn-ghost-danger btn-sm" onClick={() => handleDeleteDisease(d.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
            {diseases.length === 0 && !formOpen && (
              <EmptyState icon="💊" title="No diseases yet" message="Add your first disease record." />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Admin
