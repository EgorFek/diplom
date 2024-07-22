const express = require("express");
const {
  getCategories,
  addCategory,
  deleteCategory,
  editCategory,
} = require("../controllers/DishCategory");
const { Auth } = require("../middlewares/Auth");
const { Admin } = require("../middlewares/Admin");

const router = express.Router();

router.route("/").get(getCategories).post([Auth, Admin], addCategory);
router
  .route("/:id")
  .put([Auth, Admin], editCategory)
  .delete([Auth, Admin], deleteCategory);

module.exports = router;
