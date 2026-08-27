import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

const sectionLinks = [
  { label: 'Detect Disease', to: '/detect' },
  { label: 'How It Works', to: '/', anchor: 'how-it-works' },
  { label: 'Features', to: '/', anchor: 'features' },
  { label: 'About', to: '/', anchor: 'about' },
]

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const goToSection = (anchor) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    } else {
      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${open ? 'navbar-open' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="brand-icon">🌱</span>
          <span className="brand-text">
            AgroVision <span className="brand-accent">AI</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive && location.hash === '' ? 'active' : '')}
            end
          >
            Home
          </NavLink>
          {sectionLinks.map((s) =>
            s.anchor ? (
              <button key={s.label} className="nav-anchor" onClick={() => goToSection(s.anchor)}>
                {s.label}
              </button>
            ) : (
              <NavLink key={s.label} to={s.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {s.label}
              </NavLink>
            )
          )}
          {isAuthenticated && (
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          <span className="ai-status" title="AI Detection service online">
            <span className="ai-status-dot"></span>
            AI Detection Online
          </span>

          {isAuthenticated ? (
            <>
              <div className="user-chip">
                <span className="user-avatar">{user?.name?.[0]?.toUpperCase()}</span>
                <span className="user-name">{user?.name?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/detect" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}

          <button
            className="navbar-toggle"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {open && (
        <div className="navbar-mobile">
          <NavLink to="/" end onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/detect" onClick={() => setOpen(false)}>
            Detect Disease
          </NavLink>
          <button onClick={() => goToSection('how-it-works')}>How It Works</button>
          <button onClick={() => goToSection('features')}>Features</button>
          <button onClick={() => goToSection('about')}>About</button>
          {isAuthenticated && (
            <NavLink to="/dashboard" onClick={() => setOpen(false)}>
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setOpen(false)}>
              Admin
            </NavLink>
          )}
          <div className="navbar-mobile-auth">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="btn btn-outline btn-block">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-block" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/detect" className="btn btn-primary btn-block" onClick={() => setOpen(false)}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
