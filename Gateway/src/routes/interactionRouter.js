const { Router } = require("express");
const {
  giveLike,
  leaveComment,
  getInteractions
} = require('../services/interactionService');
const { protect } = require("../middlewares/authMiddleware");

const interactionRouter = Router();

interactionRouter.use(protect);
interactionRouter.route('/like').post(giveLike);
interactionRouter.route('/comment').post(leaveComment);
interactionRouter.route('/:id').get(getInteractions);

module.exports = interactionRouter;
