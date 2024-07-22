const express = require("express");
const { Admin } = require("../middlewares/Admin");
const { Auth } = require("../middlewares/Auth");
const {
  getTables,
  createTable,
  editTable,
  setDefaultTableImage,
  checkReservations,
  deleteTable,
} = require("../controllers/Table");
const multer = require("multer");

const router = express.Router();

const upload = multer();

router
  .route("/")
  .get(getTables)
  .post([Auth, Admin, upload.single("image")], createTable);

router
  .route("/:id")
  .put([Auth, Admin, upload.single("image")], editTable)
  .delete([Auth, Admin], deleteTable);

router
  .route("/:id/default")
  .put([Auth, Admin, upload.single("image")], setDefaultTableImage);

router.route("/:id/reserve").get(Auth, checkReservations);

module.exports = router;
