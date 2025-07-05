const Videos = require("../database/model/videosModel");

const getAllVideos = async (call, callback) => {
  try {
    const videos = await Videos.find({ available: { $ne: false } });
    callback(null, { videos });
  } catch (err) {
    callback({ code: 13, message: err.message });
  }
};

const getVideoById = async (call, callback) => {
  try {
    const video = await Videos.findOne({ id: call.request.id });
    if (!video) return callback({ code: 5, message: "No se encontró el video" });
    callback(null, video);
  } catch (err) {
    callback({ code: 13, message: err.message });
  }
};

const createVideo = async (call, callback) => {
  const { title, description, genre, requesterRole } = call.request;
  if (requesterRole !== "Administrador") return callback({ code: 7, message: "No autorizado" });
  if (!title || !description || !genre) return callback({ code: 3, message: "Faltan campos" });

  try {
    const newVideo = await Videos.create({ title, description, genre });
    callback(null, newVideo);
  } catch (err) {
    callback({ code: 13, message: err.message });
  }
};

const updateVideo = async (call, callback) => {
  const { id, requesterRole, title, description, genre } = call.request;
  if (requesterRole !== "Administrador") return callback({ code: 7, message: "No autorizado" });

  const updateData = {};
  if (title) updateData.title = title;
  if (description) updateData.description = description;
  if (genre) updateData.genre = genre;

  try {
    const video = await Videos.findOneAndUpdate({ id }, updateData, { new: true, runValidators: true });
    if (!video) return callback({ code: 5, message: "No se encontró el video" });
    callback(null, video);
  } catch (err) {
    callback({ code: 13, message: err.message });
  }
};

const deleteVideo = async (call, callback) => {
  const { id, requesterRole } = call.request;
  if (requesterRole !== "Administrador") return callback({ code: 7, message: "No autorizado" });
  try {
    const video = await Videos.findOneAndUpdate({ id }, { available: false }, { new: true });
    if (!video) return callback({ code: 5, message: "No se encontró el video" });
    callback(null, { message: "Video eliminado con éxito" });
  } catch (err) {
    callback({ code: 13, message: err.message });
  }
};

const VideosService = {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
};

module.exports = VideosService;
