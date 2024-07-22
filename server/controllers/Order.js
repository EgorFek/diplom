const {
  User,
  Order,
  OrderStatus,
  Dish,
  Table,
  OrderDish,
  TableReservation,
} = require("../models");
const moment = require("moment");

//Получение заказов, относящихся к пользователю
const getUserOrders = async (req, res) => {
  const userId = req.session.user.id;
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Пользователь не найден" });
    }

    const orders = await user.getOrders({
      order: [["orderedAt", "DESC"]],
      include: {
        model: OrderStatus,
      },
    });

    let finalOrder = [];

    // Формирование массива заказов
    const promises = orders.map(async (order) => {
      // Получение блюд для данного заказа
      const dishes = await order.getDishes();
      // Получение столов для данного заказа
      const tables = await order.getTables();

      // Получение деталей по каждому блюду
      const dishDetails = await Promise.all(
        dishes.map(async (dish) => {
          // Получение количества каждого блюда в данном заказе
          const quantity = await OrderDish.findOne({
            where: { OrderId: order.id, DishId: dish.id },
          });
          return {
            dish: dish,
            quantity: quantity.quantity,
          };
        })
      );

      // Получение деталей по каждому столу
      const tableDetails = await Promise.all(
        tables.map(async (table) => {
          // Получение информации о бронировании для данного стола в данном заказе
          const reservation = await TableReservation.findOne({
            where: { OrderId: order.id, TableId: table.id },
          });
          return {
            table: table,
            reservation: reservation.reservation,
          };
        })
      );

      // Добавление информации о заказе с деталями блюд и столов в массив finalOrder
      finalOrder.push({
        order: order,
        dishes: dishDetails,
        tables: tableDetails,
      });
    });

    // Выполнение всех асинхронных операций для всех заказов
    await Promise.all(promises);

    //Сортировка массива по дате создания заказа
    finalOrder.sort(
      (a, b) => new Date(b.order.orderedAt) - new Date(a.order.orderedAt)
    );

    res.status(200).json({ success: true, data: finalOrder });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

//Получение всех заказов
const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [["orderedAt", "DESC"]],
      include: {
        model: OrderStatus,
      },
    });

    let finalOrder = [];

    // Формирование массива заказов с дополнительной информацией о пользователях
    const promises = orders.map(async (order) => {
      // Получение списка блюд для данного заказа
      const dishes = await order.getDishes();
      // Получение списка столов для данного заказа
      const tables = await order.getTables();
      // Получение информации о пользователе, сделавшем заказ
      const user = await User.findOne({
        attributes: ["name", "surname", "id"],
        where: { id: order.UserId },
      });

      // Получение деталей по каждому блюду в заказе
      const dishDetails = await Promise.all(
        dishes.map(async (dish) => {
          // Получение количества каждого блюда в данном заказе
          const quantity = await OrderDish.findOne({
            where: { OrderId: order.id, DishId: dish.id },
          });
          return {
            dish: dish,
            quantity: quantity.quantity,
          };
        })
      );

      // Получение деталей по каждому столу в заказе
      const tableDetails = await Promise.all(
        tables.map(async (table) => {
          // Получение информации о бронировании для данного стола в данном заказе
          const reservation = await TableReservation.findOne({
            where: { OrderId: order.id, TableId: table.id },
          });
          return {
            table: table,
            reservation: reservation.reservation,
          };
        })
      );

      // Добавление информации о заказе с информацией о пользователе, блюдах и столах в массив finalOrder
      finalOrder.push({
        order: order,
        user: user,
        dishes: dishDetails,
        tables: tableDetails,
      });
    });

    // Дожидаемся выполнения всех асинхронных операций для всех заказов
    await Promise.all(promises);

    finalOrder.sort(
      (a, b) => new Date(b.order.orderedAt) - new Date(a.order.orderedAt)
    );

    console.log(finalOrder);

    res.status(200).json({ success: true, data: finalOrder });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

//Создание заказа
const createOrder = async (req, res) => {
  try {
    const { id } = req.session.user;

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Пользователь не найден" });
    }

    //Проверка того, что заказа существует и в нем есть столики
    if (!req.session.order || !req.session.order?.tables) {
      return res
        .status(400)
        .json({ success: false, msg: "Невозможно создать заказ" });
    }

    const order = await user.createOrder({ OrderStatusId: 1 });

    const { dishes, tables } = req.session.order;

    //Создание массива блюд и их количества
    const dishRecords = Object.keys(dishes).map((dishId) => {
      const { quantity } = dishes[dishId];
      return { OrderId: order.id, DishId: dishId, quantity };
    });

    //Создание массива столиклв и их количества
    const tableRecords = Object.keys(tables).map((tableId) => {
      const { reservation } = tables[tableId];
      return { OrderId: order.id, TableId: tableId, reservation };
    });

    await OrderDish.bulkCreate(dishRecords);

    await TableReservation.bulkCreate(tableRecords);

    //Очищение заказа
    req.session.order = { dishes: {}, tables: {} };

    res.status(200).json({ success: true, msg: "Заказ успешно создан" });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

//Получение еще не созданного заказа (находящегося в сессии)
const getNotCreateOrderDetails = async (req, res) => {
  if (!req.session.order) {
    req.session.order = { dishes: {}, tables: {} };
  }

  console.log(req.session.order.tables);
  try {
    let details = {};
    //Получение записей блюд и добавления к ним количества
    if (req.session.order.dishes) {
      const dishIds = Object.keys(req.session.order.dishes);
      const dishes = await Dish.findAll({ where: { id: dishIds } });
      const detailsDishes = dishes.map((dish) => ({
        dish: dish,
        quantity: req.session.order.dishes[dish.id].quantity,
      }));
      details.dishes = detailsDishes;
    }

    //Получение записей столиков и добавления к ним резерваций
    if (req.session.order.tables) {
      const tableIds = Object.keys(req.session.order.tables);
      const tables = await Table.findAll({ where: { id: tableIds } });
      const detailsTables = tables.map((table) => ({
        table: table,
        reservation: req.session.order.tables[table.id].reservation,
      }));
      details.tables = detailsTables;
    }

    res.status(200).json({ success: true, order: details });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Добавление блюда к заказу
const addDishToOrder = async (req, res) => {
  const { dishId } = req.query;
  try {
    if (req.session.order.dishes[dishId]) {
      req.session.order.dishes[dishId].quantity += 1;
    } else {
      req.session.order.dishes = {
        ...req.session.order.dishes,
        [dishId]: { quantity: 1 },
      };
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Изменение количества блюда в заказе
const changeDishQuantity = async (req, res) => {
  try {
    const { value, dishId } = req.body;

    if (req.session.order.dishes[dishId]) {
      req.session.order.dishes[dishId].quantity += value;
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Удаление блюда из заказа
const removeDishFromOrder = async (req, res) => {
  try {
    const { dishId } = req.body;

    delete req.session.order.dishes[dishId];

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Добавление столика к заказу
const addTableToOrder = async (req, res) => {
  const { tableId, date, time } = req.query;
  try {
    const formatedDate = moment(date);

    let reservationDateTime = moment.tz(
      `${formatedDate.format("YYYY-MM-DD")} ${time}`,
      "YYYY-MM-DD HH:mm",
      "Europe/Moscow"
    );

    console.log(date);

    if (!req.session.order.tables[tableId]) {
      req.session.order.tables = {
        ...req.session.order.tables,
        [tableId]: { reservation: reservationDateTime },
      };
    }

    console.log(req.session.order.tables[tableId]);

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Удаление столика из заказа
const removeTableFromOrder = async (req, res) => {
  try {
    const { tableId } = req.body;

    delete req.session.order.tables[tableId];

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Отмена заказа
const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.session.user;
  try {
    const order = await Order.findOne({ where: { id: id } });
    console.log(order);

    if (!order) {
      return res.status(404).json({ success: false, msg: "Заказ не найден" });
    }

    if (order.OrderStatusId > 2) {
      return res
        .status(400)
        .json({ success: false, msg: "Заказ нелья отменить" });
    }

    if (order.UserId === userId || req.session.user.UserStatusId === 2) {
      await order.update({
        OrderStatusId: 3,
      });

      return res
        .status(200)
        .json({ success: true, msg: "Заказ успешно отменен" });
    } else {
      return res
        .status(400)
        .json({ success: true, msg: "Вы не можете отменить этот заказ" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Подтверждение заказа
const confirmOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ where: { id: id } });
    console.log(order);

    if (!order) {
      return res.status(404).json({ success: false, msg: "Заказ не найден" });
    }

    if (order.OrderStatusId > 2) {
      return res
        .status(400)
        .json({ success: false, msg: "Заказ нелья подтвердить" });
    }

    if (req.session.user.UserStatusId === 2) {
      await order.update({
        OrderStatusId: 2,
      });

      return res
        .status(200)
        .json({ success: true, msg: "Заказ успешно подтвержден" });
    } else {
      return res
        .status(400)
        .json({ success: true, msg: "Вы не можете подтвердить этот заказ" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Завершение заказа
const finishOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ where: { id: id } });
    console.log(order);

    if (!order) {
      return res.status(404).json({ success: false, msg: "Заказ не найден" });
    }

    if (order.OrderStatusId > 2) {
      return res
        .status(400)
        .json({ success: false, msg: "Заказ нелья завершить" });
    }

    if (req.session.user.UserStatusId === 2) {
      await order.update({
        OrderStatusId: 4,
      });

      return res
        .status(200)
        .json({ success: true, msg: "Заказ успешно завершен" });
    } else {
      return res
        .status(400)
        .json({ success: true, msg: "Вы не можете завершить этот заказ" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

module.exports = {
  getUserOrders,
  createOrder,
  addDishToOrder,
  getNotCreateOrderDetails,
  changeDishQuantity,
  removeDishFromOrder,
  addTableToOrder,
  removeTableFromOrder,
  cancelOrder,
  getOrders,
  confirmOrder,
  finishOrder,
};
