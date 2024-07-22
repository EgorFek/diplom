const { Table, TableReservation, Order } = require("../models");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const { Op } = require("sequelize");
const mime = require("mime-types");

const defaultImageName = "defaultTableImage.png";

//Получение столиков
const getTables = async (req, res) => {
  try {
    const tables = await Table.findAll();
    res.status(200).json({ success: true, data: tables });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

//Проверка рещервации на столике
const checkReservations = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ success: false, msg: "Неизвестная дата" });
  }
  try {
    const table = await Table.findOne({ where: { id: id } });
    if (!table) {
      return res.status(404).json({ success: false, msg: "Столик не найден" });
    }

    //Преобразование даты в отрезок от начала до конца дня
    const startOfDay = moment(date).startOf("day");
    const endOfDay = moment(date).endOf("day");

    //Поиск последней резеваций столика на данный день
    const reservation = await TableReservation.findOne({
      where: {
        TableId: id,
        reservation: {
          [Op.between]: [startOfDay, endOfDay],
        },
      },
      order: [["reservation", "DESC"]],
    });

    let reserved = !!reservation;

    //Если есть резервация, то проверка не отменен ли заказ
    if (reserved) {
      const order = await Order.findOne({ where: { id: reservation.OrderId } });
      reserved = order?.OrderStatusId !== 3;
    }

    res.status(200).json({ success: true, data: { reserved: reserved } });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

//Создание столика
const createTable = async (req, res) => {
  try {
    const { number, capacity } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null;

    let imageName;

    //Подготовка изображение к добавлению на сайт
    if (imageBuffer) {
      const mimeType = mime.lookup(req.file.originalname);
      //Проверка типа изображения
      if (!mimeType || !mimeType.startsWith("image/")) {
        return res
          .status(400)
          .json({ success: false, msg: "Допустимы только изображения" });
      }

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
    } else {
      imageName = defaultImageName;
    }

    const table = await Table.create({
      number,
      capacity,
      image: imageName,
    });

    if (!table) {
      return res
        .status(500)
        .json({ success: false, msg: "Не удалось создать столик" });
    }

    res.status(200).json({ success: true, msg: "Столик создан успешно" });
  } catch (err) {
    console.log(err);
    let errorMsg = err.message.replace("Validation error: ", "");
    res.status(200).json({ success: false, msg: errorMsg });
  }
};

//Изменение столика
const editTable = async (req, res) => {
  const { id } = req.params;
  try {
    const { number, capacity } = req.body;

    const imageBuffer = req.file ? req.file.buffer : null;

    const findedTable = await Table.findOne({ where: { id: id } });

    const pastImageName = findedTable.image;

    if (!findedTable) {
      return res.status(404).json({ success: false, msg: "Столик не найден" });
    }

    let imageName;

    //Подготовка изображение к добавлению на сайт
    if (imageBuffer) {
      const mimeType = mime.lookup(req.file.originalname);
      //Проверка типа изображения
      if (!mimeType || !mimeType.startsWith("image/")) {
        return res
          .status(400)
          .json({ success: false, msg: "Допустимы только изображения" });
      }

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
    } else {
      imageName = pastImageName;
    }

    await findedTable.update({
      number,
      capacity,
      image: imageName,
    });

    //Удаление старого изображение, если оно не является изображением по умолчанию
    if (imageBuffer && pastImageName !== defaultImageName) {
      const oldImagePath = path.join(
        __dirname,
        "../../client/public/images",
        pastImageName
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    res.status(200).json({ success: true, msg: "Столик создан успешно" });
  } catch (err) {
    console.log(err.message);
    let errorMsg = err.message.replace("Validation error: ", "");
    res.status(200).json({ success: false, msg: errorMsg });
  }
};

//Применение столику стандартное изображение
const setDefaultTableImage = async (req, res) => {
  const { id } = req.params;
  try {
    const findedTable = await Table.findOne({ where: { id: id } });

    if (!findedTable) {
      return res.status(404).json({ success: false, msg: "Столик не найден" });
    }

    const pastImageName = findedTable.image;

    findedTable.update({ image: defaultImageName });

    if (pastImageName !== defaultImageName) {
      const oldImagePath = path.join(
        __dirname,
        "../../client/public/images",
        pastImageName
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    res
      .status(200)
      .json({ success: true, msg: "Изображение изменено успешно" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Удаление столика
const deleteTable = async (req, res) => {
  const { id } = req.params;
  try {
    const table = await Table.findOne({ where: { id: id } });
    if (!table) {
      return res.status(404).json({ success: false, msg: "Столик не найден" });
    }

    //Если изображение столика стоит не по умолчанию, то удаление старого изображения
    if (table.image !== defaultImageName) {
      const oldImagePath = path.join(
        __dirname,
        "../../client/public/images",
        table.image
      );
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error(err);
        }
      });
    }

    await table.destroy();

    res.status(200).json({ success: true, msg: "Столик успешно удален" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

module.exports = {
  getTables,
  createTable,
  editTable,
  setDefaultTableImage,
  checkReservations,
  deleteTable,
};
