const express = require("express");
const multer = require("multer");
const {
  getDishes,
  getDish,
  addDish,
  editDish,
  deleteDish,
} = require("../controllers/Dish");
const { Auth } = require("../middlewares/Auth");
const { Admin } = require("../middlewares/Admin");

const router = express.Router();

const upload = multer();

router
  .route("/")
  .get(getDishes)
  .post([Auth, Admin, upload.single("image")], addDish);

router
  .route("/:id")
  .get(getDish)
  .put([Auth, Admin, upload.single("image")], editDish)
  .delete([Auth, Admin], deleteDish);

module.exports = router;
