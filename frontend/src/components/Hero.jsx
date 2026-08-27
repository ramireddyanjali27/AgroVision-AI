import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HeroCropVisual from './HeroCropVisual'

const Hero = () => {
  const [pct, setPct] = useState(91)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const timer = setInterval(() => {
      setPct((p) => {
        const next = Math.min(94.7, p + Math.random() * 1.4)
        return Math.round(next * 10) / 10
      })
      setPhase((v) => (v + 1) % 4)
    }, 700)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="home-hero" id="home">
      <div className="hero-bg-blobs" aria-hidden="true"></div>

      <div className="container home-hero-inner">
        <div className="hero-copy">
          <span className="hero-badge">✦ AI-Powered Crop Health Detection</span>
          <h1 className="hero-title">
            Detect Plant Diseases.
            <br />
            <span className="hero-highlight">Protect Your Crops.</span>
          </h1>
          <p className="hero-sub">
            AI-powered disease detection for fruits, vegetables, and plant
            leaves — analyze health in seconds and get clear treatment guidance.
          </p>
          <div className="hero-cta">
            <Link to="/detect" className="btn btn-primary btn-lg hero-btn-primary">
              <span className="btn-icon">🔍</span> Detect Disease
            </Link>
            <a href="#features" className="btn btn-secondary btn-lg hero-btn-secondary">
              Explore Features
            </a>
          </div>
          <p className="hero-trust">
            Fast <span>•</span> Intelligent <span>•</span> Farmer Friendly
          </p>
        </div>

        <div className="hero-visual">
          <HeroCropVisual />
          <div className="ai-scan-ring" aria-hidden="true"></div>
          <div className="ai-scan-line" aria-hidden="true"></div>

          <div className="ai-card" aria-hidden="true">
            <div className="ai-card-head">
              <span className="ai-card-label">AI ANALYSIS</span>
              <span className="ai-card-live">● LIVE</span>
            </div>
            <div className="ai-card-crop">🍅 Tomato</div>
            <div className="ai-card-disease">Tomato Leaf Blight</div>
            <div className="ai-card-confidence">
              <span className="ai-card-pct">{pct.toFixed(1)}%</span>
              <span className="ai-card-check">✓</span>
            </div>
            <div className="ai-card-bar">
              <span style={{ width: `${pct}%` }}></span>
            </div>
            <div className="ai-card-treatment">Treatment Available</div>
          </div>

          <div className="ai-status-chip" aria-hidden="true">
            <span className="ai-status-chip-dot"></span> Model Ready
          </div>
        </div>
      </div>

      <div className="hero-scroll-hint" aria-hidden="true">
        <span></span>
      </div>
    </section>
  )
}

export default Hero
