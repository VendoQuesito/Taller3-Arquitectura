const { PrismaClient: UsersClient } = require("../../../prisma/src/generated/prisma");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

const usersPrisma = new UsersClient();

async function seedUsers() {
  const users = [];

  const fixedUsers = [
    {
      name: "Among",
      lastName: "Us",
      email: "GOTY@example.com",
      password: await bcrypt.hash("admin", 12),
      rol: "Administrador",
      createdAt: new Date(),
      deletedAt: null,
    },
    {
      name: "Pepe",
      lastName: "Tapia",
      email: "cliente@example.com",
      password: await bcrypt.hash("cliente", 12),
      rol: "Cliente",
      createdAt: new Date(),
      deletedAt: null,
    },
  ];

  users.push(...fixedUsers);

  for (let i = 0; i < 100; i++) {
    const password = await bcrypt.hash("password", 12);
    const isDeleted = faker.datatype.boolean({ probability: 0.1 });

    users.push({
      name: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password,
      rol: i < 5 ? "Administrador" : "Cliente",
      createdAt: faker.date.past({ years: 1 }),
      deletedAt: isDeleted ? faker.date.recent({ days: 30 }) : null,
    });
  }

  await usersPrisma.users.deleteMany();
  await usersPrisma.users.createMany({
    data: users,
    skipDuplicates: true,
  });

  console.log("Seeding de usuarios completado");
  process.exit();
}

seedUsers().catch((err) => {
  console.error("Error al hacer seed de usuarios:", err);
  process.exit(1);
});
