const prisma = require('../prisma/prisma');

async function getMenuItems(req, res) {
  try {
    const items = await prisma.menu.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }]
    });
    res.json(items);
  } catch (error) {
    console.error('getMenuItems error', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
}

module.exports = {
  getMenuItems
};
