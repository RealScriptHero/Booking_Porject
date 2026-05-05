const prisma = require('../prisma/prisma');

const OUT_OF_SCOPE_REPLY = 'Sorry, I can only help with reservations, menu, and bookings.';
const sessions = new Map();

const TABLES = [
  { table: 'Window Table', tableNumber: 1, capacity: 2 },
  { table: 'Window Table', tableNumber: 2, capacity: 2 },
  { table: 'Center Table', tableNumber: 3, capacity: 4 },
  { table: 'Center Table', tableNumber: 4, capacity: 4 },
  { table: 'Patio Table', tableNumber: 5, capacity: 4 },
  { table: 'Family Table', tableNumber: 6, capacity: 6 },
  { table: 'Family Table', tableNumber: 7, capacity: 6 },
  { table: 'VIP Table', tableNumber: 8, capacity: 8 }
];

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

function getSessionKey(sessionId, userId) {
  if (sessionId) return `session:${sessionId}`;
  if (userId) return `user:${userId}`;
  return 'anonymous';
}

function getSession(sessionKey) {
  if (!sessions.has(sessionKey)) {
    sessions.set(sessionKey, {
      pendingIntent: null,
      reservationDraft: {},
      pendingCalendarReservation: null
    });
  }
  return sessions.get(sessionKey);
}

function isAffirmative(message) {
  const text = normalizeText(message);
  const keywords = ['yes', 'yeah', 'yep', 'ok', 'okay', 'sure', 'add it', 'add', 'please do', 'do it', 'iwa', 'ah'];
  return keywords.some((keyword) => text === keyword || text.includes(keyword));
}

function isNegative(message) {
  const text = normalizeText(message);
  const keywords = ['no', 'nope', 'later', 'not now', 'maybe later', 'la', 'not yet'];
  return keywords.some((keyword) => text === keyword || text.includes(keyword));
}

function detectIntent(message) {
  const text = normalizeText(message);

  const greetingKeywords = ['hello', 'hi', 'hey', 'salam', 'bonjour'];
  const reservationKeywords = [
    'book',
    'booking',
    'reserve',
    'reservation',
    'table for',
    'book a table',
    'book table',
    'bghit reservation',
    'dir liya booking',
    'dir liya reservation',
    'حجز'
  ];
  const availabilityKeywords = [
    'available',
    'availability',
    'free table',
    'open table',
    'tables tonight',
    'table available',
    'which table',
    'table number',
    'say the tables',
    'متاح'
  ];
  const menuKeywords = ['menu', 'show menu', 'menu please', 'what do you have', 'what you have', 'chnou kayn f menu', 'food', 'dishes', 'meal'];
  const myReservationsKeywords = ['my reservation', 'my booking', 'my reservations', 'bookings', 'reservations list'];

  if (greetingKeywords.some((keyword) => text === keyword || text.startsWith(`${keyword} `))) return 'GREETING';
  if (reservationKeywords.some((keyword) => text.includes(keyword))) return 'CREATE_RESERVATION';
  if (availabilityKeywords.some((keyword) => text.includes(keyword))) return 'CHECK_AVAILABILITY';
  if (menuKeywords.some((keyword) => text.includes(keyword))) return 'GET_MENU';
  if (myReservationsKeywords.some((keyword) => text.includes(keyword))) return 'GET_USER_RESERVATIONS';
  return 'OUT_OF_SCOPE';
}

function parseGuests(message) {
  const text = normalizeText(message);
  const match = text.match(/(\d+)\s*(guest|guests|people|person|persons|ppl)/);
  if (match) return Number(match[1]);
  if (/^\d+$/.test(text)) return Number(text);
  return null;
}

function parseDate(message) {
  const text = normalizeText(message);
  const dateMatch = text.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (dateMatch) return dateMatch[1];

  const now = new Date();
  if (text.includes('today')) return now.toISOString().slice(0, 10);
  if (text.includes('tomorrow')) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  }
  if (text.includes('tonight')) return now.toISOString().slice(0, 10);
  return null;
}

function parseTime(message) {
  const text = normalizeText(message);
  const twelveHourMatch = text.match(/\b(1[0-2]|0?[1-9])(?::([0-5]\d))?\s?(am|pm)\b/);
  if (twelveHourMatch) {
    const hour = Number(twelveHourMatch[1]);
    const minutes = twelveHourMatch[2] || '00';
    const period = twelveHourMatch[3].toUpperCase();
    return `${hour}:${minutes} ${period}`;
  }

  const twentyFourHourMatch = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
  if (twentyFourHourMatch) {
    let hour = Number(twentyFourHourMatch[1]);
    const minutes = twentyFourHourMatch[2];
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${period}`;
  }

  return null;
}

async function findAvailableTables({ date, time, guests }) {
  const occupiedReservations = await prisma.reservation.findMany({
    where: {
      date: new Date(date),
      time,
      status: { not: 'CANCELLED' }
    },
    select: { tableNumber: true }
  });

  const occupiedNumbers = new Set(occupiedReservations.map((item) => item.tableNumber));
  return TABLES.filter((table) => table.capacity >= guests && !occupiedNumbers.has(table.tableNumber));
}

function parseTimeTo24Hour(value) {
  const source = String(value || '').trim();
  const twelveHour = source.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (twelveHour) {
    let hours = Number(twelveHour[1]);
    const minutes = Number(twelveHour[2]);
    const period = twelveHour[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
  }
  const twentyFourHour = source.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHour) {
    return { hours: Number(twentyFourHour[1]), minutes: Number(twentyFourHour[2]) };
  }
  return { hours: 19, minutes: 0 };
}

function formatGoogleCalendarDate(value) {
  return new Date(value).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function buildGoogleCalendarUrl(reservation) {
  const startDate = new Date(reservation.date);
  const { hours, minutes } = parseTimeTo24Hour(reservation.time);
  startDate.setHours(hours, minutes, 0, 0);
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 2);

  const details = [
    `Reservation ID: ${reservation.confirmationId}`,
    `Guest name: ${reservation.name || 'Guest'}`,
    `Number of guests: ${reservation.guests || 1}`,
    `Email: ${reservation.email || 'Not provided'}`
  ].join('\n');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    'Restaurant Reservation'
  )}&dates=${formatGoogleCalendarDate(startDate)}/${formatGoogleCalendarDate(endDate)}&details=${encodeURIComponent(
    details
  )}&location=${encodeURIComponent('The Gourmet Table, 123 Culinary Lane')}`;
}

async function handleCreateReservation({ session, userId, message }) {
  if (!userId) {
    return { reply: 'Please log in first so I can create a reservation for your account.' };
  }

  const draft = session.reservationDraft || {};
  draft.date = draft.date || parseDate(message);
  draft.time = draft.time || parseTime(message);
  draft.guests = draft.guests || parseGuests(message);
  session.reservationDraft = draft;

  if (!draft.date) {
    return { reply: 'Great! What date would you like? Please use YYYY-MM-DD, or say today/tomorrow.' };
  }

  if (!draft.time) {
    return { reply: 'Perfect. What time would you like your table?' };
  }

  if (!draft.guests) {
    return { reply: 'How many guests should I reserve for?' };
  }

  const availableTables = await findAvailableTables(draft);
  if (availableTables.length === 0) {
    session.pendingIntent = null;
    session.reservationDraft = {};
    return { reply: 'I could not find available tables for that slot. Please try a different time or date.' };
  }

  const selectedTable = availableTables[0];
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) {
    return { reply: 'I could not find your account. Please log in again and retry.' };
  }

  const reservation = await prisma.reservation.create({
    data: {
      confirmationId: `RES-${Date.now()}`,
      date: new Date(draft.date),
      time: draft.time,
      guests: Number(draft.guests),
      table: selectedTable.table,
      tableNumber: selectedTable.tableNumber,
      status: 'CONFIRMED',
      name: user.fullName || 'Guest',
      email: user.email,
      user: { connect: { id: user.id } }
    }
  });

  session.pendingIntent = null;
  session.reservationDraft = {};
  session.pendingCalendarReservation = {
    confirmationId: reservation.confirmationId,
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    name: reservation.name,
    email: reservation.email
  };

  return {
    reply: 'Your reservation is confirmed! 🎉\nWould you like me to add this to your calendar?'
  };
}

async function chatWithAssistant(req, res) {
  try {
    const { message, userId, sessionId } = req.body;
    const normalizedMessage = String(message || '').trim();
    if (!normalizedMessage) {
      return res.status(400).json({ reply: 'Please send a message so I can help.' });
    }

    const sessionKey = getSessionKey(sessionId, userId);
    const session = getSession(sessionKey);

    if (session.pendingCalendarReservation) {
      if (isAffirmative(normalizedMessage)) {
        const calendarUrl = buildGoogleCalendarUrl(session.pendingCalendarReservation);
        session.pendingCalendarReservation = null;
        return res.json({
          reply: "Great! I've opened your calendar.\nDon't forget to save the event 😊",
          intent: 'CALENDAR_CONFIRMATION',
          calendarUrl
        });
      }

      if (isNegative(normalizedMessage)) {
        session.pendingCalendarReservation = null;
        return res.json({
          reply: 'No problem 😊\nLet me know if you need anything else!',
          intent: 'CALENDAR_CONFIRMATION'
        });
      }
    }

    const intent = session.pendingIntent || detectIntent(normalizedMessage);

    if (intent === 'OUT_OF_SCOPE') {
      session.pendingIntent = null;
      session.reservationDraft = {};
      return res.json({ reply: OUT_OF_SCOPE_REPLY, intent });
    }

    if (intent === 'GREETING') {
      session.pendingIntent = null;
      session.reservationDraft = {};
      return res.json({
        reply: 'Hello! 👋 I can help you with reservations, menu, and available tables. What would you like to do?',
        intent
      });
    }

    if (intent === 'GET_MENU') {
      const menuItems = await prisma.menu.findMany({
        orderBy: [{ category: 'asc' }, { name: 'asc' }]
      });
      if (!menuItems.length) {
        return res.json({ reply: 'Menu is not available yet', intent, data: [] });
      }

      const emojiByCategory = {
        Appetizers: '🥗',
        'Main Courses': '🍽️',
        Desserts: '🍰',
        Drinks: '🍹',
        Specials: '⭐'
      };

      const summary = menuItems
        .map((item) => `${emojiByCategory[item.category] || '🍴'} ${item.name} - $${Number(item.price).toFixed(2)}`)
        .join('\n');
      return res.json({ reply: `Here is our menu:\n${summary}`, intent, data: menuItems });
    }

    if (intent === 'CHECK_AVAILABILITY') {
      const date = parseDate(normalizedMessage) || new Date().toISOString().slice(0, 10);
      const time = parseTime(normalizedMessage) || '7:00 PM';
      const guests = parseGuests(normalizedMessage) || 2;
      const availableTables = await findAvailableTables({ date, time, guests });
      if (!availableTables.length) {
        return res.json({
          reply: `Sorry, I could not find available tables on ${date} at ${time} for ${guests} guests. Please try another time.`,
          intent,
          data: { date, time, guests, tables: [] }
        });
      }

      const listedTables = availableTables.map((table) => `#${table.tableNumber} (${table.table}, ${table.capacity} seats)`).join(', ');
      return res.json({
        reply: `Sure! I found ${availableTables.length} available table(s): ${listedTables}. Would you like me to book one?`,
        intent,
        data: { date, time, guests, tables: availableTables }
      });
    }

    if (intent === 'GET_USER_RESERVATIONS') {
      if (!userId) {
        return res.json({ reply: 'Please log in first so I can show your reservations.', intent });
      }
      const reservations = await prisma.reservation.findMany({
        where: { userId: Number(userId) },
        orderBy: { createdAt: 'desc' },
        take: 10
      });
      if (!reservations.length) {
        return res.json({ reply: 'You do not have reservations yet.', intent, data: [] });
      }
      const summary = reservations
        .map((item) => `${item.confirmationId} - ${new Date(item.date).toISOString().slice(0, 10)} at ${item.time}`)
        .join('\n');
      return res.json({ reply: `Here are your latest reservations:\n${summary}`, intent, data: reservations });
    }

    if (intent === 'CREATE_RESERVATION') {
      session.pendingIntent = 'CREATE_RESERVATION';
      if (!session.reservationDraft?.date && !session.reservationDraft?.time && !session.reservationDraft?.guests) {
        const warmup = detectIntent(normalizedMessage) === 'CREATE_RESERVATION';
        if (warmup) {
          // keep friendly booking flow tone
          session.reservationDraft = session.reservationDraft || {};
        }
      }
      const result = await handleCreateReservation({ session, userId, message: normalizedMessage });
      return res.json({ ...result, intent });
    }

    return res.json({ reply: OUT_OF_SCOPE_REPLY, intent: 'OUT_OF_SCOPE' });
  } catch (error) {
    console.error('chatWithAssistant error', error);
    res.status(500).json({ reply: 'Unable to process chat request right now.' });
  }
}

module.exports = {
  chatWithAssistant
};
