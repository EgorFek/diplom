module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define(
    "Dish",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      imageName: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
      },
    },
    { timestamps: false }
  );

  Dish.associate = (models) => {
    Dish.belongsToMany(models.Order, {
      through: models.OrderDish,
      onDelete: "CASCADE",
    });
    Dish.belongsTo(models.DishCategory, {
      onDelete: "CASCADE",
    });
  };

  return Dish;
};
