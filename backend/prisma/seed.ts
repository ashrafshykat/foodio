import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@foodio.com' },
    update: {},
    create: {
      email: 'admin@foodio.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@foodio.com' },
    update: {},
    create: {
      email: 'user@foodio.com',
      name: 'Regular User',
      password: userPassword,
      role: Role.USER,
    },
  });

  // clear existing to avoid duplicates easily on multiple seeds
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.category.deleteMany({});

  const category1 = await prisma.category.create({
    data: { name: 'Burgers' },
  });
  
  const category2 = await prisma.category.create({
    data: { name: 'Drinks' },
  });

  await prisma.menuItem.create({
    data: {
      name: 'Classic Cheeseburger',
      description: 'Beef patty with cheese, lettuce, and tomato',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1599&auto=format&fit=crop',
      isAvailable: true,
      categoryId: category1.id,
    },
  });

  await prisma.menuItem.create({
    data: {
      name: 'Cola',
      description: 'Refreshing cold drink',
      price: 1.99,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=1470&auto=format&fit=crop',
      isAvailable: true,
      categoryId: category2.id,
    },
  });

  console.log('Seeding completed successfully!');
  console.log({ admin: admin.email, user: user.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
