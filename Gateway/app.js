const { config } = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const globalErrorMiddleware = require("./src/middlewares/globalErrorMiddleware");
const loadClients = require("./grcpClient");
const router = require("./src/routes/authRouter");
const billRouter = require("./src/routes/billRouter");
const videoRouter = require("./src/routes/videoRouter");
const usersRouter = require("./src/routes/usersRouter");
const interactionRouter = require("./src/routes/interactionRouter");

config({ path: ".env" });

// const DB = process.env.MONGO_DATABASE.replace(
//     "<PASSWORD>",
//     process.env.MONGO_PASSWORD
//   ).replace("<USER>", process.env.MONGO_USER);
  
//   connect(DB).then(() => console.log("✓ Conexión a base de datos exitosa"));

const PORT = 3001;
const enviroment = "Desarrollo";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) =>{
    res.status(200).send("OK");
});


app.use("/auth", router);
app.use("/bills", billRouter);
app.use("/videos", videoRouter);
app.use("/users", usersRouter);
app.use("/interaction", interactionRouter);


loadClients(app);

app.use(globalErrorMiddleware);

app.listen(PORT,()=>{
    console.log(`- Entorno:      ${process.env.NODE_ENV}`);
    console.log(`- Puerto:       ${process.env.PORT}`);
    console.log(`- URL:          http://localhost:${process.env.PORT}`);
});