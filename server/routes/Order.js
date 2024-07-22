const express = require("express");
const { Auth } = require("../middlewares/Auth");
const { Admin } = require("../middlewares/Admin");

const {
  getUserOrders,
  createOrder,
  cancelOrder,
  getOrders,
  confirmOrder,
  finishOrder,
} = require("../controllers/Order");

const router = express.Router();

router.route("/").get(Auth, getUserOrders).post(Auth, createOrder);
router.route("/all").get([Auth, Admin], getOrders);
router.route("/:id/cancel").put(Auth, cancelOrder);
router.route("/:id/confirm").put(Auth, confirmOrder);
router.route("/:id/finish").put(Auth, finishOrder);

module.exports = router;
