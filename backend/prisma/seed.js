const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('123', 10);

  await prisma.user.upsert({
    where: { email: 'admin123@gmail.com' },
    update: {
      fullName: 'Admin User',
      password: adminPassword,
      role: 'ADMIN'
    },
    create: {
      fullName: 'Admin User',
      email: 'admin123@gmail.com',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  await prisma.user.upsert({
    where: { email: 'anasettai1@gmail.com' },
    update: {
      fullName: 'Regular User',
      password: userPassword,
      role: 'USER'
    },
    create: {
      fullName: 'Regular User',
      email: 'anasettai1@gmail.com',
      password: userPassword,
      role: 'USER'
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
