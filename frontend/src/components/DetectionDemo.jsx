import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const DetectionDemo = () => {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setProgress(100)
      setDone(true)
      return
    }
    let raf = 0
    let start = performance.now()
    const dur = 3200
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 2)
      const val = Math.round(eased * 100)
      setProgress(val)
      if (val < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        setDone(true)
      }
    }
    raf = requestAnimationFrame(tick)
    const reset = setTimeout(() => {
      setDone(false)
      setProgress(0)
      setCycle((c) => c + 1)
      start = performance.now()
      raf = requestAnimationFrame(tick)
    }, dur + 5200)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(reset)
    }
  }, [cycle])

  return (
    <section className="home-section demo-section" id="demo">
      <div className="container">
        <div className="section-title reveal">
          <span className="section-eyebrow">Live Demo</span>
          <h2>
            See AI Disease Detection <span className="text-gradient">in Action</span>
          </h2>
          <p>A visual walkthrough of how your crop image becomes a diagnosis.</p>
        </div>

        <div className="demo-panel reveal">
          <div className="demo-left">
            <div className="demo-image">
              <span className="demo-tomato">🍅</span>
              <div className="demo-scan-line"></div>
              <div className="demo-scan-grid"></div>
              <div className="demo-corner corner-tl"></div>
              <div className="demo-corner corner-tr"></div>
              <div className="demo-corner corner-bl"></div>
              <div className="demo-corner corner-br"></div>
            </div>
            <div className="demo-image-label">Crop Image</div>
          </div>

          <div className="demo-right">
            <h3 className="demo-heading">AI Analysis</h3>
            <div className="demo-rows">
              <div className="demo-row"><span>Crop</span><strong>Tomato</strong></div>
              <div className="demo-row"><span>Status</span><strong className="demo-status">Disease Detected</strong></div>
              <div className="demo-row"><span>Disease</span><strong>Tomato Leaf Blight</strong></div>
            </div>

            <div className="demo-progress-area">
              {!done ? (
                <>
                  <div className="demo-progress-label">Analyzing Image... {progress}%</div>
                  <div className="demo-progress-bar">
                    <span style={{ width: `${progress}%` }}></span>
                  </div>
                </>
              ) : (
                <div className="demo-complete">
                  <span className="demo-complete-check">✓</span> Analysis Complete
                </div>
              )}
            </div>

            <div className="demo-row demo-confidence">
              <span>Confidence</span><strong className="demo-pct">{done ? '94.7%' : `${Math.round((progress / 100) * 94.7 * 10) / 10}%`}</strong>
            </div>

            <Link to="/detect" className="btn btn-primary demo-btn">
              Try It On Your Image →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DetectionDemo
