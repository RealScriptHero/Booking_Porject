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

  const existingMenuCount = await prisma.menu.count();
  if (existingMenuCount === 0) {
    await prisma.menu.createMany({
      data: [
        {
          name: 'Bruschetta al Pomodoro',
          description: 'Toasted artisan bread, fresh tomatoes, garlic, basil, balsamic glaze',
          price: 12,
          category: 'Appetizers'
        },
        {
          name: 'Calamari Fritti',
          description: 'Lightly fried calamari served with marinara sauce and lemon',
          price: 15,
          category: 'Appetizers'
        },
        {
          name: 'Spaghetti Carbonara',
          description: 'Classic pasta with pancetta, egg yolk, pecorino cheese, and black pepper',
          price: 22,
          category: 'Main Courses'
        },
        {
          name: 'Grilled Salmon',
          description: 'Served with roasted asparagus and a lemon-dill sauce',
          price: 28,
          category: 'Main Courses'
        },
        {
          name: 'Tiramisu',
          description: 'Ladyfingers dipped in coffee layered with mascarpone cream and cocoa',
          price: 10,
          category: 'Desserts'
        },
        {
          name: 'Chocolate Lava Cake',
          description: 'Warm chocolate cake with a molten center',
          price: 11,
          category: 'Desserts'
        },
        {
          name: 'Espresso Martini',
          description: 'Vodka, coffee liqueur and freshly brewed espresso',
          price: 14,
          category: 'Drinks'
        },
        {
          name: 'House Red Wine',
          description: 'A smooth and balanced Chianti from Tuscany',
          price: 9,
          category: 'Drinks'
        }
      ]
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
