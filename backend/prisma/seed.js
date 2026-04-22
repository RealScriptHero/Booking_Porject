const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin123@gmail.com' },
    update: {
      fullName: 'Admin User',
      password: 'admin123',
      role: 'ADMIN'
    },
    create: {
      fullName: 'Admin User',
      email: 'admin123@gmail.com',
      password: 'admin123',
      role: 'ADMIN'
    }
  });

  await prisma.user.upsert({
    where: { email: 'anas123@gmail.com' },
    update: {
      fullName: 'Regular User',
      password: '123',
      role: 'USER'
    },
    create: {
      fullName: 'Regular User',
      email: 'anas123@gmail.com',
      password: '123',
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
