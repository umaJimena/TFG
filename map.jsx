// Icon set — hand-tuned 1.75px stroke, ink color
const Icon = {
  Home: ({ size=22, color='currentColor', filled=false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:'none'} stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 10.5 12 3.5l8.5 7M5 9.5V20h14V9.5"/><path d="M10 20v-5h4v5"/>
    </svg>
  ),
  Chat: ({ size=22, color='currentColor', filled=false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:'none'} stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6.5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-4.5L7.5 21v-3H7a3 3 0 0 1-3-3V6.5Z"/>
    </svg>
  ),
  User: ({ size=22, color='currentColor', filled=false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:'none'} stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.5" r="4"/><path d="M4 20c1-4.5 4.5-6.5 8-6.5s7 2 8 6.5"/>
    </svg>
  ),
  Plus: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
  ),
  ChevronRight: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
  ),
  ChevronDown: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
  ),
  ChevronLeft: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
  ),
  Close: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
  ),
  Pin: ({ size=16, color='currentColor', filled=false }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:'none'} stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>
    </svg>
  ),
  Clock: ({ size=16, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
    </svg>
  ),
  Calendar: ({ size=16, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>
    </svg>
  ),
  Car: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14v3a1 1 0 0 0 1 1h2v-2h10v2h2a1 1 0 0 0 1-1v-3"/>
      <path d="M4 14l2-5a2 2 0 0 1 2-1.5h8a2 2 0 0 1 2 1.5l2 5"/>
      <circle cx="7.5" cy="14.5" r="1.2"/><circle cx="16.5" cy="14.5" r="1.2"/>
    </svg>
  ),
  Users: ({ size=16, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3.25"/><path d="M3 19c.5-3 3-5 6-5s5.5 2 6 5"/><path d="M15 11a3 3 0 1 0 0-6"/><path d="M18 19c-.3-2-1.5-3.5-3-4.3"/>
    </svg>
  ),
  Euro: ({ size=14, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 6.5A7 7 0 0 0 6 12a7 7 0 0 0 11 5.5"/><path d="M4 10h9M4 14h9"/>
    </svg>
  ),
  Search: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
  ),
  Bell: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2H4.5L6 16Z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>
  ),
  Menu: ({ size=20, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
  ),
  Check: ({ size=16, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4.5 4.5L19 7"/></svg>
  ),
  Send: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12 20 4l-5 16-3-7-7-1Z"/></svg>
  ),
  Camera: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13" r="3.5"/></svg>
  ),
  CreditCard: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11h18M7 16h3"/></svg>
  ),
  Shield: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Z"/></svg>
  ),
  Logout: ({ size=18, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h4"/><path d="m15 8 4 4-4 4M9 12h10"/></svg>
  ),
  Swap: ({ size=16, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4v12m0 0-3-3m3 3 3-3M17 20V8m0 0-3 3m3-3 3 3"/></svg>
  ),
  Star: ({ size=14, color='currentColor', filled=true }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled?color:'none'} stroke={color} strokeWidth="1.5" strokeLinejoin="round"><path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.5 6.4 20.4l1-6.3L3 9.7l6.2-.9L12 3Z"/></svg>
  ),
  Route: ({ size=16, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M6 8.5v5A4.5 4.5 0 0 0 10.5 18H15"/></svg>
  ),
  Warning: ({ size=16, color='currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v5M12 17.5v.5"/></svg>
  ),
};
window.Icon = Icon;
