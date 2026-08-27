import { Link } from 'react-router-dom'

const crops = [
  { icon: '🍅', name: 'Tomato', desc: 'Detect common tomato leaf & fruit diseases' },
  { icon: '🥔', name: 'Potato', desc: 'Catch early & late blight on potato crops' },
  { icon: '🌶️', name: 'Chilli', desc: 'Identify bacterial spot and viral symptoms' },
  { icon: '🥒', name: 'Cucumber', desc: 'Detect downy mildew and powdery mildew' },
  { icon: '🍎', name: 'Apple', desc: 'Spot apple scab and black rot early' },
  { icon: '🍊', name: 'Orange', desc: 'Screen citrus for greening and canker' },
  { icon: '🥬', name: 'Cabbage', desc: 'Check leafy greens for rot and fungus' },
  { icon: '🌽', name: 'Corn', desc: 'Identify rust and leaf blight in maize' },
]

const CropCards = () => {
  return (
    <section className="home-section crops-section" id="crops">
      <div className="container">
        <div className="section-title reveal">
          <span className="section-eyebrow">Supported Crops</span>
          <h2>
            Supported <span className="text-gradient">Fruits &amp; Vegetables</span>
          </h2>
          <p>Analyze the health of your crops with AI-powered visual detection.</p>
        </div>

        <div className="crops-grid">
          {crops.map((c, i) => (
            <div className="crop-card reveal" style={{ transitionDelay: `${(i % 4) * 60}ms` }} key={c.name}>
              <div className="crop-icon">{c.icon}</div>
              <h3>{c.name}</h3>
              <p>{c.desc}</p>
              <div className="crop-ai">
                <span className="ai-mini-dot"></span> AI Supported
              </div>
              <span className="crop-arrow" aria-hidden="true">→</span>
            </div>
          ))}
        </div>

        <div className="crops-cta reveal">
          <Link to="/detect" className="btn btn-primary btn-lg">
            🔍 Analyze Your Crop
          </Link>
        </div>
      </div>
    </section>
  )
}

export default CropCards
