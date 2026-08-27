import { useEffect, useRef } from 'react'
import './HeroCropVisual.css'

// A realistic-style, art-directed tomato crop scene rendered with SVG.
// Wraps the leafy plant in an AI analysis viewfinder so the hero reads as a
// "scanning the crop" experience rather than a generic 3D toy.
const HeroCropVisual = () => {
  const reducedRef = useRef(false)

  useEffect(() => {
    reducedRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  return (
    <div className="hero-crop" role="img" aria-label="AI scanning a tomato crop">
      <div className="hero-crop-stage">
        {/* soft ground shadow */}
        <div className="crop-shadow" aria-hidden="true"></div>

        {/* the realistic plant */}
        <svg
          className="crop-plant"
          viewBox="0 0 360 360"
          aria-hidden="true"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3fbf6f" />
              <stop offset="55%" stopColor="#2f9e57" />
              <stop offset="100%" stopColor="#1c7a40" />
            </linearGradient>
            <linearGradient id="leafGrad2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#53cf7e" />
              <stop offset="100%" stopColor="#26944d" />
            </linearGradient>
            <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f9c4f" />
              <stop offset="100%" stopColor="#247038" />
            </linearGradient>
            <radialGradient id="tomatoGrad" cx="0.35" cy="0.3" r="0.9">
              <stop offset="0%" stopColor="#ff6b4a" />
              <stop offset="45%" stopColor="#e63c2f" />
              <stop offset="100%" stopColor="#a51f22" />
            </radialGradient>
            <radialGradient id="tomatoGradSmall" cx="0.35" cy="0.3" r="0.9">
              <stop offset="0%" stopColor="#ff8262" />
              <stop offset="45%" stopColor="#ef4a36" />
              <stop offset="100%" stopColor="#b52826" />
            </radialGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#00302a" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* stem */}
          <path d="M180 340 C176 280 178 230 184 190" fill="none" stroke="url(#stemGrad)" strokeWidth="9" strokeLinecap="round" />

          {/* back leaves */}
          <path d="M184 282 C 130 258 92 250 60 268 C 92 288 140 296 184 292 Z" fill="url(#leafGrad2)" opacity="0.9" />
          <path d="M184 250 C 240 222 278 216 306 232 C 276 254 228 262 184 258 Z" fill="url(#leafGrad2)" opacity="0.85" />

          {/* left leaf */}
          <path d="M182 220 C 130 196 92 180 44 196 C 92 226 140 238 184 232 Z" fill="url(#leafGrad)" />
          <path d="M44 196 C 80 206 120 216 184 232" fill="none" stroke="#1c6e39" strokeWidth="2" opacity="0.5" />

          {/* right leaf */}
          <path d="M182 196 C 236 170 274 158 318 176 C 276 206 228 216 184 208 Z" fill="url(#leafGrad2)" />
          <path d="M318 176 C 280 188 238 198 184 208" fill="none" stroke="#1c6e39" strokeWidth="2" opacity="0.5" />

          {/* top leaf cluster */}
          <path d="M184 168 C 160 138 140 120 118 128 C 142 156 160 168 184 170 Z" fill="url(#leafGrad)" />
          <path d="M184 168 C 210 136 234 118 258 126 C 230 156 208 168 184 170 Z" fill="url(#leafGrad2)" />
          <path d="M184 176 C 184 148 176 120 190 104 C 192 138 192 160 184 170 Z" fill="url(#leafGrad)" />

          {/* hanging tomato */}
          <g filter="url(#soft)">
            <ellipse cx="150" cy="262" rx="44" ry="46" fill="url(#tomatoGrad)" />
            <ellipse cx="142" cy="248" rx="13" ry="10" fill="#ffffff" opacity="0.28" />
            <rect x="146" y="216" width="8" height="14" rx="4" fill="#2f9e57" transform="rotate(-12 150 216)" />
          </g>

          {/* small tomato front-left */}
          <g filter="url(#soft)">
            <ellipse cx="236" cy="270" rx="30" ry="31" fill="url(#tomatoGradSmall)" />
            <ellipse cx="229" cy="259" rx="8" ry="7" fill="#ffffff" opacity="0.3" />
            <rect x="232" y="240" width="7" height="12" rx="3" fill="#2f9e57" transform="rotate(8 235 240)" />
          </g>

          {/* top tomato */}
          <g filter="url(#soft)">
            <ellipse cx="212" cy="150" rx="34" ry="35" fill="url(#tomatoGrad)" />
            <ellipse cx="204" cy="138" rx="10" ry="8" fill="#ffffff" opacity="0.3" />
            <path d="M198 116 l7 10 7 -10 -7 6 z" fill="#2f9e57" />
          </g>
        </svg>

        {/* analysis viewfinder */}
        <div className="crop-viewfinder" aria-hidden="true">
          <span className="vf vf-tl"></span>
          <span className="vf vf-tr"></span>
          <span className="vf vf-bl"></span>
          <span className="vf vf-br"></span>
          <span className="vf-cross vf-cross-v"></span>
          <span className="vf-cross vf-cross-h"></span>
          <div className="vf-scan"></div>
        </div>

        {/* floating chips */}
        <div className="crop-chip crop-chip-leaf" aria-hidden="true">🍃 Leaf Scanned</div>
        <div className="crop-chip crop-chip-fruit" aria-hidden="true">🍅 Fruit Healthy</div>
      </div>
    </div>
  )
}

export default HeroCropVisual
