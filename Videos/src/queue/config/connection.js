// const { connect } = require("amqplib");

// let channel;

// const QUEUES = ["users-create-queue1", "users-create-queue2"];
// const EXCHANGE_NAME = "users-create-exchange";

// async function connectToRabbitMQ() {
//   const connection = await connect(process.env.RABBITMQ_URL);
//   channel = await connection.createChannel();
//   // Si no es exchange se debe eliminar esta linea
//   await channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: true });

//   await Promise.all(
//     QUEUES.map(async (queue) => {
//       await channel.assertQueue(queue, { durable: true });
//       // Si no es exchange se debe eliminar esta linea
//       await channel.bindQueue(queue, EXCHANGE_NAME, "");
//     })
//   );
//   return channel;
// }

// async function getChannel() {
//   if (!channel) {
//     channel = await connectToRabbitMQ();
//   }
//   return channel;
// }

// module.exports = getChannel;