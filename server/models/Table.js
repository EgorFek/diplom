module.exports = (sequelize, DataTypes) => {
  const Table = sequelize.define(
    "Table",
    {
      number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          value: true,
          msg: "Столик с таким номером уже существует",
        },
        validate: {
          notEmpty: {
            msg: 'Поле "Номер" не должно быть пустым',
          },
        },
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Поле "Вместимоть" не должно быть пустым',
          },
          isNumeric: {
            msg: 'Поле "Вместимоть" должно быть числом',
          },
        },
      },
      image: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  Table.associate = (models) => {
    Table.belongsToMany(models.Order, {
      through: models.TableReservation,
      onDelete: "CASCADE",
    });
  };

  return Table;
};
