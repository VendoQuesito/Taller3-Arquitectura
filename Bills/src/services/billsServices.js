const { mariadbBill } = require("../database/prisma");

const validStates = ["Pendiente", "Pagado", "Vencido"];

const createBill = async (call, callback) => {
  const { userId, state, quantity, role } = call.request;

  if (!userId || !state || quantity === undefined) {
    return callback({ code: 3, message: "Faltan campos" });
  }

  if (role !== "Administrador") {
    return callback({ code: 7, message: "No esta autorizado" });
  }

  if (!validStates.includes(state)) {
    return callback({ code: 3, message: "Estado invalido" });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return callback({ code: 3, message: "El monto debe ser positivo" });
  }

  const newBill = await mariadbBill.bills.create({
    data: { userId, state, quantity, issueDate: new Date() }
  });

  callback(null, { ...newBill });
};

const getBillById = async (call, callback) => {
  const { id, userId, role } = call.request;
  if (isNaN(id)) return callback({ code: 3, message: "ID invalido" });

  const bill = await mariadbBill.bills.findUnique({
    where: { id },
    select: {
      id: true,
      state: true,
      userId: true,
      quantity: true,
      issueDate: true,
      paidDate: true
    }
  });

  if (!bill) return callback({ code: 5, message: "Factura no encontrada" });

  const isAdmin = role === "Administrador";
  const isOwner = bill.userId === userId;

  if (!isAdmin && !isOwner) {
    return callback({ code: 7, message: "No esta autorizado" });
  }

  callback(null, { ...bill });
};

const deleteBill = async (call, callback) => {
  const { id, role } = call.request;
  if (isNaN(id)) return callback({ code: 3, message: "ID invalido" });
  if (role !== "Administrador") return callback({ code: 7, message: "No esta autorizado" });

  const bill = await mariadbBill.bills.findUnique({ where: { id } });
  if (!bill) return callback({ code: 5, message: "Factura no encontrada" });

  if (bill.state === "Pagado") {
    return callback({ code: 3, message: "No se pueden eliminar facturas pagadas" });
  }

  await mariadbBill.bills.update({ where: { id }, data: { state: false } });
  callback(null, { message: "Factura eliminada" });
};

const getBills = async (call, callback) => {
  const { state, userId, role } = call.request;

  const stateFilter = validStates.includes(state) ? state : undefined;
  const where = {
    active: true,
    ...(stateFilter && { state: stateFilter }),
    ...(role !== "Administrador" && { userId })
  };

  const bills = await mariadbBill.bills.findMany({
    where,
    select: {
      id: true,
      state: true,
      userId: true,
      quantity: true,
      issueDate: true,
      paidDate: true
    },
    orderBy: { issueDate: "desc" }
  });

  callback(null, { bills });
};

const updateBillState = async (call, callback) => {
  const { id, state, role } = call.request;

  if (isNaN(id)) return callback({ code: 3, message: "ID invalido" });
  if (role !== "Administrador") return callback({ code: 7, message: "No esta autorizado" });
  if (!validStates.includes(state)) return callback({ code: 3, message: "Estado de factura invalido" });

  const bill = await mariadbBill.bills.findUnique({ where: { id } });
  if (!bill) return callback({ code: 5, message: "Factura no encontrada" });

  const updatedBill = await mariadbBill.bills.update({
    where: { id },
    data: {
      state,
      paidDate: state === "Pagado" ? new Date() : null
    },
    select: {
      id: true,
      state: true,
      paidDate: true,
      quantity: true,
      issueDate: true,
      userId: true
    }
  });

  callback(null, { ...updatedBill });
};

const BillsServices = {
  createBill,
  getBillById,
  getBills,
  deleteBill,
  updateBillState
};

module.exports = BillsServices;