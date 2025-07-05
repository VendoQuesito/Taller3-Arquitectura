const { PrismaClient: UsersClient } = require("../../../prisma/src/generated/prisma");
const { PrismaClient: BillsClient } = require("../../../prisma/generated/mariadb");
const { faker } = require("@faker-js/faker");

const usersPrisma = new UsersClient();
const billsPrisma = new BillsClient();

async function seedBills() {
  const users = await usersPrisma.users.findMany({
    where: { deletedAt: null },
    select: { id: true },
  });

  if (users.length === 0) {
    console.error("No hay usuarios válidos para generar facturas.");
    process.exit(1);
  }

  const billStates = ["Pendiente", "Pagado", "Vencido"];
  const bills = [];

  for (let i = 0; i < 320; i++) {
    const user = faker.helpers.arrayElement(users);
    const state = faker.helpers.arrayElement(billStates);
    const issueDate = faker.date.past({ years: 1 });
    const paidDate = state === "Pagado" ? faker.date.recent({ days: 30 }) : null;

    bills.push({
      userId: user.id,
      state,
      quantity: faker.number.int({ min: 10, max: 500 }),
      issueDate,
      paidDate,
      active: faker.datatype.boolean({ probability: 0.9 }),
    });
  }

  await billsPrisma.bills.deleteMany();
  await billsPrisma.bills.createMany({ data: bills });

  console.log("Seeding de facturas completado");
  process.exit();
}

seedBills().catch((err) => {
  console.error("Error al hacer seed de facturas:", err);
  process.exit(1);
});
