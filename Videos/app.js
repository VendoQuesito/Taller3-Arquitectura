const { config } = require("dotenv");
const { connect } = require("mongoose");
const { ServerCredentials, Server } = require("@grpc/grpc-js");
const { loadProto } = require("./src/utils/loadProto");
const VideosServices = require("./src/services/videosServices");
//const initializeQueueConsumers = require("./src/queue");

const environments = {
  development: "Desarrollo",
  production: "Producción",
};

config({ path: "./.env" });


const DB = process.env.MONGO_DATABASE.replace(
    "<PASSWORD>",
    process.env.MONGO_PASSWORD
  ).replace("<USER>", process.env.MONGO_USER);
  
  connect(DB).then(() => console.log("✓ Conexión a base de datos exitosa"));
//   initializeQueueConsumers().then(() =>
//   console.log("✓ Conexión con RabbitMQ exitosa.")
// );

const PORT = 3000;
const enviroment = "Desarrollo";

const server = new Server();

const videosProto = loadProto("videos");
server.addService(videosProto.Videos.service, VideosServices);

server.bindAsync(
  `${process.env.SERVER_URL}:${process.env.PORT || 3000}`,
  ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error("Server failed to bind:", error);
    } else {
      console.log(
        `- Entorno:      ${environments[process.env.NODE_ENV || "development"]}`
      );
      console.log(`- Puerto:       ${port}`);
      console.log(
        `- URL:          ${process.env.SERVER_URL || "localhost"}:${port}`
      );
    }
  }
);