// Nuevo trayecto — mapa + formulario + conflicto modal
const NewTripScreen = ({ onBack, onSearch, role }) => {
  const [from, setFrom] = React.useState("Estación Renfe Móstoles");
  const [to, setTo]     = React.useState("Ciudad Universitaria · Cantoblanco");
  const [depart, setDepart] = React.useState("8:15");
  const [returnT, setReturnT] = React.useState("17:30");
  const [days, setDays] = React.useState(["L","M","X","J","V"]);
  const [myRole, setMyRole] = React.useState(role);
  const [conflict, setConflict] = React.useState(false);

  const toggleDay = d => setDays(days.includes(d) ? days.filter(x => x !== d) : [...days, d]);

  const doSearch = () => {
    // Demo: show conflict modal once, then search
    onSearch({ from, to, depart, returnT, days, role: myRole });
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FBF3E6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '8px 20px 10px', position: 'relative', zIndex: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={onBack} className="pressable" style={{
            width: 36, height: 36, borderRadius: 36, border: '1.5px solid #141A45',
            background: '#fff', display: 'grid', placeItems: 'center',
          }}><Icon.ChevronLeft size={18}/></button>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(20,26,69,0.7)' }}>Publicar alerta</div>
          <button onClick={() => setConflict(true)} className="pressable" style={{
            width: 36, height: 36, borderRadius: 36, border: '1.5px solid #141A45',
            background: '#fff', display: 'grid', placeItems: 'center',
          }}><Icon.Warning size={16}/></button>
        </div>
      </div>

      {/* Map region */}
      <div style={{ position: 'relative', height: 270, borderBottom: '1.5px solid rgba(20,26,69,0.1)' }}>
        <StylizedMap height={270} animated pins={[
          { x: 150, y: 165, dim: true }, { x: 230, y: 110, dim: true }, { x: 100, y: 80, dim: true },
        ]}/>
        {/* Floating role toggle */}
        <div style={{
          position: 'absolute', top: 14, left: 16, right: 16,
          display: 'flex', justifyContent: 'center',
        }}>
          <div style={{
            background: '#FBF3E6', border: '1.5px solid #141A45',
            borderRadius: 999, padding: 4, display: 'flex', gap: 2,
            boxShadow: '0 6px 14px rgba(20,26,69,0.15)',
          }}>
            {[
              { id: 'passenger', label: 'Soy pasajero', I: Icon.Users },
              { id: 'driver',    label: 'Soy conductor', I: Icon.Car },
            ].map(o => {
              const on = myRole === o.id;
              return (
                <button key={o.id} onClick={() => setMyRole(o.id)} className="wobble pressable" style={{
                  height: 34, padding: '0 14px', borderRadius: 999, border: 'none',
                  background: on ? '#141A45' : 'transparent',
                  color: on ? '#FBF3E6' : '#141A45',
                  fontWeight: 600, fontSize: 12,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <o.I size={14} color={on ? '#FBF3E6' : '#141A45'}/> {o.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 130px' }}>
        <div className="serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', marginBottom: 4 }}>
          {myRole === 'driver' ? 'Publicar mi trayecto' : 'Buscar trayecto'}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.6)', marginBottom: 16 }}>
          {myRole === 'driver' ? 'Indica tu ruta habitual y abrimos una alerta.' : 'Te mostraremos coincidencias cercanas.'}
        </div>

        {/* From-To combo */}
        <div style={{
          background: '#fff', borderRadius: 18, border: '1.5px solid #141A45',
          padding: 4,
        }}>
          <FromToRow icon={<div style={{ width: 10, height: 10, borderRadius: 10, background: '#E9B949', border: '2px solid #141A45' }}/>} label="Desde" value={from} onChange={setFrom}/>
          <div style={{ height: 1, background: 'rgba(20,26,69,0.12)', margin: '0 14px' }}/>
          <FromToRow icon={<Icon.Pin size={16} color="#E26B5A" filled/>} label="Hacia" value={to} onChange={setTo}/>
        </div>

        {/* Times */}
        <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <TimeCard label="Llegar antes de" value={depart} onChange={setDepart} icon={<Icon.Clock size={16}/>}/>
          <TimeCard label="Vuelta" value={returnT} onChange={setReturnT} icon={<Icon.Clock size={16}/>}/>
        </div>

        {/* Days */}
        <div style={{ marginTop: 14, background: '#fff', borderRadius: 18, border: '1.5px solid #141A45', padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(20,26,69,0.65)' }}>Días de la semana</div>
            <button onClick={() => setDays(["L","M","X","J","V"])} style={{ background: 'transparent', border: 'none', color: '#141A45', fontSize: 11, fontWeight: 600 }}>L-V</button>
          </div>
          <DaysPill days={days} onToggle={toggleDay} size="lg"/>
        </div>

        {/* Driver-only: seats + price */}
        {myRole === 'driver' && (
          <div style={{ marginTop: 14, background: '#fff', borderRadius: 18, border: '1.5px solid #141A45', padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(20,26,69,0.65)' }}>Plazas ofrecidas</div>
              <div style={{ fontSize: 11, color: 'rgba(20,26,69,0.55)' }}>Máx. según coche</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1,2,3,4].map(n => (
                <button key={n} style={{
                  flex: 1, height: 44, borderRadius: 12,
                  background: n === 3 ? '#141A45' : 'transparent',
                  color: n === 3 ? '#FBF3E6' : '#141A45',
                  border: '1.5px solid ' + (n === 3 ? '#141A45' : 'rgba(20,26,69,0.25)'),
                  fontWeight: 700, fontFamily: 'Fraunces', fontSize: 16,
                }}>{n}</button>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: 12, background: 'rgba(233,185,73,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon.Euro size={14}/>
              <div style={{ fontSize: 12, flex: 1 }}>
                Trayecto: ~28 km · Combustible estimado <strong className="mono">7,80€</strong>/día
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 20px 26px',
        background: 'linear-gradient(180deg, rgba(251,243,230,0) 0%, #FBF3E6 35%)',
      }}>
        <Button block size="lg" onClick={doSearch}
          icon={myRole === 'driver' ? null : <Icon.Search size={16} color="#FBF3E6"/>}>
          {myRole === 'driver' ? 'Publicar alerta' : 'Buscar coincidencias'}
        </Button>
      </div>

      {/* Conflict modal */}
      {conflict && <ConflictModal onClose={() => setConflict(false)}/>}
    </div>
  );
};

const FromToRow = ({ icon, label, value, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
    <div style={{ width: 26, display: 'grid', placeItems: 'center' }}>{icon}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(20,26,69,0.55)', textTransform: 'uppercase' }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)}
        style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14, fontWeight: 600, color: '#141A45', padding: 0 }}/>
    </div>
    <Icon.Search size={16} color="rgba(20,26,69,0.45)"/>
  </div>
);

const TimeCard = ({ label, value, onChange, icon }) => (
  <div style={{ background: '#fff', borderRadius: 18, border: '1.5px solid #141A45', padding: '12px 14px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(20,26,69,0.6)', textTransform: 'uppercase' }}>
      {icon}{label}
    </div>
    <input className="mono" value={value} onChange={e => onChange(e.target.value)}
      style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: 24, fontWeight: 600, color: '#141A45', padding: '4px 0 0', fontFamily: 'JetBrains Mono' }}/>
  </div>
);

const ConflictModal = ({ onClose, onCancel, onKeep }) => (
  <div style={{
    position: 'absolute', inset: 0, background: 'rgba(20,26,69,0.55)',
    backdropFilter: 'blur(4px)', zIndex: 30,
    display: 'flex', alignItems: 'flex-end',
  }} onClick={onClose}>
    <div className="fade-up" onClick={e => e.stopPropagation()} style={{
      width: '100%', background: '#FBF3E6', borderRadius: '22px 22px 0 0',
      padding: '20px 22px 30px', borderTop: '1.5px solid #141A45',
    }}>
      <div style={{ width: 44, height: 5, background: 'rgba(20,26,69,0.2)', borderRadius: 5, margin: '0 auto 16px' }}/>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: '#E26B5A', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <Icon.Warning size={22} color="#FBF3E6"/>
        </div>
        <div style={{ flex: 1 }}>
          <div className="serif" style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.15 }}>
            Ya tienes un trayecto esos días
          </div>
          <div style={{ fontSize: 13, color: 'rgba(20,26,69,0.7)', marginTop: 6, lineHeight: 1.45 }}>
            <strong>Móstoles → Cantoblanco</strong>, 8:15 con Manolo Sánchez — L a V. ¿Quieres cancelarlo para crear este nuevo?
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
        <Button variant="secondary" block onClick={onClose}>Mantener actual</Button>
        <Button variant="danger" block onClick={onClose}>Cancelar y crear</Button>
      </div>
    </div>
  </div>
);

window.NewTripScreen = NewTripScreen;
window.ConflictModal = ConflictModal;
