import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { detectionService } from '../services/detectionService'
import StatCard from '../components/StatCard'
import HistoryCard from '../components/HistoryCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await detectionService.getHistory()
        setHistory(data)
      } catch (e) {
        // handled by interceptor
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this detection record?')) return
    try {
      await detectionService.delete(id)
      setHistory((prev) => prev.filter((h) => h.id !== id))
    } catch (e) {
      alert('Failed to delete record.')
    }
  }

  const healthy = history.filter((h) => h.healthStatus === 'Healthy').length
  const diseased = history.filter((h) => h.healthStatus !== 'Healthy').length

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <h1>
              Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p>Here&apos;s an overview of your plant health analysis.</p>
          </div>
          <Link to="/detect" className="btn btn-primary">+ New Detection</Link>
        </div>

        <div className="stats-grid">
          <StatCard icon="🖼️" label="Images Analyzed" value={history.length} color="green" />
          <StatCard icon="✅" label="Healthy Plants" value={healthy} color="blue" />
          <StatCard icon="⚠️" label="Diseased Plants" value={diseased} color="red" />
        </div>

        <div className="history-section">
          <h2>Detection History</h2>
          {loading ? (
            <Loader text="Loading your history..." />
          ) : history.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No detections yet"
              message="Upload a plant image to get started with your first analysis."
              action={<Link to="/detect" className="btn btn-primary">Analyze an Image</Link>}
            />
          ) : (
            <div className="history-grid">
              {history.map((item) => (
                <HistoryCard key={item.id} item={item} onDelete={handleDelete} showDelete />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
