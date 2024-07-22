const { User, UserStatus } = require("../models");
const { escape } = require("lodash");
const bcrypt = require("bcrypt");

//Получение записей с пользователями
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: UserStatus,
      },
    });

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "Ошибка сервера" });
  }
};

//Получение статуса аутентификации, для связи с React
const getAuthStatus = async (req, res) => {
  if (req.session && req.session.user) {
    const user = await User.findOne({ where: { id: req.session.user.id } });
    return res.status(200).json({
      isAuth: true,
      user: user,
    });
  }
  return res.status(200).json({ isAuth: false, user: null });
};

//Выход из аккаунта
const logout = (req, res) => {
  req.session.user = null;
  req.session.order = null;
  res.status(200).json({ success: true });
};

//Вход в аккаунт
const login = async (req, res) => {
  const { email, password } = req.body;

  const safeEmail = escape(email);
  const safePassword = escape(password);

  try {
    const user = await User.findOne({ where: { email: safeEmail } });

    if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Пользователя с такой почтой не существует",
      });
    }

    //Проверка хешированного пароля
    const isAvaliablePassword = await bcrypt.compare(
      safePassword,
      user.password
    );

    if (!isAvaliablePassword) {
      return res.status(400).json({ success: false, msg: "Неверный пароль" });
    }

    req.session.user = user;

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

//Создание пользователя
const createUser = async (req, res) => {
  try {
    const { email, password, name, surname } = req.body;

    //Замена символов, введенных пользователем на их безованые варианты
    const safeEmail = escape(email);
    const safePassword = escape(password);
    const safeName = escape(name);
    const safeSurname = escape(surname);

    const UserStatusId = 1;

    const checkUser = await User.findOne({ where: { email: safeEmail } });

    if (checkUser) {
      return res.status(200).json({
        success: false,
        msg: "Пользователь с такой почтой уже существует",
      });
    }

    const user = await User.create({
      email: safeEmail,
      password: safePassword,
      name: safeName,
      surname: safeSurname,
      UserStatusId,
    });

    req.session.user = user;

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    //Вывод сообщения об ошибке валидации
    let errorMsg = err.message.replace("Validation error: ", "");
    res.status(200).json({ success: false, msg: errorMsg });
  }
};

//Изменение лючных данных пользователя
const updateUserPeronalData = async (req, res) => {
  try {
    const { name, surname, email } = req.body;

    if (!name || !surname || !email) {
      return res
        .status(400)
        .json({ success: false, msg: "Новые данные введены некорректно" });
    }

    const checkEmail = await User.findOne({ where: { email: email } });

    if (checkEmail && checkEmail.id !== req.session.user.id) {
      return res.status(400).json({
        success: false,
        msg: "Пользователь с такой почтой уже существует",
      });
    }

    await User.update(
      {
        name,
        surname,
        email,
      },
      { where: { id: req.session.user.id } }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

//Изменение стратуса пользователя на admin
const changeStatusToAdmin = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Пользователь не найден" });
    }

    await user.update({ UserStatusId: 2 });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

//Изменение статуса пользователя на user
const changeStatusToUser = async (req, res) => {
  try {
    const { id } = req.body;

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Пользователь не найден" });
    }

    await user.update({ UserStatusId: 1 });

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

//Удаление пользователя
const destroy = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, msg: "Пользователь не найден" });
    }

    await user.destroy();

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ success: false, msg: "Ошибка сервера, попробуйте позднее" });
  }
};

module.exports = {
  updateUserPeronalData,
  getAuthStatus,
  createUser,
  getUsers,
  logout,
  login,
  changeStatusToAdmin,
  changeStatusToUser,
  destroy,
};
