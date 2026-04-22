const prisma = require('../prisma/prisma');

async function getReservations(req, res) {
  try {
    const { email } = req.query;
    const where = email ? { email: { equals: email } } : {};
    const reservations = await prisma.reservation.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(reservations);
  } catch (error) {
    console.error('getReservations error', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
}

async function createReservation(req, res) {
  try {
    const {
      confirmationId,
      date,
      time,
      guests,
      table,
      status,
      specialNotes,
      name,
      email,
      phone,
      userEmail
    } = req.body;

    if (!confirmationId || !date || !time || !guests || !table || !name || !email) {
      return res.status(400).json({ error: 'Missing reservation data' });
    }

    const user = userEmail
      ? await prisma.user.findUnique({ where: { email: userEmail } })
      : null;

    const reservation = await prisma.reservation.create({
      data: {
        confirmationId,
        date: new Date(date),
        time,
        guests: Number(guests),
        table,
        status: status ? status.toUpperCase() : 'CONFIRMED',
        specialNotes: specialNotes || null,
        name,
        email,
        phone: phone || null,
        user: user ? { connect: { id: user.id } } : undefined
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('createReservation error', error);
    res.status(500).json({ error: 'Failed to save reservation' });
  }
}

async function updateReservation(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id: Number(id) },
      data: { status: status.toUpperCase() }
    });

    res.json(updatedReservation);
  } catch (error) {
    console.error('updateReservation error', error);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
}

module.exports = {
  getReservations,
  createReservation,
  updateReservation
};
