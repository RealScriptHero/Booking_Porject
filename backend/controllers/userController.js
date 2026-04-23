const prisma = require('../prisma/prisma');
const bcrypt = require('bcrypt');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

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
    const normalizedEmail = normalizeEmail(email);
    const normalizedFullName = String(fullName || '').trim();

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('[register] attempt email:', normalizedEmail);

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      console.log('[register] email exists:', normalizedEmail);
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: normalizedFullName || null,
        email: normalizedEmail,
        password: hashedPassword,
        role: (role || 'user').toUpperCase()
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
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('[login] attempt email:', normalizedEmail);
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    console.log('[login] user found:', Boolean(user));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let validPassword = false;
    const storedPassword = user.password || '';

    if (isBcryptHash(storedPassword)) {
      validPassword = await bcrypt.compare(password, storedPassword);
      console.log('[login] password check (bcrypt):', validPassword);
    } else {
      validPassword = password === storedPassword;
      console.log('[login] password check (plain-text fallback):', validPassword);

      // Auto-upgrade legacy/plain-text passwords to bcrypt after successful login
      if (validPassword) {
        const rehashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { id: user.id },
          data: { password: rehashedPassword }
        });
        console.log('[login] password upgraded to bcrypt for user:', user.id);
      }
    }

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
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
