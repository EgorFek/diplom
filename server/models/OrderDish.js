module.exports = (sequelize, DataTypes) => {
  const OrderDish = sequelize.define(
    "OrderDish",
    {
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: false }
  );

  OrderDish.associate = (models) => {
    OrderDish.belongsTo(models.Order, { onDelete: "CASCADE" });
    OrderDish.belongsTo(models.Dish, { onDelete: "CASCADE" });
  };

  return OrderDish;
};
