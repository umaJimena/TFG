// Home — Mis próximos trayectos
const TONES = {
  mustard: { bg: '#E9B949', ink: '#4A3510', soft: 'rgba(74,53,16,0.18)', deep: '#B8821A' },
  leaf:    { bg: '#4E7D4B', ink: '#FBF3E6', soft: 'rgba(251,243,230,0.22)', deep: '#355733' },
  coral:   { bg: '#E26B5A', ink: '#FBF3E6', soft: 'rgba(251,243,230,0.22)', deep: '#A03E2F' },
  sky:     { bg: '#BFD7E8', ink: '#0F2A3D', soft: 'rgba(15,42,61,0.18)', deep: '#6F9DB8' },
};

const TripCard = ({ trip, expanded, onToggle, onOpen, role }) => {
  const t = TONES[trip.tone] || TONES.mustard;
  const isDriver = trip.role === 'driver' || role === 'driver';
  return (
    <div className="trip-card pressable" onClick={onToggle} style={{
      position: 'relative',
      background: t.bg, color: t.ink, borderRadius: 22,
      padding: 18, overflow: 'hidden',
      boxShadow: expanded ? '0 24px 48px rgba(20,26,69,0.24)' : '0 6px 14px rgba(20,26,69,0.08)',
      border: '1.5px solid rgba(20,26,69,0.18)',
    }}>
      {/* top row: role tag + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: t.soft, padding: '5px 10px', borderRadius: 999,
          fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          {isDriver ? <Icon.Car size={13} color={t.ink}/> : <Icon.Users size={13} color={t.ink}/>}
          {isDriver ? 'Conductor' : 'Pasajero'}
        </div>
        <Avatar initials={trip.driver.avatar} color={t.ink === '#FBF3E6' ? '#FBF3E6' : '#FBF3E6'} size={34}/>
      </div>

      {/* route line */}
      <div style={{ display: 'flex', gap: 14, marginTop: 4 }}>
        {/* Time column */}
        <div style={{ textAlign: 'right', minWidth: 52, paddingTop: 2 }}>
          <div className="mono" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1 }}>{trip.depart}</div>
          <div className="mono" style={{ fontSize: 12, opacity: 0.6, marginTop: 22 }}>{trip.arrive}</div>
        </div>
        {/* Dot line */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: 10, background: t.ink }}/>
          <div style={{ width: 2, flex: 1, background: t.ink, opacity: 0.4, margin: '2px 0', backgroundImage: `linear-gradient(${t.ink} 60%, transparent 0)`, backgroundSize: '2px 6px' }}/>
          <Icon.Pin size={16} color={t.ink} filled/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25 }}>{trip.from}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Salida · {trip.nextDate}</div>
          <div style={{ height: 14 }}/>
          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.25 }}>{trip.to}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Vuelta · {trip.returnTime}</div>
        </div>
      </div>

      {/* divider */}
      <div style={{ height: 1, background: t.ink, opacity: 0.15, margin: '16px 0 14px' }}/>

      {/* footer row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {["L","M","X","J","V","S","D"].map(d => {
            const on = trip.days.includes(d);
            return (
              <div key={d} style={{
                width: 22, height: 22, borderRadius: 22, display: 'grid', placeItems: 'center',
                fontSize: 10, fontWeight: 700,
                background: on ? t.ink : 'transparent',
                color: on ? t.bg : t.ink,
                opacity: on ? 1 : 0.4,
                border: on ? 'none' : `1px solid ${t.ink}`,
              }}>{d}</div>
            );
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AvatarStack users={[trip.driver, ...trip.passengers]} size={22} max={3}/>
          <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{trip.monthly.toFixed(2)}€<span style={{ opacity: 0.6, fontSize: 10, fontWeight: 500 }}>/mes</span></div>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="fade-up" style={{ marginTop: 16, paddingTop: 14, borderTop: `1px dashed ${t.ink}`, borderTopColor: t.ink + '33' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
            <Stat label="Distancia" value={`${trip.distanceKm} km`} t={t}/>
            <Stat label="Duración" value={`${trip.durationMin} min`} t={t}/>
            <Stat label="Por día" value={`${trip.perDay.toFixed(2)}€`} t={t}/>
          </div>
          <div style={{ padding: 12, background: t.soft, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar initials={trip.driver.avatar} color="#FBF3E6" size={36}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{trip.driver.name}</div>
              <div style={{ fontSize: 11, opacity: 0.75, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <Icon.Star size={12} color={t.ink}/>{trip.driver.rating} · {trip.driver.car}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={e => { e.stopPropagation(); onOpen(trip); }} className="pressable" style={{
              flex: 1, height: 44, borderRadius: 12, background: '#141A45', color: '#FBF3E6',
              border: 'none', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>Ver detalles <Icon.ChevronRight size={14} color="#FBF3E6"/></button>
            <button onClick={e => e.stopPropagation()} className="pressable" style={{
              width: 44, height: 44, borderRadius: 12, background: t.ink, color: t.bg,
              border: 'none', display: 'grid', placeItems: 'center',
            }}><Icon.Chat size={18} color={t.bg}/></button>
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value, t }) => (
  <div style={{ background: t.soft, borderRadius: 12, padding: '10px 12px' }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.75 }}>{label}</div>
    <div className="mono" style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{value}</div>
  </div>
);

const HomeScreen = ({ role, onRoleToggle, onNew, onOpenTrip, onTab }) => {
  const [expanded, setExpanded] = React.useState('t1');
  const toggle = id => setExpanded(expanded === id ? null : id);

  const upcoming = UPCOMING;

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FBF3E6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '8px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar initials="EL" color="#E9B949" size={40} border/>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(20,26,69,0.55)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Hola</div>
              <div className="serif" style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.01em' }}>Elena</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onRoleToggle} className="pressable" title="Cambiar rol" style={{
              height: 40, padding: '0 12px', borderRadius: 40,
              border: '1.5px solid #141A45', background: '#FBF3E6',
              display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 12,
            }}>
              {role === 'driver' ? <Icon.Car size={16}/> : <Icon.Users size={16}/>}
              {role === 'driver' ? 'Conductor' : 'Pasajero'}
              <Icon.Swap size={14}/>
            </button>
            <button className="pressable" style={{
              width: 40, height: 40, borderRadius: 40, border: '1.5px solid #141A45',
              background: '#FBF3E6', display: 'grid', placeItems: 'center', position: 'relative',
            }}>
              <Icon.Bell size={18}/>
              <div style={{ position: 'absolute', top: 7, right: 9, width: 8, height: 8, borderRadius: 8, background: '#E26B5A', border: '1.5px solid #FBF3E6' }}/>
            </button>
          </div>
        </div>
      </div>

      {/* Title + new trip CTA */}
      <div style={{ padding: '20px 22px 14px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.02, letterSpacing: '-0.02em' }}>
            Mis próximos<br/>trayectos
          </div>
          <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.6)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 6, background: '#4E7D4B' }}/>
            {upcoming.length} activos · próximo {upcoming[0].nextDate.toLowerCase()}
          </div>
        </div>
        <button onClick={onNew} className="pressable" style={{
          height: 40, padding: '0 14px 0 12px', borderRadius: 40,
          background: '#141A45', color: '#FBF3E6', border: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: 13,
        }}>
          <Icon.Plus size={16} color="#FBF3E6"/> Nuevo
        </button>
      </div>

      {/* Segmented filter */}
      <div style={{ padding: '0 22px 10px' }}>
        <div style={{ display: 'flex', gap: 8, overflow: 'hidden' }}>
          {['Activos', 'Esta semana', 'Historial'].map((f, i) => (
            <div key={f} style={{
              height: 32, padding: '0 14px', borderRadius: 32,
              background: i === 0 ? '#141A45' : 'transparent',
              color: i === 0 ? '#FBF3E6' : 'rgba(20,26,69,0.55)',
              border: i === 0 ? 'none' : '1px solid rgba(20,26,69,0.18)',
              display: 'inline-flex', alignItems: 'center',
              fontSize: 12, fontWeight: 600,
            }}>{f}{i === 0 && <span style={{ marginLeft: 6, fontSize: 11, opacity: 0.7 }}>2</span>}</div>
          ))}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '6px 18px 110px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {upcoming.map(t => (
            <TripCard key={t.id} trip={t} expanded={expanded === t.id}
              onToggle={() => toggle(t.id)} onOpen={onOpenTrip} role={role}/>
          ))}

          {/* Empty suggestion */}
          <div style={{
            background: '#fff', borderRadius: 22, padding: 18,
            border: '1.5px dashed rgba(20,26,69,0.25)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, background: 'rgba(233,185,73,0.25)',
              display: 'grid', placeItems: 'center',
            }}>
              <Icon.Route size={22} color="#141A45"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Añade otro trayecto</div>
              <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.6)', marginTop: 2 }}>¿Sábados al centro? ¿Fines de semana?</div>
            </div>
            <button onClick={onNew} className="pressable" style={{
              width: 38, height: 38, borderRadius: 38, border: '1.5px solid #141A45',
              background: '#FBF3E6', display: 'grid', placeItems: 'center',
            }}><Icon.Plus size={18}/></button>
          </div>
        </div>
      </div>
    </div>
  );
};

window.HomeScreen = HomeScreen;
