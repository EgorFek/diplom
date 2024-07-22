const { Dish, DishCategory } = require("../models");
const fs = require("fs");
const { orderBy } = require("lodash");
const path = require("path");
const { Op, where } = require("sequelize");
const mime = require("mime-types");

//Получение всех блюд
const getDishes = async (req, res) => {
  const { dishName, categoryId } = req.query;
  const orderBy = req.query.orderBy ? req.query.orderBy : "DESC";
  //Поиск блюда, если присутсвует филльтрация по названию блюда
  // let dishes = !dishName
  //   ? await Dish.findAll({
  //       order: [["id", "DESC"]],
  //       include: [
  //         {
  //           model: DishCategory,
  //           attributes: ["category"],
  //         },
  //       ],
  //     })
  //   : await Dish.findAll({
  //       where: { name: { [Op.like]: `%${dishName}%` } },
  //       order: [["id", "DESC"]],
  //       include: [
  //         {
  //           model: DishCategory,
  //         },
  //       ],
  //     });

  // Построение условия для фильтрации по названию и категории
  let filterConditions = {};

  if (dishName) {
    filterConditions.name = { [Op.like]: `%${dishName}%` };
  }

  if (categoryId && categoryId != 0) {
    filterConditions.DishCategoryId = categoryId; // Учтите, что поле должно точно совпадать с вашим определением модели
  }

  // Получение данных с учетом фильтров
  let dishes = filterConditions
    ? await Dish.findAll({
        where: filterConditions,
        order: [["id", orderBy]],
        include: [
          {
            model: DishCategory,
            attributes: ["category"],
          },
        ],
      })
    : await Dish.findAll({
        order: [["id", orderBy]],
        include: [
          {
            model: DishCategory,
            attributes: ["category"],
          },
        ],
      });

  res.status(200).json({ success: true, data: dishes });
};

//Получение конкретного блюда
const getDish = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await Dish.findOne({ where: { id: id } });
    console.log(dish);
    res.status(200).json({ success: true, data: dish });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Создание блюда
const addDish = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    //Проврека на существование файла
    if (!req.file) {
      return res.status(400).json({
        success: false,
        msg: "Невозможно создать блюдо без изображения",
      });
    }

    const imageBuffer = req.file.buffer;

    //Проверка типа файла
    const mimeType = mime.lookup(req.file.originalname);
    if (!mimeType || !mimeType.startsWith("image/")) {
      return res
        .status(400)
        .json({ success: false, msg: "Допустимы только изображения" });
    }

    //Подготовления изображения к добавлению в хранилище
    const imagePath = path.join(__dirname, "../../client/public/images");

    const imageName = `${Date.now()}_${req.file.originalname}`;

    const filePath = path.join(imagePath, imageName);

    fs.writeFile(filePath, imageBuffer, (err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, msg: "Не удалось сохранить изображение" });
      }
    });

    const findedCategory = await DishCategory.findOne({
      where: { id: category },
    });

    if (!findedCategory) {
      res.status(200).json({ success: false, msg: "Неизвестная категория" });
    }

    const newDish = await Dish.create({
      name,
      imageName,
      description,
      price,
    });

    await findedCategory.addDish(newDish);

    res.status(200).json({ success: true, msg: "Блюдо успешно добавлено" });
  } catch (err) {
    console.log(err);
    let errorMsg = err.message.replace("Validation error: ", "");
    res.status(200).json({ success: false, msg: errorMsg });
  }
};

//Измнение блюда
const editDish = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    //Проверка на изменение изображения
    const imageBuffer = req.file ? req.file.buffer : null;

    let imageName = null;

    //Если изображение изменено
    if (imageBuffer) {
      //Проверка типа файла
      const mimeType = mime.lookup(req.file.originalname);
      if (!mimeType || !mimeType.startsWith("image/")) {
        return res
          .status(400)
          .json({ success: false, msg: "Допустимы только изображения" });
      }
      //Добавление изображения на сайт
      const imagePath = path.join(__dirname, "../../client/public/images");
      imageName = `${Date.now()}_${req.file.originalname}`;
      const filePath = path.join(imagePath, imageName);
      fs.writeFile(filePath, imageBuffer, (err) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ success: false, msg: "Не удалось сохранить изображение" });
        }
      });
    }

    const findedCategory = await DishCategory.findOne({
      where: { id: category },
    });

    if (!findedCategory) {
      return res
        .status(404)
        .json({ success: false, msg: "Неизвестная категория" });
    }

    const findedDish = await Dish.findByPk(id);
    if (!findedDish) {
      return res.status(404).json({ success: false, msg: "Блюдо не найдено" });
    }

    const imagePastName = findedDish.imageName;

    //Подготовка данных, требующих изменения
    const updateValues = {
      name: name || findedDish.name,
      imageName: imageName || findedDish.imageName,
      description: description || findedDish.description,
      price: price || findedDish.price,
    };

    await findedDish.update(updateValues);

    //Удаление старого изображения
    if (imageBuffer && imagePastName) {
      const oldImagePath = path.join(
        __dirname,
        "../../client/public/images",
        imagePastName
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    await findedCategory.addDish(findedDish);

    res.status(200).json({ success: true, msg: "Блюдо успешно изменено" });
  } catch (err) {
    console.log(err);
    let errorMsg = err.message.replace("Validation error: ", "");
    res.status(200).json({ success: false, msg: errorMsg });
  }
};

//Удаление блюда
const deleteDish = async (req, res) => {
  const { id } = req.params;
  try {
    const dish = await Dish.findOne({ where: { id: id } });

    if (!dish) {
      res.status(404).json({ success: false, msg: "Блюдо не найдено" });
    }

    const imageName = dish.imageName;

    //Удаление изображения
    if (imageName) {
      const oldImagePath = path.join(
        __dirname,
        "../../client/public/images",
        imageName
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    dish.destroy();

    res.status(200).json({ success: false, msg: "Успешно удалено" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

module.exports = {
  getDishes,
  addDish,
  editDish,
  getDish,
  deleteDish,
};
