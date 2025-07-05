const catchAsync = require("../utils/catchAsync");

const getBillsClient = (req) => req.app.locals.billsClient;

const createBill = catchAsync(async (req, res, next) => {
  const { state, quantity } = req.body;
  const { id: userId, rol: role } = req.user;

  const client = getBillsClient(req);
  client.createBill({ userId, state, quantity, role }, (err, response) => {
    if (err) return next(err);
    res.status(201).json(response);
  });
});

const getBillById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { id: userId, rol: role } = req.user;

  const client = getBillsClient(req);
  client.getBillById({ id: parseInt(id), userId, role }, (err, response) => {
    if (err) return next(err);
    res.status(200).json(response);
  });
});

const getBills = catchAsync(async (req, res, next) => {
  const { state } = req.query;
  const { id: userId, rol: role } = req.user;

  const client = getBillsClient(req);
  client.getBills({ state, userId, role }, (err, response) => {
    if (err) return next(err);
    res.status(200).json(response);
  });
});

const deleteBill = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { rol: role } = req.user;

  const client = getBillsClient(req);
  client.deleteBill({ id: parseInt(id), role }, (err, response) => {
    if (err) return next(err);
    res.status(200).json(response);
  });
});

const updateBillState = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { state } = req.body;
  const { rol: role } = req.user;

  const client = getBillsClient(req);
  client.updateBillState({ id: parseInt(id), state, role }, (err, response) => {
    if (err) return next(err);
    res.status(200).json(response);
  });
});

module.exports = {
  createBill,
  getBillById,
  getBills,
  deleteBill,
  updateBillState,
};
