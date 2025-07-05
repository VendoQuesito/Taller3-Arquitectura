const catchAsync = require("../utils/catchAsync");

const getAllVideos = catchAsync(async (req, res, next) => {
  req.app.locals.videosClient.GetAllVideos({}, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const getVideoById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  req.app.locals.videosClient.GetVideoById({ id }, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const createVideo = catchAsync(async (req, res, next) => {
  req.app.locals.videosClient.CreateVideo(req.body, (error, response) => {
    if (error) return next(error);
    res.status(201).json(response);
  });
});

const updateVideo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  req.app.locals.videosClient.UpdateVideo({ id, ...req.body }, (error, response) => {
    if (error) return next(error);
    res.status(200).json(response);
  });
});

const deleteVideo = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  req.app.locals.videosClient.DeleteVideo({ id }, (error, response) => {
    if (error) return next(error);
    res.status(204).end();
  });
});

module.exports = {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
};
