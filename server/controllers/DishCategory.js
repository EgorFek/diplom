const { DishCategory } = require("../models");

//Получение категорий
const getCategories = async (req, res) => {
  const categories = await DishCategory.findAll();
  res.status(200).json({ success: true, data: categories });
};

//Создание категории
const addCategory = async (req, res) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return res.status(400).json({
        success: false,
        msg: "Название категрии не должно быть пустым",
      });
    }

    DishCategory.create({
      category: categoryName,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Ошибка сервера..." });
  }
};

//Изменение категории
const editCategory = async (req, res) => {
  const { id } = req.params;
  const { newCategoryName } = req.body;
  try {
    if (!newCategoryName) {
      return res
        .status(400)
        .json({ success: false, msg: "Поле не должно быть пустым" });
    }

    await DishCategory.update(
      { category: newCategoryName },
      { where: { id: id } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Ошибка при удалении категории" });
  }
};

//Удаление категории
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await DishCategory.destroy({
      where: { id: id },
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Ошибка при удалении категории" });
  }
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
  editCategory,
};
