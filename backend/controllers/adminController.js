const prisma = require('../prisma/prisma');

function toStartOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function formatDay(date) {
  return new Date(date).toISOString().slice(0, 10);
}

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

async function getAdminCustomers(req, res) {
  try {
    const customers = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { reservations: true }
        }
      }
    });

    const shaped = customers.map((customer) => ({
      id: customer.id,
      name: customer.fullName,
      email: customer.email,
      role: customer.role,
      createdAt: customer.createdAt,
      reservationsCount: customer._count.reservations
    }));

    res.json(shaped);
  } catch (error) {
    console.error('getAdminCustomers error', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

async function deleteAdminCustomer(req, res) {
  try {
    const customerId = Number(req.params.id);
    if (!customerId) {
      return res.status(400).json({ error: 'Invalid customer id' });
    }

    await prisma.reservation.deleteMany({ where: { userId: customerId } });
    await prisma.user.delete({ where: { id: customerId } });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('deleteAdminCustomer error', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
}

async function getAdminCustomerReservations(req, res) {
  try {
    const customerId = Number(req.params.id);
    if (!customerId) {
      return res.status(400).json({ error: 'Invalid customer id' });
    }

    const reservations = await prisma.reservation.findMany({
      where: { userId: customerId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(reservations);
  } catch (error) {
    console.error('getAdminCustomerReservations error', error);
    res.status(500).json({ error: 'Failed to fetch customer reservations' });
  }
}

async function getAdminAnalytics(req, res) {
  try {
    const [totalUsers, totalReservations, pending, confirmed, cancelled, users, reservations] = await Promise.all([
      prisma.user.count(),
      prisma.reservation.count(),
      prisma.reservation.count({ where: { status: 'PENDING' } }),
      prisma.reservation.count({ where: { status: 'CONFIRMED' } }),
      prisma.reservation.count({ where: { status: 'CANCELLED' } }),
      prisma.user.findMany({
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.reservation.findMany({
        select: { date: true, createdAt: true, guests: true, table: true },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    const days = 14;
    const perDayMap = new Map();
    const today = toStartOfDay(new Date());

    for (let i = 0; i < days; i += 1) {
      const slot = new Date(today);
      slot.setDate(today.getDate() - (days - i - 1));
      perDayMap.set(formatDay(slot), 0);
    }

    reservations.forEach((reservation) => {
      const key = formatDay(reservation.date || reservation.createdAt);
      if (perDayMap.has(key)) {
        perDayMap.set(key, perDayMap.get(key) + 1);
      }
    });

    const reservationsPerDay = Array.from(perDayMap.entries()).map(([day, total]) => ({
      day,
      total
    }));

    const usersGrowthMap = new Map();
    users.forEach((user) => {
      const key = formatDay(user.createdAt);
      usersGrowthMap.set(key, (usersGrowthMap.get(key) || 0) + 1);
    });

    let runningUsers = 0;
    const usersGrowth = Array.from(usersGrowthMap.entries())
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([day, count]) => {
        runningUsers += count;
        return {
          day,
          newUsers: count,
          totalUsers: runningUsers
        };
      });

    const reservationsByGuests = reservations.reduce((acc, reservation) => {
      const key = String(reservation.guests || 0);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    res.json({
      totals: {
        users: totalUsers,
        reservations: totalReservations,
        pending,
        confirmed,
        cancelled
      },
      reservationsPerDay,
      usersGrowth,
      reservationsByGuests
    });
  } catch (error) {
    console.error('getAdminAnalytics error', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}

module.exports = {
  getAdminCustomers,
  getAdminCustomerReservations,
  deleteAdminCustomer,
  getAdminReservations,
  getAdminAnalytics
};
