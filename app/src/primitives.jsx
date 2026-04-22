// Small shared UI primitives

const Avatar = ({ initials, color = "#E9B949", size = 40, border = false, ring = false }) => (
  <div style={{
    width: size, height: size, borderRadius: size,
    background: color, color: '#141A45',
    display: 'grid', placeItems: 'center',
    fontFamily: "'Fraunces', serif", fontWeight: 600,
    fontSize: size * 0.38, letterSpacing: '-0.02em',
    border: border ? '1.5px solid #141A45' : 'none',
    boxShadow: ring ? '0 0 0 3px #FBF3E6, 0 0 0 4px rgba(20,26,69,0.2)' : 'none',
    flexShrink: 0,
  }}>{initials}</div>
);

const AvatarStack = ({ users, size = 28, max = 3 }) => {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;
  return (
    <div style={{ display: 'flex' }}>
      {shown.map((u, i) => (
        <div key={u.id || i} style={{ marginLeft: i === 0 ? 0 : -size*0.35 }}>
          <Avatar initials={u.avatar} color={u.color} size={size} border />
        </div>
      ))}
      {extra > 0 && (
        <div style={{
          marginLeft: -size*0.35,
          width: size, height: size, borderRadius: size,
          background: '#FBF3E6', border: '1.5px solid #141A45', color: '#141A45',
          display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
        }}>+{extra}</div>
      )}
    </div>
  );
};

const DaysPill = ({ days, active = null, onToggle = null, size = 'md', tone = 'ink' }) => {
  const all = ["L","M","X","J","V","S","D"];
  const dim = size === 'sm' ? 22 : (size === 'lg' ? 32 : 28);
  return (
    <div style={{ display: 'flex', gap: size==='lg' ? 8 : 6 }}>
      {all.map(d => {
        const on = days.includes(d);
        const bg = tone === 'ink' ? '#141A45' : '#fff';
        const fg = tone === 'ink' ? '#FBF3E6' : '#141A45';
        return (
          <div
            key={d}
            onClick={onToggle ? () => onToggle(d) : undefined}
            className={onToggle ? 'pressable' : ''}
            style={{
              width: dim, height: dim, borderRadius: dim,
              display: 'grid', placeItems: 'center',
              fontSize: size === 'lg' ? 13 : 11, fontWeight: 700,
              background: on ? bg : 'transparent',
              color: on ? fg : 'rgba(20,26,69,0.45)',
              border: on ? `1.5px solid ${bg}` : '1.5px solid rgba(20,26,69,0.18)',
            }}
          >{d}</div>
        );
      })}
    </div>
  );
};

const Button = ({ children, variant = 'primary', block = false, onClick, style = {}, size = 'md', icon = null }) => {
  const base = {
    height: size === 'lg' ? 54 : (size === 'sm' ? 36 : 46),
    padding: size === 'sm' ? '0 14px' : '0 20px',
    borderRadius: 14,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'Inter', fontWeight: 600, fontSize: size === 'sm' ? 13 : 15,
    border: 'none', cursor: 'pointer', width: block ? '100%' : 'auto',
  };
  const v = {
    primary: { background: '#141A45', color: '#FBF3E6' },
    secondary: { background: '#FBF3E6', color: '#141A45', border: '1.5px solid #141A45' },
    ghost: { background: 'transparent', color: '#141A45' },
    danger: { background: '#E26B5A', color: '#FBF3E6' },
    mustard: { background: '#E9B949', color: '#141A45' },
  }[variant];
  return (
    <button style={{...base, ...v, ...style}} onClick={onClick}>
      {icon}{children}
    </button>
  );
};

const Field = ({ label, value, onChange, placeholder, type = "text", suffix = null, icon = null }) => (
  <label style={{ display: 'block' }}>
    <div style={{
      fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
      color: 'rgba(20,26,69,0.6)', marginBottom: 6,
    }}>{label}</div>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#fff', border: '1.5px solid #141A45',
      borderRadius: 14, padding: '0 14px', height: 48,
    }}>
      {icon}
      <input
        type={type} value={value || ''} onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, border: 'none', outline: 'none', background: 'transparent',
          fontFamily: 'Inter', fontSize: 15, color: '#141A45',
        }}
      />
      {suffix}
    </div>
  </label>
);

// Bottom nav bar
const TabBar = ({ tab, onTab }) => {
  const items = [
    { id: 'home',    label: 'Inicio',  Icon: Icon.Home },
    { id: 'chat',    label: 'Chat',    Icon: Icon.Chat },
    { id: 'profile', label: 'Perfil',  Icon: Icon.User },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '10px 16px 22px',
      background: 'rgba(251,243,230,0.92)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid rgba(20,26,69,0.1)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      zIndex: 10,
    }}>
      {items.map(it => {
        const on = tab === it.id;
        return (
          <button key={it.id} onClick={() => onTab(it.id)} style={{
            background: 'transparent', border: 'none', padding: '6px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: on ? '#141A45' : 'rgba(20,26,69,0.4)',
          }}>
            <it.Icon size={24} filled={on && it.id !== 'chat'} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.02em' }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// Top header used on several screens
const ScreenHeader = ({ title, subtitle, onBack, right = null, sticky = true, serif = true }) => (
  <div style={{
    position: sticky ? 'sticky' : 'static', top: 0, zIndex: 5,
    padding: '8px 20px 14px',
    background: 'linear-gradient(180deg, #FBF3E6 75%, rgba(251,243,230,0) 100%)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 36 }}>
      {onBack ? (
        <button onClick={onBack} className="pressable" style={{
          width: 36, height: 36, borderRadius: 36, border: '1.5px solid #141A45',
          background: '#fff', display: 'grid', placeItems: 'center',
        }}>
          <Icon.ChevronLeft size={18} color="#141A45" />
        </button>
      ) : <div style={{ width: 36 }} />}
      <div style={{ flex: 1 }} />
      <div>{right}</div>
    </div>
    <div style={{ marginTop: 8 }}>
      {subtitle && <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.6)', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600 }}>{subtitle}</div>}
      <div className={serif ? 'serif' : ''} style={{
        fontSize: serif ? 34 : 26, fontWeight: serif ? 500 : 700, lineHeight: 1.05, letterSpacing: serif ? '-0.02em' : '-0.01em',
        marginTop: 2,
      }}>{title}</div>
    </div>
  </div>
);

const Chip = ({ children, tone = 'ink', style = {} }) => {
  const styles = {
    ink:     { background: '#141A45', color: '#FBF3E6' },
    mustard: { background: '#E9B949', color: '#4A3510' },
    leaf:    { background: '#4E7D4B', color: '#FBF3E6' },
    coral:   { background: '#E26B5A', color: '#FBF3E6' },
    ghost:   { background: 'rgba(20,26,69,0.08)', color: '#141A45' },
    cream:   { background: '#FBF3E6', color: '#141A45', border: '1px solid rgba(20,26,69,0.18)' },
  };
  return <span className="chip" style={{ ...styles[tone], ...style }}>{children}</span>;
};

Object.assign(window, { Avatar, AvatarStack, DaysPill, Button, Field, TabBar, ScreenHeader, Chip });
