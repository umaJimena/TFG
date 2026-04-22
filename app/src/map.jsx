// Stylized illustrated map — Móstoles → Cantoblanco

const StylizedMap = ({
  height = 280,
  origin = { x: 72, y: 250, label: "Móstoles" },
  dest = { x: 318, y: 55, label: "Cantoblanco" },
  pins = [],
  showRoute = true,
  animated = false,
  interactive = false,
}) => {
  // Route as a smooth Bezier
  const path = `M ${origin.x} ${origin.y} C ${origin.x + 80} ${origin.y - 30}, ${dest.x - 140} ${dest.y + 120}, ${dest.x} ${dest.y}`;

  return (
    <div style={{
      position: 'relative', width: '100%', height, overflow: 'hidden',
      background: '#ECE1D5',
      borderRadius: 0,
    }}>
      <svg viewBox="0 0 390 320" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0 }}>
        {/* Paper tint */}
        <defs>
          <pattern id="paperDots" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="rgba(20,26,69,0.05)"/>
          </pattern>
          <pattern id="grassDots" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="rgba(78,125,75,0.28)"/>
          </pattern>
          <linearGradient id="waterGrad" x1="0" x2="1">
            <stop offset="0" stopColor="#BFD7E8"/>
            <stop offset="1" stopColor="#A8C8DD"/>
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="390" height="320" fill="#ECE1D5"/>
        <rect x="0" y="0" width="390" height="320" fill="url(#paperDots)"/>

        {/* Blobby districts */}
        <path d="M -20 40 C 40 20, 110 30, 150 80 C 190 130, 140 170, 70 180 C 10 190, -30 140, -20 40 Z"
          fill="#D9C6A5" opacity="0.55"/>
        <path d="M 200 -10 C 280 10, 360 40, 410 90 C 420 140, 340 150, 260 130 C 200 115, 170 50, 200 -10 Z"
          fill="#D9C6A5" opacity="0.5"/>
        <path d="M 130 220 C 200 200, 290 210, 340 260 C 360 310, 260 340, 180 330 C 120 320, 100 260, 130 220 Z"
          fill="#D9C6A5" opacity="0.5"/>

        {/* Parks / green blobs */}
        <g opacity="0.7">
          <ellipse cx="250" cy="180" rx="38" ry="24" fill="#C4D6B2"/>
          <ellipse cx="250" cy="180" rx="38" ry="24" fill="url(#grassDots)"/>
          <ellipse cx="80" cy="100" rx="28" ry="18" fill="#C4D6B2"/>
          <ellipse cx="80" cy="100" rx="28" ry="18" fill="url(#grassDots)"/>
        </g>

        {/* River */}
        <path d="M -10 200 C 60 190, 110 230, 180 215 C 250 200, 320 240, 400 225"
          stroke="url(#waterGrad)" strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.85"/>
        <path d="M -10 200 C 60 190, 110 230, 180 215 C 250 200, 320 240, 400 225"
          stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeDasharray="2 4"/>

        {/* Main streets — subtle */}
        <g stroke="#FBF3E6" strokeWidth="10" strokeLinecap="round" opacity="0.85">
          <line x1="-20" y1="140" x2="410" y2="95"/>
          <line x1="40" y1="-10" x2="110" y2="330"/>
          <line x1="280" y1="-10" x2="330" y2="330"/>
        </g>
        <g stroke="rgba(20,26,69,0.08)" strokeWidth="1" strokeDasharray="4 4">
          <line x1="-20" y1="140" x2="410" y2="95"/>
          <line x1="40" y1="-10" x2="110" y2="330"/>
          <line x1="280" y1="-10" x2="330" y2="330"/>
        </g>

        {/* Secondary streets */}
        <g stroke="#FBF3E6" strokeWidth="4" strokeLinecap="round" opacity="0.7">
          <line x1="-10" y1="70" x2="200" y2="50"/>
          <line x1="150" y1="170" x2="400" y2="180"/>
          <line x1="60" y1="260" x2="260" y2="280"/>
          <line x1="200" y1="100" x2="230" y2="250"/>
        </g>

        {/* Route */}
        {showRoute && (
          <>
            <path d={path} stroke="#141A45" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d={path} stroke="#FBF3E6" strokeWidth="2" fill="none" strokeLinecap="round" strokeDasharray="3 5"/>
          </>
        )}

        {/* Extra pins */}
        {pins.map((p, i) => (
          <g key={i} transform={`translate(${p.x},${p.y})`} opacity={p.dim ? 0.55 : 1}>
            <circle r="5" fill="#FBF3E6" stroke="#141A45" strokeWidth="1.5"/>
          </g>
        ))}

        {/* Origin pin */}
        <g transform={`translate(${origin.x},${origin.y})`}>
          {animated && <circle r="14" fill="#E9B949" opacity="0.4" className="pulse-dot"/>}
          <circle r="11" fill="#E9B949" stroke="#141A45" strokeWidth="2"/>
          <circle r="4" fill="#141A45"/>
        </g>

        {/* Destination pin (pin shape) */}
        <g transform={`translate(${dest.x},${dest.y})`}>
          <path d="M 0 -22 C 10 -22, 14 -14, 14 -8 C 14 0, 6 6, 0 18 C -6 6, -14 0, -14 -8 C -14 -14, -10 -22, 0 -22 Z"
            fill="#E26B5A" stroke="#141A45" strokeWidth="2"/>
          <circle cx="0" cy="-10" r="4" fill="#FBF3E6"/>
        </g>
      </svg>

      {/* Corner labels */}
      <div style={{ position: 'absolute', left: Math.max(8, origin.x - 30), top: origin.y + 18, transform: 'translateY(0)' }}>
        <div className="chip" style={{ background: '#141A45', color: '#FBF3E6', height: 22, padding: '0 8px', fontSize: 10 }}>{origin.label}</div>
      </div>
      <div style={{ position: 'absolute', left: Math.min(320, dest.x - 30), top: dest.y - 30 }}>
        <div className="chip" style={{ background: '#E26B5A', color: '#FBF3E6', height: 22, padding: '0 8px', fontSize: 10 }}>{dest.label}</div>
      </div>
    </div>
  );
};

window.StylizedMap = StylizedMap;
