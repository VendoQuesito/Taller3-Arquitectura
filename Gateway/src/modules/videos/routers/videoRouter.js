const { Router } = require("express");
const { getAllVideos,createVideo,getVideoById,updateVideo,deleteVideo } = require("../controllers/videoController");
const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const videoRouter = Router();

//videoRouter.get("/videos", (req, res) =>{
//    res.status(200).json(videos);
//});

videoRouter.route("/").get(getAllVideos);

videoRouter.use(protect);

videoRouter.route("/").post(restrictTo("Administrador"), createVideo);

videoRouter.route("/:id").get(getVideoById).patch(restrictTo("Administrador"),updateVideo).delete(restrictTo("Administrador"),deleteVideo);

module.exports = videoRouter;