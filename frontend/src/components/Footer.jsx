import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">🌱 AgroVision AI</span>
          <p>
            AI-powered crop disease detection for smarter agriculture. Identify
            diseases in fruits, vegetables, and plant leaves, and get clear
            treatment guidance.
          </p>
        </div>

        <div className="footer-col">
          <h4>Product</h4>
          <Link to="/detect">Detect Disease</Link>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <a href="#about">About</a>
          <Link to="/login">Login</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <div className="footer-col">
          <h4>Technology</h4>
          <span className="footer-tech">AI</span>
          <span className="footer-tech">Agriculture</span>
          <span className="footer-tech">Computer Vision</span>
        </div>
      </div>

      <div className="footer-note">
        <div className="container">
          Detection results are generated using AI and should be used as
          guidance. For serious crop problems, consult a qualified agricultural
          expert.
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} AgroVision AI · Built for farmers &amp; gardeners
        </div>
      </div>
    </footer>
  )
}

export default Footer
