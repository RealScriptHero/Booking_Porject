const prisma = require('../prisma/prisma');

async function getAdminReservations(req, res) {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, email: true, fullName: true }
        }
      }
    });
    res.json(reservations);
  } catch (error) {
    console.error('getAdminReservations error', error);
    res.status(500).json({ error: 'Failed to fetch admin reservations' });
  }
}

async function getAdminStats(req, res) {
  try {
    const total = await prisma.reservation.count();
    const pending = await prisma.reservation.count({ where: { status: 'PENDING' } });
    const confirmed = await prisma.reservation.count({ where: { status: 'CONFIRMED' } });
    const cancelled = await prisma.reservation.count({ where: { status: 'CANCELLED' } });

    const recent = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({ total, pending, confirmed, cancelled, recent });
  } catch (error) {
    console.error('getAdminStats error', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
}

module.exports = {
  getAdminReservations,
  getAdminStats
};
