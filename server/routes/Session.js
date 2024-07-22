const express = require("express");

const { getAuthStatus } = require("../controllers/User");
const {
  addDishToOrder,
  getNotCreateOrderDetails,
  changeDishQuantity,
  removeDishFromOrder,
  addTableToOrder,
  removeTableFromOrder,
} = require("../controllers/Order");

const { Auth } = require("../middlewares/Auth");

const router = express.Router();

router.route("/auth").get(getAuthStatus);
router.route("/order").get(Auth, getNotCreateOrderDetails);
router.route("/order/addDish").get(Auth, addDishToOrder);
router.route("/order/addTable").get(Auth, addTableToOrder);
router.route("/order/changeQuantity").put(Auth, changeDishQuantity);
router.route("/order/removeDish").delete(Auth, removeDishFromOrder);
router.route("/order/removeTable").delete(Auth, removeTableFromOrder);

module.exports = router;
