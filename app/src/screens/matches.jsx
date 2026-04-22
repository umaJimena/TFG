// Coincidencias (matches) + Trip detail after reservation
const MatchesScreen = ({ onBack, onReserve }) => {
  const [selected, setSelected] = React.useState('m1');

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FBF3E6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '8px 20px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} className="pressable" style={{
            width: 36, height: 36, borderRadius: 36, border: '1.5px solid #141A45',
            background: '#fff', display: 'grid', placeItems: 'center',
          }}><Icon.ChevronLeft size={18}/></button>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(20,26,69,0.65)' }}>Coincidencias</div>
          <div style={{ width: 36 }}/>
        </div>
      </div>

      <div style={{ padding: '8px 22px 12px' }}>
        <div className="serif" style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          {MATCHES.length} conductores<br/>en tu misma ruta
        </div>
        <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.6)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon.Route size={13}/> Móstoles · 8:15 → Cantoblanco · L-V
        </div>
      </div>

      {/* Sort / filter row */}
      <div style={{ padding: '4px 22px 10px', display: 'flex', gap: 8, overflow: 'hidden' }}>
        {[{l:'Mejor match',on:true},{l:'Más barato'},{l:'Menos desvío'}].map(c => (
          <div key={c.l} style={{
            height: 30, padding: '0 12px', borderRadius: 30,
            background: c.on ? '#141A45' : 'transparent',
            color: c.on ? '#FBF3E6' : 'rgba(20,26,69,0.6)',
            border: c.on ? 'none' : '1px solid rgba(20,26,69,0.18)',
            fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center',
          }}>{c.l}</div>
        ))}
      </div>

      <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 18px 130px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {MATCHES.map(m => <MatchCard key={m.id} m={m} selected={selected === m.id} onSelect={() => setSelected(m.id)}/>)}
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px 26px',
        background: 'linear-gradient(180deg, rgba(251,243,230,0) 0%, #FBF3E6 35%)',
      }}>
        <Button block size="lg" onClick={() => onReserve(MATCHES.find(m => m.id === selected))}>
          Reservar trayecto
        </Button>
      </div>
    </div>
  );
};

const MatchCard = ({ m, selected, onSelect }) => {
  const seats = Array.from({ length: m.seatsTotal }).map((_, i) => i < m.seatsTaken);
  return (
    <div onClick={onSelect} className="pressable" style={{
      background: '#fff', borderRadius: 20, padding: 14,
      border: selected ? '2px solid #141A45' : '1.5px solid rgba(20,26,69,0.12)',
      boxShadow: selected ? '0 16px 32px rgba(20,26,69,0.12)' : 'none',
    }}>
      {/* top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar initials={m.driver.avatar} color={m.driver.color} size={42}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{m.driver.name}</div>
            {m.driver.verified && (
              <div style={{ width: 14, height: 14, borderRadius: 14, background: '#4E7D4B', display: 'grid', placeItems: 'center' }}>
                <Icon.Check size={10} color="#FBF3E6"/>
              </div>
            )}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(20,26,69,0.6)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon.Star size={11} color="#E9B949"/>{m.driver.rating} · {m.driver.trips} viajes
          </div>
        </div>
        {/* Match percent */}
        <div style={{
          background: m.matchPct >= 95 ? '#4E7D4B' : (m.matchPct >= 90 ? '#E9B949' : 'rgba(20,26,69,0.08)'),
          color: m.matchPct >= 90 ? '#FBF3E6' : '#141A45',
          padding: '6px 10px', borderRadius: 10, textAlign: 'center', minWidth: 54,
        }}>
          <div className="mono" style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{m.matchPct}<span style={{ fontSize: 10 }}>%</span></div>
          <div style={{ fontSize: 9, letterSpacing: '0.06em', fontWeight: 600, textTransform: 'uppercase', marginTop: 2, opacity: 0.85 }}>match</div>
        </div>
      </div>

      {/* Route */}
      <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(233,185,73,0.12)', borderRadius: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="mono" style={{ fontSize: 16, fontWeight: 700, minWidth: 44 }}>{m.depart}</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{m.from}</div>
        </div>
        <div style={{ height: 6 }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="mono" style={{ fontSize: 16, fontWeight: 700, minWidth: 44, opacity: 0.6 }}>{m.arrive}</div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 600, opacity: 0.8 }}>{m.to}</div>
        </div>
      </div>

      {/* Foot row */}
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 3 }}>
            {seats.map((taken, i) => (
              <Icon.User key={i} size={18} color={taken ? 'rgba(20,26,69,0.5)' : '#141A45'} filled={taken}/>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(20,26,69,0.65)' }}>{m.seatsTotal - m.seatsTaken} libres</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: 16, fontWeight: 700 }}>{m.perDay.toFixed(2)}€<span style={{ fontSize: 10, opacity: 0.6, fontWeight: 500 }}>/día</span></div>
          <div style={{ fontSize: 10, color: 'rgba(20,26,69,0.55)' }}>{m.monthly.toFixed(2)}€/mes</div>
        </div>
      </div>
    </div>
  );
};

window.MatchesScreen = MatchesScreen;
