import { Link } from 'react-router-dom'

const AgricultureSection = () => {
  return (
    <section className="home-section agri-section" id="about">
      <div className="agri-leaf-bg" aria-hidden="true">🌿</div>
      <div className="agri-particle p1" aria-hidden="true"></div>
      <div className="agri-particle p2" aria-hidden="true"></div>
      <div className="agri-particle p3" aria-hidden="true"></div>

      <div className="container agri-inner">
        <div className="agri-visual reveal">
          <div className="agri-plant">
            <span className="agri-stem"></span>
            <span className="agri-leaf l1"></span>
            <span className="agri-leaf l2"></span>
            <span className="agri-leaf l3"></span>
          </div>
          <div className="agri-mini-card">
            <span className="agri-mini-dot"></span>
            <div>
              <strong>Disease</strong>
              <span>Detected · 94.7%</span>
            </div>
          </div>
        </div>

        <div className="agri-copy reveal">
          <span className="section-eyebrow">Smart Agriculture</span>
          <h2>
            Technology That Helps <span className="text-gradient">Protect Every Crop</span>
          </h2>
          <p>
            AgroVision AI combines agriculture and artificial intelligence to
            help identify crop health problems earlier — so you can act faster
            and protect your harvest.
          </p>
          <Link to="/detect" className="btn btn-primary btn-lg">
            Explore AI Detection →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AgricultureSection
