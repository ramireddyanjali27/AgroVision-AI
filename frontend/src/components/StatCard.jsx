import './StatCard.css'

const StatCard = ({ icon, label, value, color = 'green' }) => {
  const palette = {
    green: { bg: '#e6f5ee', color: 'var(--success)' },
    blue: { bg: '#e6f1fb', color: '#1d4ed8' },
    orange: { bg: '#fff4e0', color: '#b45309' },
    red: { bg: '#fdecec', color: 'var(--danger)' },
    teal: { bg: '#e0f5f6', color: 'var(--secondary)' },
    purple: { bg: '#efeaff', color: '#6d28d9' },
  }
  const c = palette[color] || palette.green

  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: c.bg, color: c.color }}>
        {icon}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  )
}

export default StatCard
