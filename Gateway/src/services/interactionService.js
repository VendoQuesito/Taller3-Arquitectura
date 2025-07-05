const catchAsync = require("../utils/catchAsync");

const giveLike = catchAsync(async (req, res, next) => {
  const { videoId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  req.app.locals.interactionsClient.GiveLike({ videoId, userId }, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const leaveComment = catchAsync(async (req, res, next) => {
  const { videoId, comment } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  req.app.locals.interactionsClient.LeaveComment({ videoId, userId, comment }, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const getInteractions = catchAsync(async (req, res, next) => {
  const { videoId } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  req.app.locals.interactionsClient.GetInteractions({ videoId, userId }, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

module.exports = {
  giveLike,
  leaveComment,
  getInteractions,
};
