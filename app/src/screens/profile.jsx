// Profile — ajustes, pago, privacidad, cuenta
const ProfileScreen = ({ onLogout, role, onRoleToggle }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FBF3E6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px 20px 120px' }}>
        {/* Profile header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <Avatar initials="EL" color="#E9B949" size={72} border/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="serif" style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em' }}>Elena Ruiz</div>
            <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.6)', marginTop: 2 }}>elena.ruiz@uam.es</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <Chip tone="leaf" style={{ background: '#4E7D4B', color: '#FBF3E6' }}>
                <Icon.Check size={11} color="#FBF3E6"/> Verificada
              </Chip>
              <Chip tone="cream"><Icon.Star size={11} color="#E9B949"/> 4.8 · 42 viajes</Chip>
            </div>
          </div>
        </div>

        {/* Role toggle prominent */}
        <div style={{ background: '#141A45', color: '#FBF3E6', borderRadius: 18, padding: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.65 }}>Rol activo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(251,243,230,0.15)', display: 'grid', placeItems: 'center' }}>
              {role === 'driver' ? <Icon.Car size={22} color="#FBF3E6"/> : <Icon.Users size={22} color="#FBF3E6"/>}
            </div>
            <div style={{ flex: 1 }}>
              <div className="serif" style={{ fontSize: 20, fontWeight: 500 }}>{role === 'driver' ? 'Conductor' : 'Pasajero'}</div>
              <div style={{ fontSize: 11, opacity: 0.65, marginTop: 1 }}>{role === 'driver' ? 'Publicas trayectos · Seat León · 3 plazas' : 'Buscas y te unes a trayectos'}</div>
            </div>
            <button onClick={onRoleToggle} className="pressable" style={{
              height: 36, padding: '0 12px', borderRadius: 36, background: '#FBF3E6', color: '#141A45', border: 'none', fontWeight: 600, fontSize: 12,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>
              <Icon.Swap size={14}/> Cambiar
            </button>
          </div>
        </div>

        {/* Stats band */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
          {[
            { n: '128€', l: 'Ahorro\neste mes' },
            { n: '42',   l: 'Viajes\ntotales' },
            { n: '18kg', l: 'CO₂\nevitado' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#fff', border: '1.5px solid rgba(20,26,69,0.1)', borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
              <div className="serif" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{s.n}</div>
              <div style={{ fontSize: 10, color: 'rgba(20,26,69,0.6)', fontWeight: 600, letterSpacing: '0.04em', marginTop: 2, whiteSpace: 'pre-line', lineHeight: 1.2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Payment section */}
        <Section title="Pago">
          <Row icon={<Icon.CreditCard size={18}/>} label="Métodos de pago" value="Visa •• 4281" accent="mustard"/>
          <Row icon={<Icon.Euro size={18}/>} label="Historial de cobros" value="12 este mes"/>
          <Row icon={<Icon.Calendar size={18}/>} label="Próximos pagos automáticos" value="mar 23 · 3,12€"/>
        </Section>

        {/* Account */}
        <Section title="Cuenta y privacidad">
          <Row icon={<Icon.User size={18}/>} label="Editar perfil"/>
          <Row icon={<Icon.Car size={18}/>} label="Mi coche" value="Seat León · 4281 KTM"/>
          <Row icon={<Icon.Shield size={18}/>} label="Verificación" value="DNI · carnet B" accent="leaf"/>
          <Row icon={<Icon.Bell size={18}/>} label="Notificaciones"/>
        </Section>

        {/* Support */}
        <Section title="Ayuda">
          <Row icon={<Icon.Chat size={18}/>} label="Contactar con soporte"/>
          <Row icon={<Icon.Warning size={18}/>} label="Reportar un problema"/>
          <Row icon={<Icon.Shield size={18}/>} label="Centro de seguridad"/>
        </Section>

        {/* Danger zone */}
        <div style={{ marginTop: 20 }}>
          <button onClick={onLogout} className="pressable" style={{
            width: '100%', height: 48, borderRadius: 14, background: 'transparent',
            border: '1.5px solid rgba(20,26,69,0.18)', color: '#141A45',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontWeight: 600, fontSize: 14,
          }}>
            <Icon.Logout size={16}/> Cerrar sesión
          </button>
          <button className="pressable" style={{
            width: '100%', height: 44, marginTop: 10, borderRadius: 14, background: 'transparent',
            border: 'none', color: '#E26B5A', fontWeight: 600, fontSize: 13,
          }}>Eliminar cuenta</button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: 'rgba(20,26,69,0.4)' }}>
          Conect_Car v1.0 · Hecho con café en Madrid
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{ marginTop: 20 }}>
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(20,26,69,0.55)', padding: '0 4px 8px' }}>{title}</div>
    <div style={{ background: '#fff', borderRadius: 16, border: '1.5px solid rgba(20,26,69,0.1)', overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);

const Row = ({ icon, label, value, accent }) => {
  const accentBg = { mustard: 'rgba(233,185,73,0.22)', leaf: 'rgba(78,125,75,0.18)' };
  return (
    <button className="pressable" style={{
      width: '100%', padding: '12px 14px', background: 'transparent', border: 'none',
      borderBottom: '1px solid rgba(20,26,69,0.08)', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: accent ? accentBg[accent] : 'rgba(20,26,69,0.06)', display: 'grid', placeItems: 'center' }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
        {value && <div style={{ fontSize: 11, color: 'rgba(20,26,69,0.6)', marginTop: 1 }}>{value}</div>}
      </div>
      <Icon.ChevronRight size={16} color="rgba(20,26,69,0.4)"/>
    </button>
  );
};

window.ProfileScreen = ProfileScreen;
