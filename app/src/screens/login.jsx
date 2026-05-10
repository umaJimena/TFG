// Login / Signup screen
const LoginScreen = ({ mode = 'login', onAuth, onSwitch }) => {
  const [email, setEmail] = React.useState(mode === 'login' ? 'elena.ruiz@uam.es' : '');
  const [name, setName]   = React.useState('');
  const [pass, setPass]   = React.useState(mode === 'login' ? '••••••••' : '');

  const signup = mode === 'signup';

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: '#FBF3E6',
      padding: '8px 28px 24px',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 4 }}>
        <button onClick={onSwitch} className="pressable" style={{
          background: 'transparent', border: 'none', color: '#141A45', fontWeight: 600, fontSize: 14,
        }}>{signup ? 'Log in' : 'Sign up'}</button>
      </div>

      {/* Brand mark */}
      <div style={{ marginTop: 26, textAlign: 'center' }}>
        <div style={{
          width: 66, height: 66, margin: '0 auto',
          borderRadius: 20, background: '#141A45',
          display: 'grid', placeItems: 'center',
          boxShadow: '0 10px 30px rgba(20,26,69,0.25)',
        }}>
          <svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="#FBF3E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="9" r="2"/><circle cx="24" cy="23" r="2"/>
            <path d="M8 11v6a6 6 0 0 0 6 6h10"/>
          </svg>
        </div>
        <div className="serif" style={{ fontSize: 34, fontWeight: 500, marginTop: 20, letterSpacing: '-0.02em', lineHeight: 1 }}>
          {signup ? 'Únete a' : 'Bienvenida a'}
        </div>
        <div className="serif" style={{ fontSize: 42, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 2 }}>
          Conect_Car
        </div>
        <div style={{ fontSize: 13, color: 'rgba(20,26,69,0.65)', marginTop: 10, lineHeight: 1.4 }}>
          {"\n"}
        </div>
      </div>

      {/* Form */}
      <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Field label="Email" value={email} onChange={setEmail} placeholder="tu@correo.com"
          suffix={email ? <Icon.Check size={16} color="#4E7D4B"/> : null}/>
        {signup && <Field label="Nombre" value={name} onChange={setName} placeholder="Cómo te llamamos"/>}
        <Field label="Contraseña" value={pass} onChange={setPass} placeholder="Mínimo 8 caracteres" type="password"
          suffix={!signup ? <span style={{ fontSize: 11, fontWeight: 600, color: '#141A45', letterSpacing: '0.04em' }}>{"\n"}</span> : null}/>
      </div>

      <div style={{ marginTop: 22 }}>
        <Button block size="lg" onClick={onAuth}>{signup ? 'Crear cuenta' : 'Entrar'}</Button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 18, fontSize: 12, color: 'rgba(20,26,69,0.55)', letterSpacing: '0.04em' }}>
        O continúa con
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        <button className="pressable" style={{
          height: 46, borderRadius: 14, background: '#FBF3E6',
          border: '1.5px solid #141A45', fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#141A45" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.4h3.2c1.9-1.7 3-4.3 3-7.3Z"/><path fill="#141A45" d="M12 22c2.7 0 4.9-.9 6.6-2.4l-3.2-2.4c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3v2.5A10 10 0 0 0 12 22Z" opacity=".8"/><path fill="#141A45" d="M6.4 14.1A6 6 0 0 1 6 12c0-.7.1-1.5.4-2.1V7.4H3a10 10 0 0 0 0 9.2l3.4-2.5Z" opacity=".6"/><path fill="#141A45" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3 7.4l3.4 2.5A6 6 0 0 1 12 6Z" opacity=".4"/></svg>
          Google
        </button>
        <button className="pressable" style={{
          height: 46, borderRadius: 14, background: '#141A45', color: '#FBF3E6',
          border: 'none', fontFamily: 'Inter', fontWeight: 600, fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="14" height="16" viewBox="0 0 24 28" fill="#FBF3E6"><path d="M17.5 14.8c0-3.3 2.7-4.9 2.8-5-1.5-2.2-3.9-2.5-4.7-2.5-2-.2-3.9 1.2-4.9 1.2s-2.6-1.2-4.3-1.1c-2.2 0-4.2 1.3-5.3 3.3-2.3 4-.6 9.9 1.6 13.1 1.1 1.6 2.4 3.4 4.1 3.3 1.6-.1 2.2-1 4.1-1s2.5 1 4.3 1c1.8 0 2.9-1.6 4-3.2 1.2-1.8 1.8-3.6 1.8-3.7-.1 0-3.4-1.3-3.5-5.4ZM14.3 5.3c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.9.9-3.8 2-.8 1-1.5 2.5-1.3 4 1.4.1 2.9-.7 3.8-1.9Z"/></svg>
          Apple
        </button>
      </div>

      <div style={{ flex: 1 }}/>

      <div style={{ textAlign: 'center', fontSize: 11, color: 'rgba(20,26,69,0.55)', lineHeight: 1.5 }}>
        Al continuar, aceptas los <u>Términos</u> y la <u>Política de Privacidad</u>.
      </div>
    </div>
  );
};

window.LoginScreen = LoginScreen;
