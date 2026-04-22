// App shell — canvas of phone frames, each showing a stage in the flow,
// with a shared top bar, role toggle, and Tweaks panel.

const { useState, useEffect } = React;

const FRAMES = [
  { id: 'login',      label: '01 · Login',         stage: 'login' },
  { id: 'signup',     label: '02 · Sign up',       stage: 'signup' },
  { id: 'onboarding', label: '03 · Onboarding',    stage: 'onboarding' },
  { id: 'home',       label: '04 · Home',          stage: 'home' },
  { id: 'newtrip',    label: '05 · Nuevo trayecto',stage: 'newtrip' },
  { id: 'conflict',   label: '06 · Conflicto',     stage: 'conflict' },
  { id: 'matches',    label: '07 · Coincidencias', stage: 'matches' },
  { id: 'detail',     label: '08 · Reserva',       stage: 'detail' },
  { id: 'chat-list',  label: '09 · Chat (lista)',  stage: 'chat-list' },
  { id: 'chat-conv',  label: '10 · Chat grupo',    stage: 'chat-conv' },
  { id: 'chat-sup',   label: '11 · Soporte',       stage: 'chat-support' },
  { id: 'profile',    label: '12 · Perfil',        stage: 'profile' },
];

function PhoneFrame({ stage, role, setRole, tweaks }) {
  // Each phone is a self-contained fake app state
  const [tab, setTab] = useState(
    stage === 'chat-list' || stage === 'chat-conv' || stage === 'chat-support' ? 'chat' :
    stage === 'profile' ? 'profile' : 'home'
  );
  const [currentStage, setCurrentStage] = useState(stage);

  useEffect(() => { setCurrentStage(stage); }, [stage]);

  const go = s => setCurrentStage(s);

  let content = null;
  let showTab = true;

  switch (currentStage) {
    case 'login':
      content = <LoginScreen mode="login" onAuth={() => go('onboarding')} onSwitch={() => go('signup')}/>;
      showTab = false; break;
    case 'signup':
      content = <LoginScreen mode="signup" onAuth={() => go('onboarding')} onSwitch={() => go('login')}/>;
      showTab = false; break;
    case 'onboarding':
      content = <OnboardingScreen role={role} onDone={() => go('home')}/>;
      showTab = false; break;
    case 'home':
      content = <HomeScreen role={role} onRoleToggle={() => setRole(role === 'driver' ? 'passenger' : 'driver')}
        onNew={() => go('newtrip')} onOpenTrip={() => go('detail')} onTab={setTab}/>;
      break;
    case 'newtrip':
      content = <NewTripScreen role={role} onBack={() => go('home')} onSearch={() => go('matches')}/>;
      showTab = false; break;
    case 'conflict':
      content = (
        <div style={{ position: 'absolute', inset: 0 }}>
          <NewTripScreen role={role} onBack={() => go('home')} onSearch={() => go('matches')}/>
          <ConflictModal onClose={() => go('newtrip')}/>
        </div>
      );
      showTab = false; break;
    case 'matches':
      content = <MatchesScreen onBack={() => go('newtrip')} onReserve={() => go('detail')}/>;
      showTab = false; break;
    case 'detail':
      content = <TripDetailScreen trip={UPCOMING[0]} onBack={() => go('home')} onChat={() => go('chat-conv')}/>;
      showTab = false; break;
    case 'chat-list':
      content = <ChatScreen/>; break;
    case 'chat-conv':
      content = <ChatScreen initialThread="c1" onOpenTrip={() => go('detail')}/>;
      showTab = false; break;
    case 'chat-support':
      content = <ChatScreen initialThread="c3"/>;
      showTab = false; break;
    case 'profile':
      content = <ProfileScreen role={role} onRoleToggle={() => setRole(role === 'driver' ? 'passenger' : 'driver')} onLogout={() => go('login')}/>;
      break;
    default: content = null;
  }

  // When a main tab is shown, tab switching goes to relevant stage
  useEffect(() => {
    if (!showTab) return;
    if (tab === 'home' && currentStage !== 'home') go('home');
    if (tab === 'chat' && !currentStage.startsWith('chat')) go('chat-list');
    if (tab === 'profile' && currentStage !== 'profile') go('profile');
  }, [tab]);

  const Device = window.IOSDevice;
  return (
    <Device width={390} height={844}>
      <IOSStatusBar/>
      <div style={{ position: 'absolute', inset: '47px 0 0', overflow: 'hidden', background: '#FBF3E6' }}>
        {content}
        {showTab && <TabBar tab={tab} onTab={setTab}/>}
      </div>
    </Device>
  );
}

function TweaksPanel({ tweaks, setTweaks, visible, onHide }) {
  if (!visible) return null;
  const setK = (k, v) => {
    const next = { ...tweaks, [k]: v }; setTweaks(next);
    window.parent && window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };
  const Swatch = ({ id, bg, label }) => (
    <button onClick={() => setK('palette', id)} className="pressable" style={{
      width: 58, height: 58, borderRadius: 14, border: tweaks.palette === id ? '2px solid #141A45' : '1.5px solid rgba(20,26,69,0.15)',
      background: bg, display: 'grid', placeItems: 'end center', padding: 6, color: '#141A45', fontSize: 10, fontWeight: 700,
    }}>{label}</button>
  );
  return (
    <div style={{
      position: 'fixed', right: 20, bottom: 20, width: 290, zIndex: 100,
      background: '#FBF3E6', border: '1.5px solid #141A45', borderRadius: 18,
      padding: 16, boxShadow: '0 24px 60px rgba(20,26,69,0.25)', color: '#141A45', fontFamily: 'Inter',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div className="serif" style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Tweaks</div>
        <button onClick={onHide} style={{ background: 'transparent', border: 'none', color: '#141A45', cursor: 'pointer' }}>
          <Icon.Close size={16}/>
        </button>
      </div>

      <TweakRow label="Paleta">
        <div style={{ display: 'flex', gap: 6 }}>
          <Swatch id="cream" bg="#FBF3E6" label="Cream"/>
          <Swatch id="white" bg="#FFFFFF" label="Blanco"/>
          <Swatch id="dark" bg="#141A45" label="Oscuro"/>
        </div>
      </TweakRow>

      <TweakRow label="Densidad">
        <Segmented value={tweaks.density} onChange={v => setK('density', v)} options={[
          { id: 'compact', label: 'Compacto' }, { id: 'cozy', label: 'Acogedor' },
        ]}/>
      </TweakRow>

      <TweakRow label="Estilo tarjeta">
        <Segmented value={tweaks.cardStyle} onChange={v => setK('cardStyle', v)} options={[
          { id: 'colorful', label: 'Colorful' }, { id: 'minimal', label: 'Minimal' },
        ]}/>
      </TweakRow>

      <TweakRow label="Tipografía">
        <Segmented value={tweaks.titleFont} onChange={v => setK('titleFont', v)} options={[
          { id: 'serif', label: 'Serif' }, { id: 'sans', label: 'Sans' },
        ]}/>
      </TweakRow>

      <TweakRow label="Rol demo">
        <Segmented value={tweaks.role} onChange={v => setK('role', v)} options={[
          { id: 'passenger', label: 'Pasajero' }, { id: 'driver', label: 'Conductor' },
        ]}/>
      </TweakRow>
    </div>
  );
}

const TweakRow = ({ label, children }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(20,26,69,0.55)', marginBottom: 6 }}>{label}</div>
    {children}
  </div>
);
const Segmented = ({ value, onChange, options }) => (
  <div style={{ display: 'flex', background: 'rgba(20,26,69,0.06)', borderRadius: 10, padding: 3 }}>
    {options.map(o => {
      const on = value === o.id;
      return (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          flex: 1, height: 32, borderRadius: 8,
          background: on ? '#141A45' : 'transparent', color: on ? '#FBF3E6' : '#141A45',
          border: 'none', fontWeight: 600, fontSize: 12, cursor: 'pointer',
        }}>{o.label}</button>
      );
    })}
  </div>
);

function applyPalette(p) {
  const root = document.documentElement.style;
  if (p === 'dark') { root.setProperty('--cream', '#F0E4D0'); document.body.style.background = '#141A45'; }
  else if (p === 'white') { document.body.style.background = '#EDEAE4'; }
  else { document.body.style.background = '#DDD3C3'; }
}

function App() {
  const [tweaks, setTweaks] = useState(window.TWEAKS_DEFAULTS);
  const [role, setRole] = useState(tweaks.role || 'passenger');
  const [tweakOpen, setTweakOpen] = useState(false);

  useEffect(() => { applyPalette(tweaks.palette); }, [tweaks.palette]);
  useEffect(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') setTweakOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweakOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent && window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className="canvas-bg" style={{ minHeight: '100vh', padding: '40px 0 60px' }}>
      {/* Title bar */}
      <div style={{ padding: '0 40px 28px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(20,26,69,0.55)', textTransform: 'uppercase' }}>
              Prototipo · App de car-sharing diario
            </div>
            <div className="serif" style={{ fontSize: 52, fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 6, color: '#141A45' }}>
              Conect_Car
            </div>
            <div style={{ fontSize: 14, color: 'rgba(20,26,69,0.65)', marginTop: 8, maxWidth: 620, lineHeight: 1.5 }}>
              Conecta a personas que hacen el mismo trayecto cada día.
              Flujo completo: registro → búsqueda/publicación → coincidencias → reserva con pago automático → chat del grupo.
              <span style={{ opacity: 0.7 }}> Toca cualquier pantalla para interactuar.</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#FBF3E6', border: '1.5px solid #141A45',
              borderRadius: 999, padding: 4,
            }}>
              {[{id:'passenger',l:'Pasajero',I:Icon.Users},{id:'driver',l:'Conductor',I:Icon.Car}].map(o => {
                const on = role === o.id;
                return (
                  <button key={o.id} onClick={() => setRole(o.id)} className="pressable" style={{
                    height: 36, padding: '0 14px', borderRadius: 999, border: 'none',
                    background: on ? '#141A45' : 'transparent', color: on ? '#FBF3E6' : '#141A45',
                    fontWeight: 600, fontSize: 13, fontFamily: 'Inter',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                  }}>
                    <o.I size={14} color={on ? '#FBF3E6' : '#141A45'}/> {o.l}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Phone row — horizontally scrollable */}
      <div className="phone-row" style={{
        display: 'flex', gap: 30, padding: '20px 60px 40px',
        overflowX: 'auto', overflowY: 'visible',
      }}>
        {FRAMES.map(f => (
          <div key={f.id} data-screen-label={f.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, flexShrink: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(20,26,69,0.65)' }}>
              {f.label}
            </div>
            <PhoneFrame stage={f.stage} role={role} setRole={setRole} tweaks={tweaks}/>
          </div>
        ))}
      </div>

      {/* Footer tip */}
      <div style={{ padding: '0 40px', maxWidth: 900, margin: '20px auto 0', fontSize: 12, color: 'rgba(20,26,69,0.55)', textAlign: 'center', lineHeight: 1.6 }}>
        Desliza horizontalmente para recorrer el flujo. Activa <strong>Tweaks</strong> en la barra para probar paletas, tipografía y cambiar el rol demo.
      </div>

      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} visible={tweakOpen} onHide={() => setTweakOpen(false)}/>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
