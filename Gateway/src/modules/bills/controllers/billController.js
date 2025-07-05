const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const { mariadbBill, mariadb } = require("../../../database/prisma");


const createBill = catchAsync(async (req, res, next) => {
    const { userId, state, quantity } = req.body;
  
    if (!userId || !state || quantity === undefined) {
      return next(new AppError("Faltan campos", 400));
    }
  
    if (!req.user || req.user.rol !== "Administrador") {
      return next(new AppError("No esta autorizado", 403));
    }
  
    const validState = ["Pendiente", "Pagado", "Vencido"];
    if (!validState.includes(state)) {
      return next(new AppError("Estado invalido", 400));
    }
  
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return next(new AppError("El monto debe ser positivo", 400));
    }
  
    const user = await mariadb.users.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      return next(new AppError("El usuario no existe", 404));
    }
  
    const issueDate = new Date();
  
    const newBill = await mariadbBill.bills.create({
      data: {
        userId,
        state,
        quantity,
        issueDate
      }
    });
  
    res.status(201).json(newBill);
  });
const getBillById = catchAsync(async (req, res, next) => {
    const billId = parseInt(req.params.id);

    if (isNaN(billId)) {
    return next(new AppError("ID invalido", 400));
    }

    if (!req.user) {
    return next(new AppError("Debe iniciar sesion", 401));
    }

    const bill = await mariadbBill.bills.findUnique({
    where: { id: billId },
    select: {
        id: true,
        state: true,
        userId: true,
        quantity: true,
        issueDate: true,
        paidDate: true
    }
    });

    if (!bill) {
    return next(new AppError("Factura no encontrada", 404));
    }

    const isAdmin = req.user.rol === "Administrador";
    const isOwner = req.user.id === factura.usuarioId;

    if (!isAdmin && !isOwner) {
    return next(new AppError("No esta autorizado", 403));
    }

    res.status(200).json(bill);
});  

const deleteBill = catchAsync(async (req, res, next) => {
    const billId = parseInt(req.params.id);
  
    if (isNaN(billId)) {
      return next(new AppError("ID invalido", 400));
    }
  
    if (!req.user) {
      return next(new AppError("Debe iniciar sesion", 401));
    }
  
    if (req.user.rol !== "Administrador") {
      return next(new AppError("No esta autorizado", 403));
    }
  
    const bill = await mariadbBill.bills.findUnique({
      where: { id: billId }
    });
  
    if (!bill) {
      return next(new AppError("Factura no encontrada", 404));
    }
  
    if (bill.state === "Pagado") {
      return next(new AppError("No se pueden eliminar facturas pagadas", 400));
    }
  
    await mariadbBill.bills.update({
      where: { id: billId },
      data: { state: false }
    });
  
    res.status(200).json({ message: "Factura eliminada" });
  });
  const getBills = catchAsync(async (req, res, next) => {
    const state = req.query.state;
    
    if (!req.user) {
      return next(new AppError("Debe iniciar sesion", 401));
    }
  
    const validState = ["Pendiente", "Pagado", "Vencido"];
    const stateFilter = state && validState.includes(state) ? state : undefined;
  
    let where = {
      active: true,
      ...(stateFilter && { state: stateFilter }),
    };
  
    if (req.user.rol !== "Administrador") {
      where.userId = req.user.id;
    }
  
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
  
    res.status(200).json(bills);
  });

  const updateBillState = catchAsync(async (req, res, next) => {
    const billId = parseInt(req.params.id);
    const { state } = req.body;
  
    if (isNaN(billId)) {
      return next(new AppError("ID invalido", 400));
    }
  
    if (!req.user) {
      return next(new AppError("Debe iniciar sesion", 401));
    }
  
    if (req.user.rol !== "Administrador") {
      return next(new AppError("No esta autorizado", 403));
    }
  
    const validStates = ["Pendiente", "Pagado", "Vencido"];
    if (!validStates.includes(state)) {
      return next(new AppError("Estado de factura invalido", 400));
    }
  
    const bill = await mariadbBill.bills.findUnique({
      where: { id: billId }
    });
  
    if (!bill) {
      return next(new AppError("Factura no encontrada", 404));
    }
  
    const updateData = {
      state,
      paidDate: state === "Pagado" ? new Date() : null
    };
  
    const updatedBill = await mariadbBill.bills.update({
      where: { id: billId },
      data: updateData,
      select: {
        id: true,
        state: true,
        paidDate: true,
        quantity: true,
        issueDate: true,
        userId: true
      }
    });
  
    res.status(200).json(updatedBill);
  });
  
module.exports = {
    createBill,
    getBillById,
    getBills,
    deleteBill,
    updateBillState
};