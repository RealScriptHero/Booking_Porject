const prisma = require('../prisma/prisma');

async function getUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('getUsers error', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function createUser(req, res) {
  try {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: 'fullName, email and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password,
        role: role || 'USER'
      }
    });

    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error) {
    console.error('createUser error', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (error) {
    console.error('loginUser error', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
}

module.exports = {
  getUsers,
  createUser,
  loginUser
};
