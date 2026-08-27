const features = [
  { icon: '🧠', title: 'AI-Powered Detection', desc: 'Identify potential crop diseases using intelligent image analysis.' },
  { icon: '⚡', title: 'Fast Analysis', desc: 'Get results quickly from your uploaded crop images.' },
  { icon: '🥦', title: 'Multiple Crops', desc: 'Support for fruits, vegetables, and plant leaves.' },
  { icon: '📖', title: 'Disease Information', desc: 'Display useful information about detected diseases.' },
  { icon: '💊', title: 'Treatment Guidance', desc: 'Show available recommendations when supported by the system.' },
  { icon: '🧑‍🌾', title: 'Farmer Friendly', desc: 'Simple interface designed for easy everyday use.' },
]

const Features = () => {
  return (
    <section className="home-section features-section" id="features">
      <div className="container">
        <div className="section-title reveal">
          <span className="section-eyebrow">Why AgroVision</span>
          <h2>
            Why Choose <span className="text-gradient">AgroVision AI?</span>
          </h2>
          <p>Everything you need to keep your crops healthy and productive.</p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card tilting reveal" style={{ transitionDelay: `${(i % 3) * 60}ms` }} key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
