// const {mariadb} = require("../../database/prisma");
// const getChannel = require("../config/connection");

// const userCreate = async () => {
//   const channel = await getChannel();

//   channel.consume("users-create-queue2", async (data) => {
//     const content = JSON.parse(data.content);
//     console.log("users-create-queue2");
//     console.log(content);

//     try {
//       await mariadb.create(content);
//       channel.ack(data);
//     } catch (error) {
//       console.error("Failed to create video:", error);
//       channel.nack(data, false, true);
//     }
//   });
// };

// module.exports = userCreate;