import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-leaf c1" aria-hidden="true">🍂</div>
      <div className="cta-leaf c2" aria-hidden="true">🍃</div>
      <div className="cta-leaf c3" aria-hidden="true">🌿</div>

      <div className="container cta-inner reveal">
        <h2>Ready to Check Your Crop?</h2>
        <p>
          Upload an image and let AgroVision AI analyze your fruit, vegetable,
          or plant for potential diseases.
        </p>
        <Link to="/detect" className="btn btn-primary btn-xl">
          🔍 Detect Disease
        </Link>
      </div>
    </section>
  )
}

export default CTA
