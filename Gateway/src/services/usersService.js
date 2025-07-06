const grpc = require("@grpc/grpc-js");
const catchAsync = require("../utils/catchAsync");

const getUsers = catchAsync(async (req, res, next) => {
  const metadata = new grpc.Metadata();
  const authHeader = req.headers.authorization;
  if (authHeader) metadata.add("authorization", authHeader);

  req.app.locals.usersClient.GetUsers({}, metadata, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const metadata = new grpc.Metadata();
  const authHeader = req.headers.authorization;
  if (authHeader) metadata.add("authorization", authHeader);

  const { id } = req.params;
  const { id: requesterId, rol: requesterRole } = req.user;

  req.app.locals.usersClient.GetUserById(
    { id, requesterId, requesterRole },
    metadata,
    (error, response) => {
      if (error) return next(error);
      res.status(200).json(response);
    }
  );
});

const createUser = catchAsync(async (req, res, next) => {
  const metadata = new grpc.Metadata();
  const authHeader = req.headers.authorization;
  if (authHeader) metadata.add("authorization", authHeader);

  const { rol: requesterRole } = req.user;

  req.app.locals.usersClient.CreateUser(
    { ...req.body, requesterRole },
    metadata,
    (error, response) => {
      if (error) return next(error);
      res.status(201).json(response);
    }
  );
});

const updateUser = catchAsync(async (req, res, next) => {
  const metadata = new grpc.Metadata();
  const authHeader = req.headers.authorization;
  if (authHeader) metadata.add("authorization", authHeader);

  const { id } = req.params;
  const { id: requesterId } = req.user;

  req.app.locals.usersClient.UpdateUser(
    { id, requesterId, ...req.body },
    metadata,
    (error, response) => {
      if (error) return next(error);
      res.status(200).json(response);
    }
  );
});

const deleteUser = catchAsync(async (req, res, next) => {
  const metadata = new grpc.Metadata();
  const authHeader = req.headers.authorization;
  if (authHeader) metadata.add("authorization", authHeader);

  const { rol: requesterRole } = req.user;
  const { id } = req.params;

  req.app.locals.usersClient.DeleteUser(
    { id, requesterRole },
    metadata,
    (error, response) => {
      if (error) return next(error);
      res.status(204).end();
    }
  );
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
