const express = require("express");
const {
  createBill,
  getBillById,
  deleteBill,
  getBills,
  updateBillState
} = require("../controllers/billController");
const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const billRouter = express.Router();

billRouter.use(protect);

billRouter.post("/", createBill);

billRouter.get("/", getBills);

billRouter.get("/:id", getBillById);

billRouter.patch("/:id",restrictTo("Administrador"), updateBillState);

billRouter.delete("/:id", deleteBill);

module.exports = billRouter;
