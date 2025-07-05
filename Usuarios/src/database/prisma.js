const { PrismaClient: MariaClient } = require('../../prisma/src/generated/prisma');

const mariadb = new MariaClient();

module.exports = {
  mariadb
};