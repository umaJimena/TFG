// Onboarding — resumen: datos + verificación + (si driver) matrícula
const OnboardingScreen = ({ onDone, role }) => {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    nombre: "Elena", apellido: "Ruiz", dni: "51234567-Z",
    nacimiento: "12 / 03 / 2004",
    telefono: "+34 612 34 56 78",
    matricula: "4281 KTM", marca: "Seat León", color: "Gris", plazas: 3,
  });
  const isDriver = role === 'driver';
  const steps = isDriver
    ? ['Datos personales', 'Verificar edad', 'Tu coche', '¡Listo!']
    : ['Datos personales', 'Verificar edad', 'Preferencias', '¡Listo!'];

  const next = () => step < steps.length - 1 ? setStep(step + 1) : onDone();

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FBF3E6', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '8px 20px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button className="pressable" onClick={() => step ? setStep(step-1) : onDone()} style={{
            width: 36, height: 36, borderRadius: 36, border: '1.5px solid #141A45', background: '#fff', display: 'grid', placeItems: 'center',
          }}><Icon.ChevronLeft size={18}/></button>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(20,26,69,0.6)', letterSpacing: '0.08em' }}>
            {step + 1} / {steps.length}
          </div>
          <button className="pressable" onClick={onDone} style={{
            background: 'transparent', border: 'none', color: 'rgba(20,26,69,0.6)', fontSize: 13, fontWeight: 600,
          }}>Saltar</button>
        </div>
        {/* Progress */}
        <div style={{ display: 'flex', gap: 4, marginTop: 16 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 2,
              background: i <= step ? '#141A45' : 'rgba(20,26,69,0.12)',
              transition: 'background 300ms ease',
            }}/>
          ))}
        </div>
      </div>

      <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '10px 24px 30px' }}>
        <div className="fade-up" key={step}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(20,26,69,0.55)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Paso {step + 1}
          </div>
          <h2 className="serif" style={{ fontSize: 30, fontWeight: 500, margin: '4px 0 6px', letterSpacing: '-0.02em', lineHeight: 1.08 }}>
            {steps[step]}
          </h2>
          <div style={{ fontSize: 13, color: 'rgba(20,26,69,0.65)', marginBottom: 22, lineHeight: 1.5 }}>
            {step === 0 && "Antes de comenzar te vamos a pedir algunos datos."}
            {step === 1 && "Debes ser mayor de edad para reservar trayectos."}
            {step === 2 && (isDriver ? "Datos de tu coche. Revisaremos tu matrícula y permiso." : "Personaliza tu experiencia de viaje.")}
            {step === 3 && "Todo listo. Ya puedes buscar tu primer trayecto."}
          </div>

          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Contraseña" value={data.nombre} onChange={v => setData({...data, nombre: v})}/>
              <Field label="Apellidos" value={data.apellido} onChange={v => setData({...data, apellido: v})}/>
              <Field label="Teléfono" value={data.telefono} onChange={v => setData({...data, telefono: v})}/>
            </div>
          )}

          {step === 1 && (
            <div>
              <Field label="DNI / NIE" value={data.dni} onChange={v => setData({...data, dni: v})}/>
              <div style={{ height: 12 }}/>
              <Field label="Fecha nacimiento" value={data.nacimiento} onChange={v => setData({...data, nacimiento: v})} icon={<Icon.Calendar size={16} color="#141A45"/>}/>
              <div style={{ marginTop: 18, padding: 14, border: '1.5px dashed #141A45', borderRadius: 14, background: 'rgba(233,185,73,0.18)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 40, background: '#E9B949', display: 'grid', placeItems: 'center' }}>
                  <Icon.Camera size={20} color="#141A45"/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Foto del DNI</div>
                  <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.65)' }}>Frontal y trasera. Solo tú la verás.</div>
                </div>
                <Icon.ChevronRight size={16} color="#141A45"/>
              </div>
            </div>
          )}

          {step === 2 && isDriver && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Field label="Matrícula" value={data.matricula} onChange={v => setData({...data, matricula: v})} icon={<Icon.Car size={18} color="#141A45"/>}/>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label="Marca/Modelo" value={data.marca} onChange={v => setData({...data, marca: v})}/>
                <Field label="Color" value={data.color} onChange={v => setData({...data, color: v})}/>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(20,26,69,0.6)', marginBottom: 8 }}>Plazas disponibles</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1,2,3,4].map(n => (
                    <button key={n} onClick={() => setData({...data, plazas: n})} style={{
                      flex: 1, height: 56, borderRadius: 14,
                      background: data.plazas === n ? '#141A45' : '#fff',
                      color: data.plazas === n ? '#FBF3E6' : '#141A45',
                      border: '1.5px solid #141A45', fontWeight: 600, fontSize: 18, fontFamily: 'Fraunces',
                    }}>{n}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && !isDriver && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { i: '🎵', t: 'Música durante el trayecto', d: 'Prefiero algo de fondo' },
                { i: '🤫', t: 'Viajes silenciosos', d: 'Me gusta descansar' },
                { i: '💬', t: 'Charla tranquila', d: 'Un poco de conversación' },
                { i: '🐶', t: 'Amigo de mascotas', d: 'Sin problema con animales' },
              ].map((p, i) => (
                <label key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 14,
                  borderRadius: 14, background: '#fff', border: '1.5px solid #141A45',
                }}>
                  <div style={{ fontSize: 22 }}>{p.i}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.t}</div>
                    <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.6)' }}>{p.d}</div>
                  </div>
                  <div style={{
                    width: 22, height: 22, borderRadius: 22, border: '1.5px solid #141A45',
                    background: i === 2 ? '#141A45' : 'transparent', display: 'grid', placeItems: 'center',
                  }}>{i === 2 && <Icon.Check size={12} color="#FBF3E6"/>}</div>
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{
                width: 110, height: 110, borderRadius: 110, margin: '0 auto',
                background: '#E9B949', display: 'grid', placeItems: 'center',
                boxShadow: '0 16px 40px rgba(233,185,73,0.5)',
              }}>
                <Icon.Check size={50} color="#141A45"/>
              </div>
              <div className="serif" style={{ fontSize: 28, fontWeight: 500, marginTop: 24, letterSpacing: '-0.02em' }}>
                ¡Cuenta verificada!
              </div>
              <div style={{ fontSize: 14, color: 'rgba(20,26,69,0.65)', marginTop: 8, lineHeight: 1.5 }}>
                Hola {data.nombre}. Ya puedes publicar o buscar<br/>tu primer trayecto diario.
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '14px 24px 28px', background: '#FBF3E6', borderTop: '1px solid rgba(20,26,69,0.08)' }}>
        <Button block size="lg" onClick={next}>
          {'Empezar a usar Conect_Car'}
        </Button>
      </div>
    </div>
  );
};

window.OnboardingScreen = OnboardingScreen;
