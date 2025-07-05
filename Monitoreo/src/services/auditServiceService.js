const { verifyToken } = require("../utils/auth");
const Log = require("../database/model/logModel");

async function ListActions(call, callback) {
  const token = call.request.token;
  const user = verifyToken(token);

  if (!user) return callback(new Error("Usuario no autenticado"));
  if (user.role !== "Administrador") return callback(new Error("No tiene permisos"));

  try {
    const logs = await Log.find({ type: "action" }).sort({ date: -1 }).exec();

    const actions = logs.map(log => ({
      id: log._id.toString(),
      userId: log.userId || "",
      email: log.email || "",
      method: log.method || "",
      url: log.url || "",
      date: log.date.toISOString(),
      action: log.message,
    }));

    callback(null, { actions });
  } catch (err) {
    callback(new Error("Error al obtener las acciones"));
  }
}

async function ListErrors(call, callback) {
  const token = call.request.token;
  const user = verifyToken(token);

  if (!user) return callback(new Error("Usuario no autenticado"));
  if (user.role !== "Administrador") return callback(new Error("No tiene permisos"));

  try {
    const logs = await Log.find({ type: "error" }).sort({ date: -1 }).exec();

    const errors = logs.map(log => ({
      id: log._id.toString(),
      userId: log.userId || "",
      email: log.email || "",
      date: log.date.toISOString(),
      error: log.message,
    }));

    callback(null, { errors });
  } catch (err) {
    callback(new Error("Error al obtener los errores"));
  }
}

const AuditService = { ListActions, ListErrors };
module.exports = AuditService;
