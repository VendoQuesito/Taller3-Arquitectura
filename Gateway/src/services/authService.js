const catchAsync = require("../utils/catchAsync");

const login = catchAsync(async (req, res, next) => {
  req.app.locals.authClient.Login(req.body, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  req.app.locals.authClient.UpdatePassword({ id, ...req.body }, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

module.exports = {
  login,
  updatePassword,
};
