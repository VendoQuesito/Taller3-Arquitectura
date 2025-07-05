const { PrismaClient: MariaBillClient } = require('../../prisma/generated/mariadb');

const mariadbBill = new MariaBillClient();

module.exports = {
  mariadbBill
};