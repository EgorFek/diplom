module.exports = (sequelize, DataTypes) => {
  const OrderStatus = sequelize.define(
    "OrderStatus",
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  OrderStatus.associate = (models) => {
    OrderStatus.hasMany(models.Order, { onDelete: "CASCADE" });
  };

  return OrderStatus;
};
