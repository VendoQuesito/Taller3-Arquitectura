const  decodeToken  = require("../middlewares/decodeToken");
const { Router } = require("express");
const {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../services/usersService");
const { protect, restrictTo } = require("../middlewares/authMiddleware");


const usersRouter = Router();

usersRouter.route("/").post(createUser);

usersRouter.use(decodeToken);

usersRouter.route("/").get(restrictTo("Administrador"), getUsers);

usersRouter
  .route("/:id")
  .get(getUserById)
  .patch(updateUser)
  .delete(deleteUser);


module.exports = usersRouter;