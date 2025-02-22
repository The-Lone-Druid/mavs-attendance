import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create roles first
  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "Admin" },
      update: {},
      create: { name: "Admin" },
    }),
    prisma.role.upsert({
      where: { name: "Manager" },
      update: {},
      create: { name: "Manager" },
    }),
    prisma.role.upsert({
      where: { name: "Employee" },
      update: {},
      create: { name: "Employee" },
    }),
  ]);

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: hashedPassword,
      role: "Admin",
      Role: {
        connect: {
          name: "Admin",
        },
      },
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
