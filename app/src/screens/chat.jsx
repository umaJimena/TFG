// Chat — list + conversation
const ChatScreen = ({ onBack, initialThread = null, onOpenTrip }) => {
  const [activeId, setActiveId] = React.useState(initialThread);
  const [draft, setDraft] = React.useState("");
  const [threads, setThreads] = React.useState(THREADS);
  const active = threads.find(t => t.id === activeId);

  const send = () => {
    if (!draft.trim() || !active) return;
    const updated = threads.map(t => t.id === active.id
      ? { ...t, messages: [...t.messages, { from: 'me', text: draft, time: 'ahora' }], last: 'Tú: ' + draft, time: 'ahora' }
      : t);
    setThreads(updated); setDraft("");
  };

  if (!active) {
    return (
      <div style={{ position: 'absolute', inset: 0, background: '#FBF3E6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '10px 22px 12px' }}>
          <div className="serif" style={{ fontSize: 34, fontWeight: 500, letterSpacing: '-0.02em' }}>Chat</div>
          <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.6)', marginTop: 4 }}>Coordínate con tu grupo o contacta a soporte</div>
        </div>
        <div style={{ padding: '0 22px 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1.5px solid #141A45', borderRadius: 14, padding: '0 14px', height: 44 }}>
            <Icon.Search size={18}/>
            <input placeholder="Buscar conversación..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14 }}/>
          </div>
        </div>
        <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 12px 110px' }}>
          {threads.map(th => (
            <button key={th.id} onClick={() => setActiveId(th.id)} className="pressable" style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 12px',
              background: 'transparent', border: 'none', borderRadius: 14, textAlign: 'left',
            }}>
              <div style={{ position: 'relative' }}>
                {th.isSupport
                  ? <div style={{ width: 50, height: 50, borderRadius: 50, background: '#141A45', display: 'grid', placeItems: 'center' }}><Icon.Shield size={22} color="#FBF3E6"/></div>
                  : <div style={{ width: 50, height: 50, borderRadius: 50, background: th.color, display: 'grid', placeItems: 'center', color: th.color === '#141A45' ? '#FBF3E6' : '#141A45', fontFamily: 'Fraunces', fontWeight: 600, fontSize: 17 }}>
                      {th.members[0].avatar}
                      {th.members.length > 1 && (
                        <div style={{ position: 'absolute', bottom: -2, right: -2 }}>
                          <Avatar initials={th.members[1].avatar} color={th.members[1].color} size={22} border/>
                        </div>
                      )}
                    </div>
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{th.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(20,26,69,0.5)' }}>{th.time}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
                  <div style={{ fontSize: 12, color: 'rgba(20,26,69,0.65)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220 }}>{th.last}</div>
                  {th.unread > 0 && (
                    <div style={{ background: '#E26B5A', color: '#FBF3E6', minWidth: 18, height: 18, borderRadius: 18, padding: '0 6px', fontSize: 10, fontWeight: 700, display: 'grid', placeItems: 'center' }}>{th.unread}</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Conversation view
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#FBF3E6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top */}
      <div style={{ padding: '8px 16px 10px', borderBottom: '1px solid rgba(20,26,69,0.1)', background: '#FBF3E6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setActiveId(null)} className="pressable" style={{ width: 36, height: 36, borderRadius: 36, border: '1.5px solid #141A45', background: '#fff', display: 'grid', placeItems: 'center' }}><Icon.ChevronLeft size={18}/></button>
          <AvatarStack users={active.members} size={30} max={3}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{active.title}</div>
            <div style={{ fontSize: 11, color: 'rgba(20,26,69,0.6)' }}>{active.members.length} personas · activos ahora</div>
          </div>
          <button onClick={onOpenTrip} className="pressable" style={{ width: 36, height: 36, borderRadius: 36, background: '#fff', border: '1.5px solid #141A45', display: 'grid', placeItems: 'center' }}><Icon.Route size={16}/></button>
        </div>
      </div>

      {/* Trip ref */}
      {active.tripId && (
        <div style={{ padding: '10px 18px 0' }}>
          <div style={{ background: active.color, color: active.color === '#4E7D4B' ? '#FBF3E6' : '#141A45', borderRadius: 14, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon.Route size={14}/>
            <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>{active.title} · L-V · 8:15</div>
            <Icon.ChevronRight size={14}/>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="phone-scroll" style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 110px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(20,26,69,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>— Hoy —</div>
        {active.messages.map((msg, i) => {
          const mine = msg.from === 'me';
          const author = !mine && active.members.find(m => m.id === msg.from);
          return (
            <div key={i} style={{ display: 'flex', gap: 8, flexDirection: mine ? 'row-reverse' : 'row' }}>
              {!mine && author && <Avatar initials={author.avatar} color={author.color || '#E9B949'} size={28}/>}
              {!mine && !author && <div style={{ width: 28 }}/>}
              <div style={{ maxWidth: '72%' }}>
                {!mine && author && <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(20,26,69,0.55)', marginBottom: 3, marginLeft: 10 }}>{author.short || author.name}</div>}
                <div style={{
                  padding: '9px 12px', borderRadius: 16,
                  background: mine ? '#141A45' : '#fff',
                  color: mine ? '#FBF3E6' : '#141A45',
                  border: mine ? 'none' : '1px solid rgba(20,26,69,0.1)',
                  borderTopRightRadius: mine ? 4 : 16,
                  borderTopLeftRadius: !mine ? 4 : 16,
                  fontSize: 13.5, lineHeight: 1.4,
                }}>{msg.text}</div>
                <div style={{ fontSize: 10, color: 'rgba(20,26,69,0.45)', marginTop: 3, textAlign: mine ? 'right' : 'left', padding: '0 8px' }}>{msg.time}</div>
              </div>
            </div>
          );
        })}
        {/* System notice example */}
        {active.id === 'c1' && (
          <div style={{ background: 'rgba(233,185,73,0.2)', borderRadius: 12, padding: '10px 12px', fontSize: 11, color: '#4A3510', display: 'flex', alignItems: 'center', gap: 8, border: '1px dashed rgba(74,53,16,0.3)' }}>
            <Icon.Warning size={14} color="#4A3510"/>
            <span><strong>Sofía</strong> ha marcado que hoy no asistirá — pago devuelto automáticamente.</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 14px 24px', background: 'rgba(251,243,230,0.95)', backdropFilter: 'blur(8px)', borderTop: '1px solid rgba(20,26,69,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="pressable" style={{ width: 38, height: 38, borderRadius: 38, background: '#fff', border: '1.5px solid rgba(20,26,69,0.2)', display: 'grid', placeItems: 'center' }}>
            <Icon.Plus size={18}/>
          </button>
          <div style={{ flex: 1, background: '#fff', border: '1.5px solid rgba(20,26,69,0.2)', borderRadius: 22, padding: '0 14px', height: 42, display: 'flex', alignItems: 'center' }}>
            <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Mensaje..." style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Inter', fontSize: 14 }}/>
          </div>
          <button onClick={send} className="pressable" style={{ width: 42, height: 42, borderRadius: 42, background: '#141A45', border: 'none', display: 'grid', placeItems: 'center' }}>
            <Icon.Send size={18} color="#FBF3E6"/>
          </button>
        </div>
      </div>
    </div>
  );
};

window.ChatScreen = ChatScreen;
