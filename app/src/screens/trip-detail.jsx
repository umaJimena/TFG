// Trip detail / reservation confirmed
const TripDetailScreen = ({ trip, onBack, onChat }) => {
  const t = trip || UPCOMING[0];
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FBF3E6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div style={{ padding: '8px 20px 0', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} className="pressable" style={{ width: 36, height: 36, borderRadius: 36, border: '1.5px solid #141A45', background: '#fff', display: 'grid', placeItems: 'center' }}><Icon.ChevronLeft size={18}/></button>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(20,26,69,0.6)' }}>Trayecto confirmado</div>
          <button className="pressable" style={{ width: 36, height: 36, borderRadius: 36, border: '1.5px solid #141A45', background: '#fff', display: 'grid', placeItems: 'center' }}><Icon.Menu size={18}/></button>
        </div>
      </div>

      <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px 18px 130px' }}>

        {/* Success hero */}
        <div style={{ padding: '14px 16px 18px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#4E7D4B', color: '#FBF3E6', borderRadius: 999, padding: '5px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <Icon.Check size={12} color="#FBF3E6"/> Reserva confirmada
          </div>
          <div className="serif" style={{ fontSize: 26, fontWeight: 500, marginTop: 10, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            ¡Ya eres parte del trayecto!
          </div>
        </div>

        {/* Big route card */}
        <div style={{ background: '#E9B949', color: '#4A3510', borderRadius: 22, padding: 18, border: '1.5px solid rgba(20,26,69,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.75 }}>Diario L-V</div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.04em', opacity: 0.75 }}>#{t.id.toUpperCase()}</div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'center', minWidth: 58 }}>
              <div className="mono" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{t.depart}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, marginTop: 4 }}>Salida</div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#4A3510' }}>
              <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: 7, background: '#4A3510' }}/>
                <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #4A3510 0, #4A3510 4px, transparent 4px, transparent 7px)' }}/>
                <Icon.Car size={16}/>
                <div style={{ flex: 1, height: 2, background: 'repeating-linear-gradient(90deg, #4A3510 0, #4A3510 4px, transparent 4px, transparent 7px)' }}/>
                <Icon.Pin size={14} filled color="#4A3510"/>
              </div>
              <div style={{ fontSize: 11, marginTop: 6, opacity: 0.75 }}>{t.durationMin} min · {t.distanceKm} km</div>
            </div>
            <div style={{ textAlign: 'center', minWidth: 58 }}>
              <div className="mono" style={{ fontSize: 26, fontWeight: 700, lineHeight: 1 }}>{t.arrive}</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, marginTop: 4 }}>Llegada</div>
            </div>
          </div>

          <div style={{ height: 1, background: '#4A3510', opacity: 0.2, margin: '14px 0' }}/>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, fontWeight: 700 }}>Recogida</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>{t.from}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.7, fontWeight: 700 }}>Destino</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2, lineHeight: 1.3 }}>{t.to}</div>
            </div>
          </div>
        </div>

        {/* Mini map */}
        <div style={{ marginTop: 14, borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(20,26,69,0.15)' }}>
          <StylizedMap height={160}/>
        </div>

        {/* Driver + passengers */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(20,26,69,0.6)', marginBottom: 8 }}>Conductor</div>
          <div style={{ background: '#fff', borderRadius: 16, padding: 12, border: '1.5px solid rgba(20,26,69,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar initials={t.driver.avatar} color={t.driver.color} size={48}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t.driver.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(20,26,69,0.6)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon.Star size={11} color="#E9B949"/> {t.driver.rating} · {t.driver.car}
              </div>
            </div>
            <button onClick={onChat} className="pressable" style={{ width: 40, height: 40, borderRadius: 40, background: '#141A45', display: 'grid', placeItems: 'center', border: 'none' }}>
              <Icon.Chat size={18} color="#FBF3E6"/>
            </button>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(20,26,69,0.6)', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
            <span>Pasajeros</span>
            <span style={{ opacity: 0.7 }}>{t.seatsTaken}/{t.seatsTotal}</span>
          </div>
          <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid rgba(20,26,69,0.1)', padding: 4 }}>
            {[...t.passengers, { id: 'me', avatar: 'EL', color: '#E9B949', name: 'Elena (tú)' }].map((p, i, arr) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                borderBottom: i < arr.length-1 ? '1px solid rgba(20,26,69,0.08)' : 'none',
              }}>
                <Avatar initials={p.avatar} color={p.color} size={32}/>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                {p.id === 'me' && <Chip tone="mustard">Tú</Chip>}
              </div>
            ))}
          </div>
        </div>

        {/* Payment card */}
        <div style={{ marginTop: 14, background: '#141A45', color: '#FBF3E6', borderRadius: 18, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.7 }}>Pago automático</div>
            <Icon.CreditCard size={18} color="#FBF3E6"/>
          </div>
          <div className="mono" style={{ fontSize: 30, fontWeight: 700, marginTop: 6 }}>{t.perDay.toFixed(2)}€ <span style={{ fontSize: 12, opacity: 0.6, fontWeight: 500 }}>/ día</span></div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
            Se cobra cada día tras el trayecto · {t.monthly.toFixed(2)}€ estimados/mes
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(251,243,230,0.15)' }}>
            <div style={{ width: 32, height: 22, borderRadius: 4, background: '#E9B949' }}/>
            <div style={{ fontSize: 12 }}>Visa terminada en <strong>•• 4281</strong></div>
          </div>
        </div>

        {/* Manage actions */}
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <ActionRow icon={<Icon.Warning size={16}/>} label="No asistiré un día" tone="ghost"/>
          <ActionRow icon={<Icon.Shield size={16}/>} label="Reportar" tone="ghost"/>
        </div>
        <div style={{ marginTop: 10 }}>
          <ActionRow icon={<Icon.Close size={16}/>} label="Cancelar trayecto" tone="danger"/>
        </div>
      </div>
    </div>
  );
};

const ActionRow = ({ icon, label, tone = 'ghost' }) => {
  const tones = {
    ghost: { bg: '#fff', color: '#141A45', border: '1.5px solid rgba(20,26,69,0.15)' },
    danger: { bg: 'transparent', color: '#E26B5A', border: '1.5px solid #E26B5A' },
  };
  return (
    <button className="pressable" style={{
      width: '100%', height: 48, borderRadius: 14, ...tones[tone],
      display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
      fontWeight: 600, fontSize: 13,
    }}>{icon}<span style={{ flex: 1, textAlign: 'left' }}>{label}</span><Icon.ChevronRight size={14} color="currentColor"/></button>
  );
};

window.TripDetailScreen = TripDetailScreen;
