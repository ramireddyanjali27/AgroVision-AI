import { Link } from 'react-router-dom'
import './HistoryCard.css'

const HistoryCard = ({ item, onDelete, showDelete = false }) => {
  const isHealthy = item.healthStatus === 'Healthy'
  return (
    <div className="history-card">
      <div className="history-image">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.plantName} />
        ) : (
          <div className="history-no-image">🌿</div>
        )}
      </div>
      <div className="history-body">
        <div className="history-top">
          <strong>{item.plantName}</strong>
          <span
            className={`badge ${isHealthy ? 'badge-success' : 'badge-danger'}`}
          >
            {isHealthy ? 'Healthy' : item.diseaseName}
          </span>
        </div>
        <div className="history-meta">
          <span>Confidence: {item.confidence?.toFixed(1) ?? '—'}%</span>
          <span>
            {item.detectionDate
              ? new Date(item.detectionDate).toLocaleDateString()
              : '—'}
          </span>
        </div>
        <div className="history-actions">
          <Link to={`/result/${item.id}`} className="btn btn-secondary btn-sm">
            View Details
          </Link>
          {showDelete && onDelete && (
            <button onClick={() => onDelete(item.id)} className="btn btn-ghost-danger btn-sm">
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryCard
