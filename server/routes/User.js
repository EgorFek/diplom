const express = require("express");

const { Auth } = require("../middlewares/Auth");
const { Admin } = require("../middlewares/Admin");

const {
  login,
  logout,
  getUsers,
  createUser,
  updateUserPeronalData,
  changeStatusToAdmin,
  changeStatusToUser,
  destroy,
} = require("../controllers/User");

const router = express.Router();

router.route("/").get([Auth, Admin], getUsers).put(Auth, updateUserPeronalData);
router.route("/:id").delete([Auth, Admin], destroy);
router.route("/login").post(login);
router.route("/register").post(createUser);
router.route("/logout").get(Auth, logout);
router.route("/status/admin").put([Auth, Admin], changeStatusToAdmin);
router.route("/status/user").put([Auth, Admin], changeStatusToUser);

module.exports = router;
