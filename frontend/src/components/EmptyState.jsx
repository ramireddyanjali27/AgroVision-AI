import './EmptyState.css'

const EmptyState = ({ icon = '🌱', title, message, action }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  )
}

export default EmptyState
