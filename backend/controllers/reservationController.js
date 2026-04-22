const prisma = require('../prisma/prisma');

async function getReservations(req, res) {
  try {
    const { userId } = req.query;
    const where = userId ? { userId: Number(userId) } : {};

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

async function getMyReservations(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reservations);
  } catch (error) {
    console.error('getMyReservations error', error);
    res.status(500).json({ error: 'Failed to fetch user reservations' });
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
      tableNumber,
      status,
      specialNotes,
      name,
      email,
      phone,
      userId
    } = req.body;

    if (!date || !time || !guests || !table || tableNumber == null || !userId) {
      return res.status(400).json({ error: 'Required reservation fields are missing' });
    }

    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
    if (!user) {
      return res.status(404).json({ error: 'Logged user not found' });
    }

    const reservation = await prisma.reservation.create({
      data: {
        confirmationId: confirmationId || `RES-${Date.now()}`,
        date: new Date(date),
        time,
        guests: Number(guests),
        table,
        tableNumber: Number(tableNumber),
        status: status ? status.toUpperCase() : 'CONFIRMED',
        specialNotes: specialNotes || null,
        name: name || user.fullName || 'Guest',
        email: email || user.email,
        phone: phone || null,
        user: { connect: { id: user.id } }
      }
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('createReservation error', error);
    res.status(500).json({ error: 'Unable to save reservation. Please try again.' });
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

async function deleteReservation(req, res) {
  try {
    const { id } = req.params;
    await prisma.reservation.delete({ where: { id: Number(id) } });
    res.json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('deleteReservation error', error);
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
}

module.exports = {
  getReservations,
  getMyReservations,
  createReservation,
  updateReservation,
  deleteReservation
};
