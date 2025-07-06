const catchAsync = require("../utils/catchAsync");

const getUsers = catchAsync(async (req, res, next) => {
  req.app.locals.usersClient.GetUsers({}, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  req.app.locals.usersClient.GetUserById({ id }, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const createUser = catchAsync(async (req, res, next) => {
  req.app.locals.usersClient.CreateUser(req.body, (error, response) => {
    if (error) return next(error);
    res.status(201).json(response);
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  req.app.locals.usersClient.UpdateUser({ id, ...req.body }, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  req.app.locals.usersClient.DeleteUser({ id }, (error, response) => {
    if (error) return next(error);
    res.status(204).end();
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
