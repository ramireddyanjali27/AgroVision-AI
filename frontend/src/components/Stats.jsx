import { useEffect, useRef, useState } from 'react'

const Stats = () => {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="stats-section" ref={ref}>
      <div className="container">
        <div className="stats-grid">
          <StatValue started={started} target={12} suffix="+" label="Supported Crops" />
          <StatValue started={started} target={95} suffix="%+" label="Detection Accuracy" />
          <StatValue started={started} target={13} suffix="+" label="Plant Diseases" />
          <StatValue started={started} target={24} suffix="/7" label="AI Analysis" />
        </div>
      </div>
    </section>
  )
}

const StatValue = ({ started, target, suffix, label }) => {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVal(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, target])

  return (
    <div className="stat-item">
      <div className="stat-value">
        {val}
        <span className="stat-suffix">{suffix}</span>
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

export default Stats
