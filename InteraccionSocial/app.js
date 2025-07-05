const { config } = require("dotenv");
const { connect } = require("mongoose");
const { ServerCredentials, Server } = require("@grpc/grpc-js");
const { loadProto } = require("./src/utils/loadProto");
const { InteractionService } = require("./src/services/interactionServices");

const environments = {
  development: "Desarrollo",
  production: "Producción",
};

config({ path: "./.env" });


const DB = process.env.MONGO_DATABASE2.replace(
    "<PASSWORD>",
    process.env.MONGO_PASSWORD
  ).replace("<USER>", process.env.MONGO_USER);
  
  connect(DB).then(() => console.log("✓ Conexión a base de datos exitosa"));

const PORT = 3004;
const enviroment = "Desarrollo";

const server = new Server();

const interactionProto = loadProto("interactions");
server.addService(interactionProto.Interactions.service, InteractionService);

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