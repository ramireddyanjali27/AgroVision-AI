const howItWorks = [
  { icon: '📷', num: '01', title: 'Upload', desc: 'Upload a clear image of a fruit, vegetable, or plant leaf.' },
  { icon: '🤖', num: '02', title: 'AI Disease Analysis', desc: 'Our AI analyzes the image and identifies possible crop diseases.' },
  { icon: '📋', num: '03', title: 'Get Results', desc: 'View disease information, confidence, and recommended action.' },
]

const HowItWorks = () => {
  return (
    <section className="home-section how-section" id="how-it-works">
      <div className="container">
        <div className="section-title reveal">
          <span className="section-eyebrow">Simple Process</span>
          <h2>
            How AgroVision AI <span className="text-gradient">Works</span>
          </h2>
          <p>Disease detection made simple in just three steps.</p>
        </div>

        <div className="how-steps">
          {howItWorks.map((s) => (
            <div className="how-step reveal" key={s.num}>
              <div className="how-step-icon">{s.icon}</div>
              <div className="how-step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
