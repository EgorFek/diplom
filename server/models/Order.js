module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      orderedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
    },
    { timestamps: false }
  );

  Order.associate = (models) => {
    Order.belongsToMany(models.Dish, {
      through: models.OrderDish,
      onDelete: "CASCADE",
    });
    Order.belongsToMany(models.Table, {
      through: models.TableReservation,
      onDelete: "CASCADE",
    });
    Order.belongsTo(models.User, { onDelete: "CASCADE" });
    Order.belongsTo(models.OrderStatus, { onDelete: "CASCADE" });
  };

  return Order;
};
