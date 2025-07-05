const { credentials } = require("@grpc/grpc-js");
const { loadProto } = require("./src/utils/loadProto");
const { config } = require("dotenv");

config();

const loadClients = (app) => {
  const videosProto = loadProto("videos");
  app.locals.videosClient = new videosProto.Videos(
    process.env.VIDEOS_SERVICE_URL,
    credentials.createInsecure()
  );
  const authProto = loadProto("auth");
  app.locals.authClient = new authProto.Auth(
   process.env.AUTH_SERVICE_URL,
    credentials.createInsecure()
  );
  const usersProto = loadProto("users");
  app.locals.usersClient = new usersProto.Users(
   process.env.USERS_SERVICE_URL,
    credentials.createInsecure()
  );
  const interactionsProto = loadProto("interactions");
  app.locals.interactionsClient = new interactionsProto.Interactions(
   process.env.INTERACTIONS_SERVICE_URL,
    credentials.createInsecure()
  );
  const billsProto = loadProto("bills");
  app.locals.billsClient = new billsProto.Bills(
   process.env.BILLS_SERVICE_URL,
    credentials.createInsecure()
  );
};

module.exports = loadClients;