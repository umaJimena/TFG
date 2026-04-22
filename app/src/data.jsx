// Mock data

const USER = {
  name: "Elena",
  surname: "Ruiz",
  age: 21,
  email: "elena.ruiz@uam.es",
  rating: 4.8,
  trips: 42,
  verified: true,
  avatar: "EL",
  avatarColor: "#E9B949",
};

const ME_DRIVER = {
  car: { make: "Seat León", color: "Gris", plate: "4281 KTM", year: 2019 },
  rating: 4.9,
};

const DRIVERS = [
  { id: 'd1', name: "Manolo Sánchez", short: "Manolo S.", rating: 4.9, trips: 128, avatar: "MS", color: "#4E7D4B", car: "Seat Ibiza · Blanco · 2272 KHT", verified: true, age: 34 },
  { id: 'd2', name: "Pedro García",   short: "Pedro G.",  rating: 4.7, trips:  64, avatar: "PG", color: "#E26B5A", car: "VW Golf · Azul · 5519 LBK",    verified: true, age: 29 },
  { id: 'd3', name: "Laura Martín",   short: "Laura M.",  rating: 4.8, trips:  91, avatar: "LM", color: "#BFD7E8", car: "Renault Clio · Rojo · 8840 MCN",verified: true, age: 27 },
];

const PASSENGERS = [
  { id: 'p1', name: "Carlos Ruiz",     short: "Carlos", avatar: "CR", color: "#E9B949" },
  { id: 'p2', name: "Sofía Delgado",   short: "Sofía",  avatar: "SD", color: "#BFD7E8" },
  { id: 'p3', name: "Marco Ben-Amar",  short: "Marco",  avatar: "MB", color: "#4E7D4B" },
];

// Upcoming trips on Home
const UPCOMING = [
  {
    id: 't1',
    tone: 'mustard', // card color
    role: 'passenger',
    driver: DRIVERS[0],
    from: "Estación Móstoles Central",
    to: "Ciudad Universitaria · Cantoblanco",
    depart: "8:15",
    arrive: "9:00",
    returnTime: "17:30",
    days: ["L","M","X","J","V"],
    pickup: "Estación Renfe Móstoles",
    seatsTaken: 3,
    seatsTotal: 4,
    passengers: [PASSENGERS[0], PASSENGERS[1]],
    monthly: 62.40,
    perDay: 3.12,
    nextDate: "Mañana, mar 23 abr",
    distanceKm: 28,
    durationMin: 42,
  },
  {
    id: 't2',
    tone: 'leaf',
    role: 'passenger',
    driver: DRIVERS[1],
    from: "Polígono Coslada Oeste",
    to: "Hospital La Paz",
    depart: "7:00",
    arrive: "7:40",
    returnTime: "15:20",
    days: ["L","M","X","J","V"],
    pickup: "Avenida de la Constitución 12",
    seatsTaken: 2,
    seatsTotal: 4,
    passengers: [PASSENGERS[2]],
    monthly: 58.00,
    perDay: 2.90,
    nextDate: "Jue 25 abr",
    distanceKm: 21,
    durationMin: 35,
  },
];

// Match results for demo search
const MATCHES = [
  {
    id: 'm1',
    driver: DRIVERS[0],
    from: "Estación Renfe Móstoles",
    to: "Ciudad Universitaria",
    depart: "8:15", arrive: "9:00",
    returnTime: "17:30",
    seatsTaken: 2, seatsTotal: 4,
    monthly: 62.40, perDay: 3.12,
    days: ["L","M","X","J","V"],
    matchPct: 98,
    detour: "+3 min",
    pitch: "Mismo punto de origen, llega 5 min antes.",
  },
  {
    id: 'm2',
    driver: DRIVERS[1],
    from: "Parking Carrefour Móstoles",
    to: "Facultad Ciencias · UAM",
    depart: "8:05", arrive: "9:02",
    returnTime: "17:45",
    seatsTaken: 1, seatsTotal: 3,
    monthly: 72.00, perDay: 3.60,
    days: ["L","M","X","J","V"],
    matchPct: 91,
    detour: "+7 min",
    pitch: "Desvía 1 km hasta tu portal.",
  },
  {
    id: 'm3',
    driver: DRIVERS[2],
    from: "Metro Pradillo · Móstoles",
    to: "Ciudad Universitaria",
    depart: "7:45", arrive: "8:55",
    returnTime: "17:00",
    seatsTaken: 3, seatsTotal: 4,
    monthly: 54.00, perDay: 2.70,
    days: ["L","M","X","J","V"],
    matchPct: 86,
    detour: "+12 min",
    pitch: "Más barato pero sale 30 min antes.",
  },
];

// Chat threads
const THREADS = [
  {
    id: 'c1', tripId: 't1', title: "Móstoles → Cantoblanco",
    members: [DRIVERS[0], PASSENGERS[0], PASSENGERS[1]],
    color: "#E9B949",
    unread: 2,
    last: "Manolo: Mañana salgo 5 min antes, aviso.",
    time: "21:04",
    messages: [
      { from: 'd1', text: "Buenas a todos 👋 Mañana salida normal 8:15 en la estación.", time: "20:55" },
      { from: 'p1', text: "Perfecto, nos vemos.", time: "20:58" },
      { from: 'me', text: "Yo llegaré 2 min tarde, pido disculpas.", time: "21:00" },
      { from: 'd1', text: "Tranqui, te esperamos en el parking de buses.", time: "21:01" },
      { from: 'd1', text: "Por cierto, el jueves salgo 5 min antes, hay una reunión.", time: "21:04" },
    ],
  },
  {
    id: 'c2', tripId: 't2', title: "Coslada → La Paz",
    members: [DRIVERS[1], PASSENGERS[2]],
    color: "#4E7D4B",
    unread: 0,
    last: "Tú: Gracias Pedro, hasta mañana.",
    time: "Ayer",
    messages: [
      { from: 'd2', text: "Mañana toca, ¿todo bien?", time: "18:12" },
      { from: 'me', text: "Sí, gracias Pedro. Hasta mañana.", time: "18:15" },
    ],
  },
  {
    id: 'c3', tripId: null, title: "Soporte Conect_Car",
    members: [{ id: 'support', name: "Equipo Conect_Car", short: "Soporte", avatar: "CC", color: "#141A45" }],
    color: "#141A45",
    unread: 0,
    last: "Soporte: Ya está solucionado 🙌",
    time: "lun",
    isSupport: true,
    messages: [
      { from: 'me', text: "No me carga el pago del viernes.", time: "lun 10:04" },
      { from: 'support', text: "Revisado. Era un retry pendiente, ya está solucionado 🙌", time: "lun 10:22" },
    ],
  },
];

const DAYS_FULL = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
const DAYS_SHORT = ["L","M","X","J","V","S","D"];

Object.assign(window, { USER, ME_DRIVER, DRIVERS, PASSENGERS, UPCOMING, MATCHES, THREADS, DAYS_FULL, DAYS_SHORT });
