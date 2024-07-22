const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Пользователь с такой почтой уже зарегистрирован",
        },
        validate: {
          notEmpty: {
            msg: 'Поле "Почта" не должно быть пустым',
          },
          isEmail: {
            msg: 'Поле "Почта" заполнено некорректно',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Поле "Пароль" не должно быть пустым',
          },
          len: {
            args: [8, Infinity],
            msg: "Длина пароля должна быть не менее 8 символов",
          },
        },
      },
      name: {
        type: DataTypes.STRING(40),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Поле "Имя" не должно быть пустым',
          },
        },
      },
      surname: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Поле "Фамилия" не должно быть пустым',
          },
        },
      },
    },
    {
      timestamps: false,
      hooks: {
        beforeCreate: async (user) => {
          const salt = bcrypt.genSaltSync(12);
          const hash = bcrypt.hashSync(user.password, salt);
          user.password = hash;
        },
      },
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Order, { onDelete: "CASCADE" });
    User.belongsTo(models.UserStatus, { onDelete: "CASCADE" });
  };

  return User;
};
